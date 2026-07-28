-- ============================================================
-- SYNAPSE SOCIETY — ROW LEVEL SECURITY POLICIES
-- Migration 003: RLS for all tables
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.xp_history     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_cards     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activities     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.missions       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_missions  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.qr_codes       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.qr_scan_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teams          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cards          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rarities       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.levels         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reserved_usernames ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- Helper: check current user's role
-- ============================================================
CREATE OR REPLACE FUNCTION public.get_my_role()
RETURNS TEXT
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
    SELECT club_role FROM public.profiles WHERE id = auth.uid();
$$;

-- ============================================================
-- PROFILES
-- ============================================================
-- Anyone can read public profiles (for leaderboard, team pages)
CREATE POLICY "profiles_public_read" ON public.profiles
    FOR SELECT USING (TRUE);

-- Users can update only their own profile
CREATE POLICY "profiles_self_update" ON public.profiles
    FOR UPDATE USING (id = auth.uid());

-- System (trigger) can insert profiles
CREATE POLICY "profiles_system_insert" ON public.profiles
    FOR INSERT WITH CHECK (id = auth.uid());

-- Admins can do anything
CREATE POLICY "profiles_admin_all" ON public.profiles
    FOR ALL USING (public.get_my_role() = 'administrator');

-- ============================================================
-- XP HISTORY
-- ============================================================
-- Users read only their own XP history
CREATE POLICY "xp_history_self_read" ON public.xp_history
    FOR SELECT USING (user_id = auth.uid());

-- Only server-side functions insert (via SECURITY DEFINER)
-- No direct inserts allowed from client
CREATE POLICY "xp_history_no_client_insert" ON public.xp_history
    FOR INSERT WITH CHECK (FALSE);

-- Admins can read all XP history
CREATE POLICY "xp_history_admin_read" ON public.xp_history
    FOR SELECT USING (public.get_my_role() = 'administrator');

-- ============================================================
-- CARDS (definitions — public read)
-- ============================================================
CREATE POLICY "cards_public_read" ON public.cards
    FOR SELECT USING (TRUE);

-- Only admins can create/modify card definitions
CREATE POLICY "cards_admin_write" ON public.cards
    FOR ALL USING (public.get_my_role() = 'administrator');

-- ============================================================
-- USER CARDS (owned cards)
-- ============================================================
-- Users can see their own cards
CREATE POLICY "user_cards_self_read" ON public.user_cards
    FOR SELECT USING (user_id = auth.uid());

-- No client inserts — only server-side functions (award_xp, etc.)
CREATE POLICY "user_cards_no_client_insert" ON public.user_cards
    FOR INSERT WITH CHECK (FALSE);

-- Admins can manage all user cards
CREATE POLICY "user_cards_admin_all" ON public.user_cards
    FOR ALL USING (public.get_my_role() = 'administrator');

-- ============================================================
-- ACTIVITIES (Adventure Board)
-- ============================================================
-- Public read — everyone can see activities
CREATE POLICY "activities_public_read" ON public.activities
    FOR SELECT USING (TRUE);

-- Leads and admins can create/update activities
CREATE POLICY "activities_lead_write" ON public.activities
    FOR INSERT WITH CHECK (public.get_my_role() IN ('lead', 'administrator'));

CREATE POLICY "activities_lead_update" ON public.activities
    FOR UPDATE USING (public.get_my_role() IN ('lead', 'administrator'));

CREATE POLICY "activities_admin_delete" ON public.activities
    FOR DELETE USING (public.get_my_role() = 'administrator');

-- ============================================================
-- USER ACTIVITIES (completion tracking)
-- ============================================================
CREATE POLICY "user_activities_self_read" ON public.user_activities
    FOR SELECT USING (user_id = auth.uid());

-- Server-side only inserts
CREATE POLICY "user_activities_no_client_insert" ON public.user_activities
    FOR INSERT WITH CHECK (FALSE);

CREATE POLICY "user_activities_admin_read" ON public.user_activities
    FOR SELECT USING (public.get_my_role() = 'administrator');

-- ============================================================
-- MISSIONS
-- ============================================================
CREATE POLICY "missions_public_read" ON public.missions
    FOR SELECT USING (TRUE);

