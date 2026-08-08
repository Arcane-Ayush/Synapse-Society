-- ============================================================
-- SYNAPSE SOCIETY — NEURAL NEXUS 2026 EVENT SCHEMA
-- Real-Time Event Tables for 40 Squads, Live States,
-- Attendee Submissions, and Redemption Quiz Bank
-- ============================================================

-- 1. EVENT TEAMS TABLE (40 Event Squads)
CREATE TABLE IF NOT EXISTS public.event_teams (
    id SERIAL PRIMARY KEY,
    code TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    badge TEXT DEFAULT '⚡',
    color TEXT DEFAULT '#00F0FF',
    motto TEXT,
    s_coins INTEGER DEFAULT 0,
    is_qualified BOOLEAN DEFAULT TRUE,
    is_eliminated BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.event_teams ENABLE ROW LEVEL SECURITY;

CREATE POLICY "event_teams_public_read" ON public.event_teams
    FOR SELECT USING (true);

CREATE POLICY "event_teams_lead_write" ON public.event_teams
    FOR ALL USING (public.get_my_role() IN ('lead', 'administrator'))
    WITH CHECK (public.get_my_role() IN ('lead', 'administrator'));


-- 2. EVENT LIVE STATE TABLE
CREATE TABLE IF NOT EXISTS public.event_states (
    id TEXT PRIMARY KEY DEFAULT 'nexus_2026',
    phase TEXT NOT NULL DEFAULT 'phase_0_checkin',
    phase_title TEXT NOT NULL DEFAULT 'Agent Check-In & Identity Pass',
    round_timer_end TIMESTAMPTZ,
    red_bull_timer_end TIMESTAMPTZ,
    round_1_prompt JSONB DEFAULT '{"title": "Reverse Hackathon · Deconstruct & Rebuild", "rewardSCoins": 500, "description": "Analyze the obfuscated neural algorithm provided on the stage screen. Identify the logical vulnerability, re-architect the data structure, and submit your GitHub repository."}'::jsonb,
    round_2_prompt JSONB DEFAULT '{"title": "Neural Architecture Proposal", "rewardSCoins": 1000, "description": "Submit your team proposal detailing the end-to-end deployment strategy for the reverse-engineered model with latency benchmarks."}'::jsonb,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.event_states ENABLE ROW LEVEL SECURITY;

CREATE POLICY "event_states_public_read" ON public.event_states
    FOR SELECT USING (true);

CREATE POLICY "event_states_lead_write" ON public.event_states
    FOR ALL USING (public.get_my_role() IN ('lead', 'administrator'))
    WITH CHECK (public.get_my_role() IN ('lead', 'administrator'));


-- 3. EVENT ATTENDEES TABLE (Check-Ins, S-Coins, Submissions)
CREATE TABLE IF NOT EXISTS public.event_attendees (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE NOT NULL,
    agent_number TEXT NOT NULL,
    team_id INTEGER REFERENCES public.event_teams(id) ON DELETE SET NULL,
    s_coins INTEGER DEFAULT 0,
    round_1_submission_url TEXT,
    round_1_notes TEXT,
    round_1_submitted_at TIMESTAMPTZ,
    round_2_submission_url TEXT,
    round_2_notes TEXT,
    round_2_submitted_at TIMESTAMPTZ,
    quiz_score INTEGER DEFAULT 0,
    checked_in_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.event_attendees ENABLE ROW LEVEL SECURITY;

CREATE POLICY "event_attendees_read_all" ON public.event_attendees
    FOR SELECT USING (true);

CREATE POLICY "event_attendees_self_upsert" ON public.event_attendees
    FOR ALL USING (auth.uid() = user_id OR public.get_my_role() IN ('lead', 'administrator'))
    WITH CHECK (auth.uid() = user_id OR public.get_my_role() IN ('lead', 'administrator'));


-- 4. EVENT REDEMPTION QUIZ QUESTIONS BANK
CREATE TABLE IF NOT EXISTS public.event_quiz_questions (
    id SERIAL PRIMARY KEY,
    question TEXT NOT NULL,
    options TEXT[] NOT NULL,
    correct_index INTEGER NOT NULL,
    reward_s_coins INTEGER DEFAULT 100,
    category TEXT DEFAULT 'general',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.event_quiz_questions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "event_quiz_public_read" ON public.event_quiz_questions
    FOR SELECT USING (true);

CREATE POLICY "event_quiz_lead_write" ON public.event_quiz_questions
    FOR ALL USING (public.get_my_role() IN ('lead', 'administrator'))
    WITH CHECK (public.get_my_role() IN ('lead', 'administrator'));


-- Seed Initial State Row
INSERT INTO public.event_states (id, phase, phase_title)
VALUES ('nexus_2026', 'phase_0_checkin', 'Agent Check-In & Identity Pass')
ON CONFLICT (id) DO NOTHING;
