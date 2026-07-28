-- ============================================================
-- SYNAPSE SOCIETY — CORE SCHEMA
-- Migration 001: All table definitions
-- ============================================================

-- ── Enable UUID extension ──────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- CONFIGURABLE LOOKUP TABLES
-- (These replace hardcoded values everywhere in the schema)
-- ============================================================

-- Rarity definitions (configurable — no hardcoding elsewhere)
CREATE TABLE IF NOT EXISTS rarities (
    id          SERIAL PRIMARY KEY,
    name        TEXT NOT NULL UNIQUE,   -- e.g. 'Common', 'Rare', 'Mythic'
    display_order INT NOT NULL DEFAULT 0,
    color_hex   TEXT,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Level thresholds (configurable — frontend reads this, never hardcoded)
CREATE TABLE IF NOT EXISTS levels (
    level        INT PRIMARY KEY,
    label        TEXT NOT NULL,          -- e.g. 'Synapse Access Pass', 'Synapse Spark'
    xp_required  INT NOT NULL DEFAULT 0, -- XP to reach this level
    card_id      TEXT,                   -- FK added below after cards table
    created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Reserved / profanity usernames block list (configurable via admin)
CREATE TABLE IF NOT EXISTS reserved_usernames (
    id        SERIAL PRIMARY KEY,
    word      TEXT NOT NULL UNIQUE,
    reason    TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- EVENTS (referenced by activities, qr_codes, cards, missions)
-- ============================================================
CREATE TABLE IF NOT EXISTS events (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title       TEXT NOT NULL,
    description TEXT,
    location    TEXT,
    banner_url  TEXT,
    organizer   TEXT,
    start_date  DATE,
    end_date    DATE,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- CARDS
-- ============================================================
CREATE TABLE IF NOT EXISTS cards (
    id              TEXT PRIMARY KEY,       -- e.g. 'SAP-001', 'EVC-LAUNCH-001'
    name            TEXT NOT NULL,
    description     TEXT,
    image_url       TEXT,
    display_mode    TEXT NOT NULL DEFAULT 'artwork' CHECK (display_mode IN ('artwork', 'full_card')),
    type            TEXT NOT NULL CHECK (type IN ('membership', 'event', 'achievement', 'special')),
    rarity          TEXT NOT NULL REFERENCES rarities(name),
    level_required  INT,                    -- NULL = not a level card
    event_id        UUID REFERENCES events(id) ON DELETE SET NULL,
    worth           INT DEFAULT 0,          -- XP equivalent / prestige value
    max_supply      INT,                    -- NULL = unlimited
    release_date    DATE,

    -- Visual/design data (matches frontend card structure)
    primary_color   TEXT,
    secondary_color TEXT,
    glow_color      TEXT,
    foil_colors     TEXT[],                 -- Array of hex colors
    character_emoji TEXT,

    is_active       BOOLEAN NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Now that cards exists, add the FK from levels
ALTER TABLE levels
    ADD CONSTRAINT fk_levels_card
    FOREIGN KEY (card_id) REFERENCES cards(id) ON DELETE SET NULL;

-- ============================================================
-- PROFILES (extends auth.users — 1:1)
-- ============================================================
CREATE TABLE IF NOT EXISTS profiles (
    id              UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username        TEXT UNIQUE NOT NULL,
    display_name    TEXT NOT NULL,
    email           TEXT NOT NULL,
    avatar_url      TEXT,
    xp              INT NOT NULL DEFAULT 0 CHECK (xp >= 0),
    current_level   INT NOT NULL DEFAULT 0 REFERENCES levels(level),
    total_cards     INT NOT NULL DEFAULT 0 CHECK (total_cards >= 0),
    club_role       TEXT NOT NULL DEFAULT 'member' CHECK (club_role IN ('member', 'lead', 'administrator')),
    date_joined     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_login      TIMESTAMPTZ,
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_profiles_username ON profiles(username);
CREATE INDEX IF NOT EXISTS idx_profiles_xp ON profiles(xp DESC); -- Leaderboard
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(club_role);

-- ============================================================
-- XP HISTORY (immutable audit log — never delete rows)
-- ============================================================
CREATE TABLE IF NOT EXISTS xp_history (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    amount      INT NOT NULL,               -- positive = award, negative = deduction
    reason      TEXT NOT NULL,
    source      TEXT NOT NULL CHECK (source IN (
        'qr_scan', 'mission', 'activity', 'event',
        'admin_award', 'admin_deduct', 'system', 'other'
    )),
    reference_id UUID,                      -- optional FK to qr_code / mission / activity
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_xp_history_user ON xp_history(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_xp_history_source ON xp_history(source);

-- ============================================================
-- USER CARDS (many-to-many)
-- ============================================================
CREATE TABLE IF NOT EXISTS user_cards (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    card_id     TEXT NOT NULL REFERENCES cards(id) ON DELETE CASCADE,
    unlocked_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    source      TEXT NOT NULL DEFAULT 'system', -- 'level_up', 'mission', 'qr_scan', 'admin', etc.
    UNIQUE (user_id, card_id)  -- A user can only have each card once
);

CREATE INDEX IF NOT EXISTS idx_user_cards_user ON user_cards(user_id);
CREATE INDEX IF NOT EXISTS idx_user_cards_card ON user_cards(card_id);

-- ============================================================
-- ACTIVITIES (Adventure Board)
-- ============================================================
CREATE TABLE IF NOT EXISTS activities (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title        TEXT NOT NULL,
    description  TEXT,
    type         TEXT NOT NULL,           -- 'Workshop', 'Hackathon', 'Study Jam', etc.
    status       TEXT NOT NULL DEFAULT 'Upcoming' CHECK (status IN ('Upcoming', 'Active', 'Completed', 'Planned')),
    location     TEXT,
    event_date   DATE,
    time_info    TEXT,                    -- e.g. "2:00 PM – 4:00 PM"
    xp_reward    INT NOT NULL DEFAULT 0,
    register_url TEXT,
    reward_card_id TEXT REFERENCES cards(id) ON DELETE SET NULL,
    is_repeatable  BOOLEAN NOT NULL DEFAULT FALSE,
    tags         TEXT[],
    event_id     UUID REFERENCES events(id) ON DELETE SET NULL,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_activities_status ON activities(status);
CREATE INDEX IF NOT EXISTS idx_activities_date ON activities(event_date);

-- ============================================================
-- USER ACTIVITIES (completion tracking)
-- ============================================================
CREATE TABLE IF NOT EXISTS user_activities (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id      UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    activity_id  UUID NOT NULL REFERENCES activities(id) ON DELETE CASCADE,
    completed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    xp_awarded   INT NOT NULL DEFAULT 0,
    UNIQUE (user_id, activity_id)   -- enforce one completion per user (unless repeatable)
);

CREATE INDEX IF NOT EXISTS idx_user_activities_user ON user_activities(user_id);

-- ============================================================
-- MISSIONS (Weekly / seasonal missions)
-- ============================================================
CREATE TABLE IF NOT EXISTS missions (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title        TEXT NOT NULL,
    description  TEXT,
    type         TEXT NOT NULL,           -- 'Tech', 'Learning', 'Design', 'Community', etc.
    status       TEXT NOT NULL DEFAULT 'Active' CHECK (status IN ('Active', 'Upcoming', 'Completed', 'Disabled')),
    xp_reward    INT NOT NULL DEFAULT 0,
    assigned_to  TEXT NOT NULL DEFAULT 'All',  -- 'All', 'Teams', specific team/dept
    deadline     DATE,
    is_repeatable BOOLEAN NOT NULL DEFAULT FALSE,
    reset_period TEXT CHECK (reset_period IN ('weekly', 'monthly', 'seasonal', NULL)),
    reward_card_id TEXT REFERENCES cards(id) ON DELETE SET NULL,
    event_id     UUID REFERENCES events(id) ON DELETE SET NULL,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_missions_status ON missions(status);

-- ============================================================
-- USER MISSIONS (per-user mission progress)
-- ============================================================
CREATE TABLE IF NOT EXISTS user_missions (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id       UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    mission_id    UUID NOT NULL REFERENCES missions(id) ON DELETE CASCADE,
    status        TEXT NOT NULL DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed', 'failed')),
    started_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    completed_at  TIMESTAMPTZ,
    xp_awarded    INT NOT NULL DEFAULT 0,
    UNIQUE (user_id, mission_id)
);

CREATE INDEX IF NOT EXISTS idx_user_missions_user ON user_missions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_missions_status ON user_missions(status);

-- ============================================================
-- QR CODES
-- ============================================================
CREATE TABLE IF NOT EXISTS qr_codes (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code          TEXT NOT NULL UNIQUE,   -- the actual scannable value
    label         TEXT,                   -- human-readable description
    event_id      UUID REFERENCES events(id) ON DELETE SET NULL,
    reward_xp     INT NOT NULL DEFAULT 0,
    reward_card_id TEXT REFERENCES cards(id) ON DELETE SET NULL,
    is_active     BOOLEAN NOT NULL DEFAULT TRUE,
    is_reusable   BOOLEAN NOT NULL DEFAULT FALSE, -- one-time or multi-scan
    created_by    UUID REFERENCES profiles(id) ON DELETE SET NULL,
    expires_at    TIMESTAMPTZ,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_qr_codes_code ON qr_codes(code);
CREATE INDEX IF NOT EXISTS idx_qr_codes_active ON qr_codes(is_active);

-- ============================================================
-- QR SCAN HISTORY (abuse prevention + audit)
-- ============================================================
CREATE TABLE IF NOT EXISTS qr_scan_history (
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id    UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    qr_id      UUID NOT NULL REFERENCES qr_codes(id) ON DELETE CASCADE,
    scanned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    ip_address TEXT,
    user_agent TEXT,
    success    BOOLEAN NOT NULL DEFAULT TRUE,
    failure_reason TEXT  -- populated if success = false
);

CREATE INDEX IF NOT EXISTS idx_qr_scan_user ON qr_scan_history(user_id, qr_id);
CREATE INDEX IF NOT EXISTS idx_qr_scan_qr ON qr_scan_history(qr_id);

-- ============================================================
-- TEAMS / FACTIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS teams (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name        TEXT NOT NULL UNIQUE,
    badge_emoji TEXT,
    color_hex   TEXT,
    total_tokens INT NOT NULL DEFAULT 0 CHECK (total_tokens >= 0),
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS team_members (
    id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    team_id   UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    user_id   UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (user_id)  -- a user can only be on one team
);

CREATE INDEX IF NOT EXISTS idx_team_members_team ON team_members(team_id);
CREATE INDEX IF NOT EXISTS idx_teams_tokens ON teams(total_tokens DESC);

-- ============================================================
-- PROJECTS (Student Builds)
-- ============================================================
CREATE TABLE IF NOT EXISTS projects (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title        TEXT NOT NULL,
    team_name    TEXT,
    description  TEXT,
    image_url    TEXT,
    demo_url     TEXT,
    github_url   TEXT,
    tags         TEXT[],
    is_featured  BOOLEAN NOT NULL DEFAULT FALSE,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