CREATE POLICY "missions_lead_write" ON public.missions
    FOR INSERT WITH CHECK (public.get_my_role() IN ('lead', 'administrator'));

CREATE POLICY "missions_lead_update" ON public.missions
    FOR UPDATE USING (public.get_my_role() IN ('lead', 'administrator'));

CREATE POLICY "missions_admin_delete" ON public.missions
    FOR DELETE USING (public.get_my_role() = 'administrator');

-- ============================================================
-- USER MISSIONS
-- ============================================================
CREATE POLICY "user_missions_self_read" ON public.user_missions
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "user_missions_no_client_insert" ON public.user_missions
    FOR INSERT WITH CHECK (FALSE);

CREATE POLICY "user_missions_admin_all" ON public.user_missions
    FOR ALL USING (public.get_my_role() = 'administrator');

-- ============================================================
-- QR CODES
-- ============================================================
-- Only leads/admins can see QR code details
CREATE POLICY "qr_codes_lead_read" ON public.qr_codes
    FOR SELECT USING (public.get_my_role() IN ('lead', 'administrator'));

CREATE POLICY "qr_codes_lead_write" ON public.qr_codes
    FOR INSERT WITH CHECK (public.get_my_role() IN ('lead', 'administrator'));

CREATE POLICY "qr_codes_lead_update" ON public.qr_codes
    FOR UPDATE USING (public.get_my_role() IN ('lead', 'administrator'));

CREATE POLICY "qr_codes_admin_delete" ON public.qr_codes
    FOR DELETE USING (public.get_my_role() = 'administrator');

-- ============================================================
-- QR SCAN HISTORY
-- ============================================================
CREATE POLICY "qr_scan_self_read" ON public.qr_scan_history
    FOR SELECT USING (user_id = auth.uid());

-- No client inserts — Edge Function handles this
CREATE POLICY "qr_scan_no_client_insert" ON public.qr_scan_history
    FOR INSERT WITH CHECK (FALSE);

CREATE POLICY "qr_scan_admin_read" ON public.qr_scan_history
    FOR SELECT USING (public.get_my_role() = 'administrator');

-- ============================================================
-- TEAMS & TEAM MEMBERS (public read for leaderboard)
-- ============================================================
CREATE POLICY "teams_public_read" ON public.teams
    FOR SELECT USING (TRUE);

CREATE POLICY "teams_admin_write" ON public.teams
    FOR ALL USING (public.get_my_role() = 'administrator');

CREATE POLICY "team_members_public_read" ON public.team_members
    FOR SELECT USING (TRUE);

CREATE POLICY "team_members_admin_write" ON public.team_members
    FOR ALL USING (public.get_my_role() = 'administrator');

-- ============================================================
-- LOOKUP TABLES (public read, admin write)
-- ============================================================
CREATE POLICY "rarities_public_read" ON public.rarities FOR SELECT USING (TRUE);
CREATE POLICY "rarities_admin_write" ON public.rarities FOR ALL USING (public.get_my_role() = 'administrator');

CREATE POLICY "levels_public_read" ON public.levels FOR SELECT USING (TRUE);
CREATE POLICY "levels_admin_write" ON public.levels FOR ALL USING (public.get_my_role() = 'administrator');

CREATE POLICY "events_public_read" ON public.events FOR SELECT USING (TRUE);
CREATE POLICY "events_lead_write" ON public.events FOR INSERT WITH CHECK (public.get_my_role() IN ('lead', 'administrator'));
CREATE POLICY "events_lead_update" ON public.events FOR UPDATE USING (public.get_my_role() IN ('lead', 'administrator'));
CREATE POLICY "events_admin_delete" ON public.events FOR DELETE USING (public.get_my_role() = 'administrator');

CREATE POLICY "projects_public_read" ON public.projects FOR SELECT USING (TRUE);
CREATE POLICY "projects_admin_write" ON public.projects FOR ALL USING (public.get_my_role() = 'administrator');

-- Reserved usernames: admins only
CREATE POLICY "reserved_admin_all" ON public.reserved_usernames
    FOR ALL USING (public.get_my_role() = 'administrator');
