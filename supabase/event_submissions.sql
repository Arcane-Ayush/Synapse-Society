-- ============================================================
-- event_submissions table
-- Stores Round 1 (pitch deck URL) and Round 2 (PDF concept) submissions
-- ============================================================

CREATE TABLE IF NOT EXISTS event_submissions (
    id              UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
    team_id         INT           NOT NULL REFERENCES event_teams(id) ON DELETE CASCADE,
    user_id         UUID          REFERENCES auth.users(id) ON DELETE SET NULL,
    round           SMALLINT      NOT NULL CHECK (round IN (1, 2, 3)),
    submission_url  TEXT,          -- Round 1: Google Slides URL; Round 2: Supabase storage path
    notes           TEXT,          -- Optional text output from team
    file_name       TEXT,          -- Round 2: PDF filename
    file_size_bytes BIGINT,        -- Round 2: file size
    s_coins_awarded INT            DEFAULT 0,
    submitted_at    TIMESTAMPTZ    NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ    NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_event_submissions_team_round ON event_submissions(team_id, round);

ALTER TABLE event_submissions ENABLE ROW LEVEL SECURITY;

-- Authenticated users can submit
CREATE POLICY "Authenticated users can submit" ON event_submissions
    FOR INSERT TO authenticated
    WITH CHECK (auth.uid() = user_id);

-- Authenticated users can read all (judges need to view all teams)
CREATE POLICY "Authenticated users can read all submissions" ON event_submissions
    FOR SELECT TO authenticated
    USING (true);
