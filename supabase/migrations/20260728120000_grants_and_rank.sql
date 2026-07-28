-- ============================================================
-- SYNAPSE SOCIETY — TABLE GRANTS & USER RANK RPC
-- Migration 005: Grant table permissions & calculate dynamic rank
-- ============================================================

-- Grant schema privileges to authenticated and anon roles
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated, service_role;

-- Set default grants for future tables
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON FUNCTIONS TO anon, authenticated, service_role;

-- Function: Calculate dynamic rank of a user based on XP
CREATE OR REPLACE FUNCTION public.get_user_rank(p_user_id UUID)
RETURNS INT
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
AS $$
DECLARE
    v_rank INT;
BEGIN
    SELECT rank INTO v_rank FROM (
        SELECT id, DENSE_RANK() OVER (ORDER BY xp DESC, created_at ASC) AS rank
        FROM public.profiles
    ) ranked
    WHERE id = p_user_id;

    RETURN COALESCE(v_rank, 1);
END;
$$;
