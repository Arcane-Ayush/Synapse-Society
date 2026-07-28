-- ============================================================
-- SYNAPSE SOCIETY — SEED DATA
-- Migration 004: Initial data from mockData.js
-- ============================================================

-- ── Rarities ───────────────────────────────────────────────
INSERT INTO public.rarities (name, display_order, color_hex) VALUES
    ('Common',         1, '#94A3B8'),
    ('Uncommon',       2, '#3B82F6'),
    ('Rare',           3, '#10B981'),
    ('Epic',           4, '#F59E0B'),
    ('Legendary',      5, '#EF4444'),
    ('Mythic',         6, '#7C3AED'),
    ('Event Exclusive',7, '#D946EF'),
    ('Achievement',    8, '#6366F1')
ON CONFLICT (name) DO NOTHING;

-- ── Cards (membership — must come before levels due to FK) ──
INSERT INTO public.cards (id, name, description, type, rarity, level_required, primary_color, secondary_color, glow_color, foil_colors, character_emoji, worth) VALUES
    ('SAP-001', 'Synapse Access Pass', 'Every journey begins here. Your entry into the Synapse Society universe.',
     'membership', 'Common', 0, '#475569', '#94A3B8', 'rgba(71,85,105,0.5)',
     ARRAY['#94A3B8','#CBD5E1','#F1F5F9'], '⎈', 0),

    ('SSC-L1', 'Synapse Spark', 'You''ve taken the first step. The neural pathways are forming.',
     'membership', 'Uncommon', 1, '#3B82F6', '#60A5FA', 'rgba(59,130,246,0.6)',
     ARRAY['#3B82F6','#60A5FA','#93C5FD','#DBEAFE'], '⬡', 100),

    ('SSC-L2', 'Synapse Scholar', 'Knowledge flows through your circuits. You are becoming the network.',
     'membership', 'Rare', 2, '#10B981', '#34D399', 'rgba(16,185,129,0.6)',
     ARRAY['#10B981','#34D399','#6EE7B7','#D1FAE5'], '⬢', 300),

    ('SSC-L3', 'Synapse Builder', 'You don''t just learn — you create. Projects, systems, and futures.',
     'membership', 'Epic', 3, '#F59E0B', '#FCD34D', 'rgba(245,158,11,0.6)',
     ARRAY['#F59E0B','#FCD34D','#FDE68A','#FEF3C7'], '⟁', 700),

    ('SSC-L4', 'Synapse Architect', 'You shape the direction. Others follow your signal. Architect of the future.',
     'membership', 'Legendary', 4, '#EF4444', '#F87171', 'rgba(239,68,68,0.6)',
     ARRAY['#EF4444','#F87171','#FCA5A5','#FECACA'], '❖', 1500),

    ('SSC-L5', 'Synapse Elite', 'Final Boss. You are the network. Reserved for the most accomplished.',
     'membership', 'Mythic', 5, '#7C3AED', '#D946EF', 'rgba(124,58,237,0.8)',
     ARRAY['#7C3AED','#A855F7','#D946EF','#E879F9','#F0ABFC','#FAE8FF'], '⌘', 3000)

ON CONFLICT (id) DO NOTHING;

-- ── Event / Achievement cards ───────────────────────────────
INSERT INTO public.cards (id, name, description, type, rarity, level_required, primary_color, secondary_color, glow_color, foil_colors, character_emoji, worth, max_supply, release_date) VALUES
    ('EVC-LAUNCH-001', 'Genesis Card', 'Commemorates the birth of Synapse Society. Earned at the launch event.',
     'event', 'Event Exclusive', NULL, '#7C3AED', '#E879F9', 'rgba(217,70,239,0.7)',
     ARRAY['#7C3AED','#A855F7','#D946EF','#F0ABFC'], '✧', 500, 150, '2026-07-20'),

    ('EVC-HACK-001', 'Hackathon Conqueror', 'Awarded to top performers at the Season 1 Hackathon. Battle-tested and battle-won.',
     'event', 'Event Exclusive', NULL, '#F59E0B', '#EF4444', 'rgba(245,158,11,0.7)',
     ARRAY['#F59E0B','#EF4444','#FCD34D','#F87171'], '⚲', 750, 30, '2026-09-01'),

    ('EVC-OS-001', 'Open Source Pioneer', 'Your code now lives in the open. A contribution that echoes forever.',
     'achievement', 'Achievement', NULL, '#10B981', '#3B82F6', 'rgba(16,185,129,0.7)',
     ARRAY['#10B981','#3B82F6','#34D399','#60A5FA'], '⋈', 300, NULL, '2026-10-05')

ON CONFLICT (id) DO NOTHING;

-- ── Levels ─────────────────────────────────────────────────
INSERT INTO public.levels (level, label, xp_required, card_id) VALUES
    (0, 'Access Level', 0,    'SAP-001'),
    (1, 'Spark',        100,  'SSC-L1'),
    (2, 'Scholar',      300,  'SSC-L2'),
    (3, 'Builder',      700,  'SSC-L3'),
    (4, 'Architect',    1500, 'SSC-L4'),
    (5, 'Elite',        3000, 'SSC-L5')
ON CONFLICT (level) DO NOTHING;

-- ── Reserved usernames ──────────────────────────────────────
INSERT INTO public.reserved_usernames (word, reason) VALUES
    ('admin',         'reserved'),
    ('administrator', 'reserved'),
    ('lead',          'reserved'),
    ('support',       'reserved'),
    ('system',        'reserved'),
    ('root',          'reserved'),
    ('api',           'reserved'),
    ('superuser',     'reserved'),
    ('synapse',       'reserved'),
    ('mod',           'reserved'),
    ('moderator',     'reserved'),
    ('staff',         'reserved'),
    ('bot',           'reserved')
