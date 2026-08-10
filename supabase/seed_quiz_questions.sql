-- ============================================================
-- Add timer_sec column to event_quiz_questions table
-- ============================================================
ALTER TABLE event_quiz_questions ADD COLUMN IF NOT EXISTS timer_sec INT DEFAULT 5;

-- ============================================================
-- Seed / Replace all 21 Quiz Questions
-- ============================================================
TRUNCATE TABLE event_quiz_questions;

INSERT INTO event_quiz_questions (id, question, options, correct_index, reward_s_coins, timer_sec) VALUES
(1, 'Which of the following memories is volatile?', '["ROM", "SSD", "RAM", "HDD"]'::jsonb, 2, 30, 5),
(2, 'Which component performs arithmetic and logical operations?', '["Control Unit", "ALU", "Register", "Cache"]'::jsonb, 1, 30, 5),
(3, 'Which of these is not a programming language?', '["Python", "Java", "HTML", "C"]'::jsonb, 2, 30, 5),
(4, 'Which statement best describes a compiler?', '["Executes code line by line", "Converts the whole program into machine code before execution", "Stores source code", "Edits source files"]'::jsonb, 1, 30, 5),
(5, 'What is the full form of "URL"?', '["Uniform Resource Locator", "Universal Resource Link", "Unique Reference Locator", "United Resource Locator"]'::jsonb, 0, 30, 5),
(6, 'Convert 101101₂ to decimal.', '["43", "45", "47", "53"]'::jsonb, 1, 30, 5),
(7, 'Convert 59₁₀ to binary.', '["111011", "111001", "101111", "110111"]'::jsonb, 3, 30, 5),
(8, 'Which of the following is not a valid variable name?', '["_count", "totalMarks", "2value", "value2"]'::jsonb, 2, 30, 5),
(9, 'If one byte equals 8 bits, how many bytes are there in 2 KB?', '["1024", "2000", "2048", "4096"]'::jsonb, 2, 30, 5),
(10, 'Which keyword prevents modification of a variable?', '["volatile", "const", "static", "signed"]'::jsonb, 1, 30, 5),
(11, 'Which memory is closest to the CPU?', '["RAM", "Cache", "SSD", "HDD"]'::jsonb, 1, 30, 5),
(12, 'Which of the following is not a valid C keyword?', '["return", "switch", "function", "break"]'::jsonb, 2, 30, 5),
(13, 'Which loop is guaranteed to execute its body at least once, even if the condition is false?', '["for loop", "while loop", "do-while loop", "for-each loop"]'::jsonb, 2, 30, 5),
(14, 'Which logic gate produces an output of 1 only when both inputs are 1?', '["OR", "AND", "NOT", "XOR"]'::jsonb, 1, 30, 5),
(15, 'What is virtual memory primarily used for?', '["Faster CPU", "Extend available memory using disk", "Increase RAM speed", "Store BIOS"]'::jsonb, 1, 30, 5),
(16, 'Which cache level is generally the fastest?', '["L1", "L2", "L3", "RAM"]'::jsonb, 0, 30, 5),
(17, 'What is the primary purpose of cache memory?', '["Store the operating system", "Increase permanent storage", "Reduce CPU memory access time", "Replace RAM"]'::jsonb, 2, 30, 5),
(18, 'Which statement about a compiler and an interpreter is correct?', '["Both execute code line by line.", "A compiler translates the entire program before execution, while an interpreter translates one statement at a time.", "An interpreter is always faster than a compiler.", "A compiler requires no source code."]'::jsonb, 1, 30, 5),
(19, 'What is the main purpose of version control tools like Git?', '["To design website layouts", "To track and manage changes to code/files over time", "To compress image files", "To scan for viruses"]'::jsonb, 1, 30, 5),
(20, 'What best describes an "API" (Application Programming Interface)?', '["A physical computer component", "A set of rules that lets different software applications communicate with each other", "A type of programming language", "A tool for editing images"]'::jsonb, 1, 30, 5),
(21, 'What is the primary function of DNS (Domain Name System) on the internet?', '["Encrypts network traffic", "Translates domain names into IP addresses", "Assigns MAC addresses to devices", "Compresses data for faster transfer"]'::jsonb, 1, 30, 5);
