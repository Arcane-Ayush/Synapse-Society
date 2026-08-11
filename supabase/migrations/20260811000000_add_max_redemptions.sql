-- ============================================================
-- Migration: Add max_redemptions column & upgrade redeem_qr_code
-- ============================================================

-- 1. Add max_redemptions column to qr_codes
ALTER TABLE public.qr_codes ADD COLUMN IF NOT EXISTS max_redemptions INT DEFAULT NULL;

-- 2. Upgrade redeem_qr_code function:
--    - Enforces max_redemptions
--    - Uses FOR UPDATE row-locking to eliminate race conditions
--    - Automatically sets is_active = FALSE when redemption limit or expiration is reached
CREATE OR REPLACE FUNCTION public.redeem_qr_code(
    p_user_id UUID,
    p_code TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
    v_qr RECORD;
    v_already_scanned BOOLEAN;
    v_redemption_count INT;
    v_award_result JSONB;
BEGIN
    -- Input validation
    IF p_user_id IS NULL OR p_code IS NULL OR trim(p_code) = '' THEN
        RETURN jsonb_build_object('success', false, 'error', 'Invalid parameters provided.');
    END IF;

    -- Find and lock active QR code row FOR UPDATE (prevents race conditions)
    SELECT * INTO v_qr
    FROM public.qr_codes
    WHERE upper(code) = upper(trim(p_code))
      AND is_active = TRUE
    FOR UPDATE;

    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'error', 'Invalid, expired, or inactive QR code token.');
    END IF;

    -- Check expiration date if set
    IF v_qr.expires_at IS NOT NULL AND v_qr.expires_at < NOW() THEN
        UPDATE public.qr_codes SET is_active = FALSE WHERE id = v_qr.id;
        RETURN jsonb_build_object('success', false, 'error', 'This QR code has expired.');
    END IF;

    -- Check if user has already scanned this QR code
    SELECT EXISTS (
        SELECT 1 FROM public.qr_scan_history
        WHERE user_id = p_user_id AND qr_id = v_qr.id AND success = TRUE
    ) INTO v_already_scanned;

    IF v_already_scanned THEN
        RETURN jsonb_build_object('success', false, 'error', 'You have already redeemed this QR code.');
    END IF;

    -- Count total successful redemptions for this QR code across all users
    SELECT COUNT(*) INTO v_redemption_count
    FROM public.qr_scan_history
    WHERE qr_id = v_qr.id AND success = TRUE;

    -- Check max redemptions limit (if max_redemptions is set)
    IF v_qr.max_redemptions IS NOT NULL AND v_redemption_count >= v_qr.max_redemptions THEN
        UPDATE public.qr_codes SET is_active = FALSE WHERE id = v_qr.id;
        RETURN jsonb_build_object(
            'success', false,
            'error', format('This QR code has reached its maximum redemption limit (%s/%s users).', v_redemption_count, v_qr.max_redemptions)
        );
    END IF;

    -- Record scan in audit trail
    INSERT INTO public.qr_scan_history (user_id, qr_id, success)
    VALUES (p_user_id, v_qr.id, TRUE);

    -- Increment count
    v_redemption_count := v_redemption_count + 1;

    -- Auto-deactivate QR code if max redemptions limit is now reached
    IF v_qr.max_redemptions IS NOT NULL AND v_redemption_count >= v_qr.max_redemptions THEN
        UPDATE public.qr_codes SET is_active = FALSE WHERE id = v_qr.id;
    END IF;

    -- Award XP if configured
    IF v_qr.reward_xp > 0 THEN
        v_award_result := public.award_xp(
            p_user_id,
            v_qr.reward_xp,
            'QR Code Redemption: ' || COALESCE(v_qr.label, v_qr.code),
            'qr_code',
            v_qr.id
        );
    ELSE
        v_award_result := jsonb_build_object('success', true, 'xp_awarded', 0, 'leveled_up', false);
    END IF;

    -- Unlock card if configured
    IF v_qr.reward_card_id IS NOT NULL THEN
        INSERT INTO public.user_cards (user_id, card_id, source)
        VALUES (p_user_id, v_qr.reward_card_id, 'qr_code')
        ON CONFLICT DO NOTHING;

        UPDATE public.profiles
        SET total_cards = (SELECT COUNT(*) FROM public.user_cards WHERE user_id = p_user_id)
        WHERE id = p_user_id;
    END IF;

    RETURN jsonb_build_object(
        'success', true,
        'xp_awarded', v_qr.reward_xp,
        'card_unlocked', v_qr.reward_card_id,
        'leveled_up', COALESCE((v_award_result->>'leveled_up')::boolean, false),
        'level_new', (v_award_result->>'level_new')::int
    );
END;
$$;
