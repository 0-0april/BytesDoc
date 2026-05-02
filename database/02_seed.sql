-- BytesDoc - seed data
-- Mirrors the frontend mock data in frontend/lib/mockData.ts so the backend
-- can be developed against the same fixtures the UI already expects.
-- Run AFTER 01_schema.sql on a fresh empty database.
--
-- NOTE on passwords: the placeholder hash below is a bcrypt hash of the
-- literal string "password" (cost 10). Replace with real hashes per user
-- before any non-dev deployment.

USE `bytesdoc`;

-- ---------------------------------------------------------------------------
-- Lookup tables
-- ---------------------------------------------------------------------------

INSERT INTO `role` (`role_id`, `role_name`) VALUES
  (1, 'chief_minister'),
  (2, 'secretary'),
  (3, 'finance_minister'),
  (4, 'member');

INSERT INTO `category` (`category_id`, `category_name`) VALUES
  (1, 'Proposals'),
  (2, 'Permits'),
  (3, 'Budgets'),
  (4, 'Reports'),
  (5, 'Financial Records');

INSERT INTO `event` (`event_id`, `event_name`, `event_date`) VALUES
  (1, 'Freshmen Orientation', '2024-08-15'),
  (2, 'Election 2025',        '2025-03-01'),
  (3, 'Foundation Day',       '2024-09-20'),
  (4, 'General',              NULL);

INSERT INTO `administration` (`administration_id`, `admin_name`, `start_date`, `end_date`) VALUES
  (1, '2024-2025', '2024-07-01', '2025-06-30'),
  (2, '2025-2026', '2025-07-01', '2026-06-30');

-- ---------------------------------------------------------------------------
-- Users (matches mockUsers in frontend/lib/mockData.ts)
-- All passwords below = "password" (bcrypt cost 10) - DEV ONLY.
-- ---------------------------------------------------------------------------

INSERT INTO `user` (`username_id`, `role_id`, `name`, `email`, `password`, `created_at`) VALUES
  (1, 1, 'Chief Minister',     'admin@bytes.com',
        '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW',
        '2024-01-15 10:00:00'),
  (2, 2, 'Secretary General',  'secretary@bytes.com',
        '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW',
        '2024-01-16 10:00:00'),
  (3, 3, 'Minister of Finance','finance@bytes.com',
        '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW',
        '2024-01-17 10:00:00'),
  (4, 4, 'Council Member',     'member@bytes.com',
        '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW',
        '2024-01-18 10:00:00'),
  (5, 4, 'Council Member 2',   'member2@bytes.com',
        '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW',
        '2024-02-01 10:00:00');

-- ---------------------------------------------------------------------------
-- Documents (matches mockDocuments)
-- category_id mapping: Proposals=1, Permits=2, Budgets=3, Reports=4, Financial Records=5
-- event_id mapping:    Freshmen Orientation=1, Election 2025=2, Foundation Day=3, General=4
-- administration_id:   2024-2025=1, 2025-2026=2
-- ---------------------------------------------------------------------------

INSERT INTO `document`
  (`document_id`, `administration_id`, `category_id`, `event_id`,
   `uploaded_by`, `upload_date`, `title`, `file_path`, `is_archived`, `is_locked`) VALUES
  (1,  1, 1, 1, 2, '2024-03-15 14:30:00', 'Freshmen Orientation Proposal',  '/mock/proposal1.pdf', 0, 0),
  (2,  1, 3, 2, 3, '2024-04-01 09:00:00', 'Election 2025 Budget Report',    '/mock/budget1.pdf',   0, 0),
  (3,  1, 2, 3, 2, '2024-04-10 11:20:00', 'Foundation Day Event Permit',    '/mock/permit1.pdf',   0, 0),
  (4,  1, 5, 4, 3, '2024-04-15 16:45:00', 'Q1 Financial Records',           '/mock/financial1.pdf',0, 0),
  (5,  1, 4, 4, 1, '2024-04-20 13:00:00', 'Annual Activity Report 2024',    '/mock/report1.pdf',   1, 1),
  (6,  1, 3, 1, 3, '2024-03-20 10:15:00', 'Freshmen Orientation Budget',    '/mock/budget2.pdf',   0, 0),
  (7,  1, 1, 2, 2, '2024-03-25 15:30:00', 'Election Committee Proposal',    '/mock/proposal2.pdf', 0, 0),
  (8,  1, 3, 3, 3, '2024-04-05 08:45:00', 'Foundation Day Budget Allocation','/mock/budget3.pdf',  0, 0),
  (9,  1, 2, 3, 2, '2024-04-12 14:00:00', 'Venue Booking Permit',           '/mock/permit2.pdf',   0, 0),
  (10, 1, 4, 4, 3, '2024-04-18 12:30:00', 'Q2 Expense Report',              '/mock/report2.pdf',   0, 0);

-- ---------------------------------------------------------------------------
-- Activity logs (matches mockActivityLogs)
-- ---------------------------------------------------------------------------

INSERT INTO `activity_log`
  (`log_id`, `user_id`, `document_id`, `action`, `timestamp`) VALUES
  (1,  1, NULL, 'login',    '2024-04-20 08:00:00'),
  (2,  2, 1,    'upload',   '2024-03-15 14:30:00'),
  (3,  3, 2,    'upload',   '2024-04-01 09:00:00'),
  (4,  4, 1,    'view',     '2024-04-02 10:15:00'),
  (5,  1, 2,    'download', '2024-04-03 11:20:00'),
  (6,  2, 3,    'upload',   '2024-04-10 11:20:00'),
  (7,  3, 4,    'upload',   '2024-04-15 16:45:00'),
  (8,  1, 5,    'archive',  '2024-04-20 13:00:00'),
  (9,  2, NULL, 'login',    '2024-04-20 09:30:00'),
  (10, 3, NULL, 'login',    '2024-04-20 09:45:00'),
  (11, 4, 3,    'view',     '2024-04-11 14:00:00'),
  (12, 1, 4,    'download', '2024-04-16 10:00:00'),
  (13, 2, 2,    'view',     '2024-04-05 15:30:00'),
  (14, 3, 6,    'upload',   '2024-03-20 10:15:00'),
  (15, 4, 1,    'download', '2024-04-19 16:45:00');