ON CONFLICT (word) DO NOTHING;

-- ── Activities (from mockData.js) ───────────────────────────
INSERT INTO public.activities (title, description, type, status, location, event_date, time_info, xp_reward, register_url, tags) VALUES
    ('Intro to React Workshop',
     'Kickstart your frontend journey! We''ll cover components, hooks, and state management. Perfect for beginners who want to build their first interactive web app.',
     'Workshop', 'Upcoming', 'Lab 301', '2026-08-15', '2:00 PM – 4:00 PM', 150,
     'https://synapse-form.vercel.app', ARRAY['Frontend', 'React']),

    ('Cloud Study Jam',
     'Get hands-on experience with Google Cloud Platform. Complete labs, earn badges, and understand the infrastructure that powers the modern web.',
     'Study Jam', 'Upcoming', 'Auditorium', '2026-08-22', '10:00 AM – 1:00 PM', 200,
     'https://synapse-form.vercel.app', ARRAY['Cloud', 'GCP', 'DevOps']),

    ('Synapse Hackathon S1',
     'The flagship event of Season 1. 48 hours of coding, caffeine, and creativity. Form your teams and build solutions for real-world problems.',
     'Hackathon', 'Upcoming', 'Main Hall', '2026-09-01', '9:00 AM', 1000,
     'https://synapse-form.vercel.app', ARRAY['Competition', 'Coding']),

    ('AI/ML Speaker Session',
     'Hear from industry experts about the future of Artificial Intelligence. Topics include Generative AI, Ethics in ML, and how to start your career in Data Science.',
     'Speaker Session', 'Upcoming', 'Conference Room A', '2026-09-10', '3:00 PM – 4:30 PM', 100,
     'https://synapse-form.vercel.app', ARRAY['AI', 'Career']),

    ('Open Source Contribution Day',
     'Learn how to contribute to open source projects. Make your first Pull Request and earn your Open Source Pioneer badge!',
     'Contribution', 'Upcoming', 'Campus Hub', '2026-10-05', '11:00 AM – 5:00 PM', 250,
     'https://synapse-form.vercel.app', ARRAY['Open Source', 'Git']),

    ('Synapse Launch Event',
     'The birth of Synapse Society. Members participated in challenges, the first Access Pass cards were distributed, and the top performers received Level 1 Character Cards.',
     'Launch', 'Completed', 'Main Auditorium', '2026-07-20', '9:00 AM – 6:00 PM', 500,
     '', ARRAY['Launch', 'Season 1', 'Cards'])

ON CONFLICT DO NOTHING;

-- ── Missions (from mockData.js) ─────────────────────────────
INSERT INTO public.missions (title, type, status, xp_reward, assigned_to, deadline) VALUES
    ('Deploy a Web Project',         'Tech',        'Active',   100, 'Open',        '2026-08-30'),
    ('Attend 3 Workshops',           'Learning',    'Active',   150, 'All',         '2026-09-15'),
    ('Contribute to Club GitHub',    'Open Source', 'Active',   200, 'Open',        '2026-10-05'),
    ('Hackathon Participation',      'Competition', 'Upcoming', 500, 'Teams',       '2026-09-01'),
    ('Design Club Poster',           'Design',      'Active',    80, 'Design Team', '2026-08-20'),
    ('Document a Project',           'Content',     'Active',   120, 'Open',        '2026-09-30'),
    ('Onboard 3 New Members',        'Community',   'Active',    90, 'All',         '2026-08-25')

ON CONFLICT DO NOTHING;

-- ── Teams (from mockData.js) ────────────────────────────────
INSERT INTO public.teams (name, badge_emoji, color_hex, total_tokens) VALUES
    ('Team Nexus',   '⬢', '#7C3AED', 1250),
    ('Team Phoenix', '⟁', '#EF4444', 1100),
    ('Team Quantum', '⎔', '#3B82F6',  950),
    ('Team Aurora',  '⬡', '#10B981',  900),
    ('Team Cipher',  '❖', '#F59E0B',  850)
ON CONFLICT (name) DO NOTHING;

-- ── Projects (from mockData.js) ─────────────────────────────
INSERT INTO public.projects (title, team_name, description, image_url, demo_url, github_url, tags) VALUES
    ('VED-AI', 'Learning Department',
     'A voice and text driven AI assistant that runs fully offline using Ollama (llama3). Built for personal use with persistent memory, a customizable personality, and system-level controls.',
     NULL, '', 'https://github.com/NERDY-01/VED-AI-Assistant', ARRAY['Python', 'Ollama']),

    ('Trust Donate', 'Nexus-hybrid',
     'TrustDonate is a gasless, transparent, and immutable blockchain platform built on Base Sepolia.',
     NULL, 'https://trust-donate.vercel.app', 'https://github.com/Arcane-Ayush/Trust-Donate', ARRAY['JavaScript', 'React', 'Solidity']),

    ('Summary-Ai', 'Team Gamma',
     'Real-time transcription and summarization tool for lectures using advanced speech-to-text AI and semantic chunking.',
     'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=1000',
     '', 'https://github.com/Arcane-Ayush', ARRAY['Python', 'Whisper', 'React']),

    ('Note-It AI', 'Design Team',
     'Record classroom lectures and instantly generate notes, summaries, quizzes, flashcards and personalized revision plans.',
     NULL, 'https://noteitai.vercel.app', '', ARRAY['React', 'Firebase', 'Azure', 'Node.js'])

ON CONFLICT DO NOTHING;
