-- Sync total_cards count for all profiles
UPDATE public.profiles p
SET total_cards = (
    SELECT COUNT(*) FROM public.user_cards uc WHERE uc.user_id = p.id
);
