-- ============================================================
-- SYNAPSE SOCIETY — FUNCTIONS & TRIGGERS
-- Migration 002: PostgreSQL functions for transactional operations
-- ============================================================

-- ============================================================
-- TRIGGER: Auto-create profile when a new user signs up
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
    v_username TEXT;
BEGIN
    -- Generate a default username from email prefix
    v_username := split_part(NEW.email, '@', 1);

    -- Ensure uniqueness by appending random suffix if taken
    WHILE EXISTS (SELECT 1 FROM public.profiles WHERE username = v_username) LOOP
        v_username := split_part(NEW.email, '@', 1) || '_' || floor(random() * 9000 + 1000)::TEXT;
    END LOOP;

    INSERT INTO public.profiles (id, username, display_name, email)
    VALUES (
        NEW.id,
        v_username,
        COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', v_username),
        NEW.email
    );

    RETURN NEW;
END;
$$;

-- Attach trigger to auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- FUNCTION: check_username_reserved(username TEXT) → BOOLEAN
-- Returns TRUE if username is reserved/profane (blocked)
-- ============================================================
CREATE OR REPLACE FUNCTION public.check_username_reserved(p_username TEXT)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.reserved_usernames
        WHERE word = lower(p_username)
    );
$$;

-- ============================================================
-- FUNCTION: award_xp(user_id, amount, reason, source, reference_id?)
-- Transactional XP award with history logging + level-up check
-- ============================================================
CREATE OR REPLACE FUNCTION public.award_xp(
    p_user_id     UUID,
    p_amount      INT,
    p_reason      TEXT,
    p_source      TEXT,
    p_reference_id UUID DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
    v_new_xp        INT;
    v_old_level     INT;
    v_new_level     INT;
    v_level_changed BOOLEAN := FALSE;
    v_unlocked_card TEXT := NULL;
BEGIN
    -- Input validation
    IF p_amount = 0 THEN
        RETURN jsonb_build_object('success', false, 'error', 'XP amount cannot be zero');
    END IF;

    -- Lock the profile row for update (prevents race conditions)
    SELECT xp, current_level
    INTO v_new_xp, v_old_level
    FROM public.profiles
    WHERE id = p_user_id
    FOR UPDATE;

    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'error', 'User not found');
    END IF;

    -- Apply XP (never go below 0)
    v_new_xp := GREATEST(0, v_new_xp + p_amount);

    -- Determine new level based on configurable levels table
    SELECT COALESCE(
        (SELECT level FROM public.levels
         WHERE xp_required <= v_new_xp
         ORDER BY xp_required DESC
         LIMIT 1),
        0
    ) INTO v_new_level;

    -- Detect level-up
    IF v_new_level > v_old_level THEN
        v_level_changed := TRUE;
    END IF;

    -- Update profile atomically
    UPDATE public.profiles
    SET
        xp            = v_new_xp,
        current_level = v_new_level,
        updated_at    = NOW()
    WHERE id = p_user_id;

    -- Log the XP change (immutable audit trail)
    INSERT INTO public.xp_history (user_id, amount, reason, source, reference_id)
    VALUES (p_user_id, p_amount, p_reason, p_source, p_reference_id);

    -- If leveled up, unlock the corresponding level card
    IF v_level_changed THEN
        SELECT card_id INTO v_unlocked_card
        FROM public.levels
        WHERE level = v_new_level;

        IF v_unlocked_card IS NOT NULL THEN
            INSERT INTO public.user_cards (user_id, card_id, source)
            VALUES (p_user_id, v_unlocked_card, 'level_up')
            ON CONFLICT DO NOTHING;

            -- Update total_cards count
            UPDATE public.profiles
            SET total_cards = (SELECT COUNT(*) FROM public.user_cards WHERE user_id = p_user_id)
            WHERE id = p_user_id;
        END IF;
    END IF;

    RETURN jsonb_build_object(
        'success',       true,
        'xp_new',        v_new_xp,
        'level_old',     v_old_level,
        'level_new',     v_new_level,
        'leveled_up',    v_level_changed,
        'card_unlocked', v_unlocked_card
    );
END;
$$;

-- ============================================================
-- FUNCTION: update_profile_updated_at() — auto-timestamp trigger
-- ============================================================
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

-- Attach updated_at triggers
DROP TRIGGER IF EXISTS set_profiles_updated_at ON public.profiles;
CREATE TRIGGER set_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS set_activities_updated_at ON public.activities;
CREATE TRIGGER set_activities_updated_at
    BEFORE UPDATE ON public.activities
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS set_missions_updated_at ON public.missions;
CREATE TRIGGER set_missions_updated_at
    BEFORE UPDATE ON public.missions
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================
-- FUNCTION: get_leaderboard(limit, offset) → TABLE
-- Optimized leaderboard using index on xp DESC
-- ============================================================
CREATE OR REPLACE FUNCTION public.get_leaderboard(
    p_limit  INT DEFAULT 50,
    p_offset INT DEFAULT 0
)
RETURNS TABLE (
    rank         BIGINT,
    user_id      UUID,
    username     TEXT,
    display_name TEXT,
    avatar_url   TEXT,
    xp           INT,
    current_level INT,
    total_cards  INT
)
LANGUAGE sql
STABLE
AS $$
    SELECT
        ROW_NUMBER() OVER (ORDER BY p.xp DESC) AS rank,
        p.id,
        p.username,
        p.display_name,
        p.avatar_url,
        p.xp,
        p.current_level,
        p.total_cards
    FROM public.profiles p
    ORDER BY p.xp DESC
    LIMIT p_limit
    OFFSET p_offset;
$$;
