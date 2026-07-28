-- Ensure all existing users have Level 0 Access Pass in user_cards
INSERT INTO public.user_cards (user_id, card_id, source)
SELECT id, 'SAP-001', 'welcome'
FROM public.profiles
ON CONFLICT (user_id, card_id) DO NOTHING;

-- Sync total_cards count for all profiles
UPDATE public.profiles p
SET total_cards = (
    SELECT COUNT(*) FROM public.user_cards uc WHERE uc.user_id = p.id
);
