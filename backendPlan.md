# Master Prompt: Design & Implement the Backend for Our Technical Club Website

You are a senior Full-Stack Software Engineer, Backend Architect, Database Architect, and Security Engineer.

Your task is to design and implement the complete backend infrastructure for the official website of our University Technical Club/Society.

This is **NOT** an MVP, prototype, or proof of concept. It is the official production website of our technical society and should follow production-grade software engineering practices while remaining maintainable by a student development team.

The solution should prioritize scalability, maintainability, security, modularity, and future expansion.

---

# Existing Tech Stack

Do **NOT** redesign the frontend. 

Instead, carefully study the existing frontend structure (components, routes, UI expectations, and data requirements) and design the backend schema and APIs to integrate naturally with it.

If the frontend already expects a particular data structure, adapt the backend wherever it is reasonable instead of unnecessarily changing the frontend. Update the backend only when there is a new feature to be made ( like the Login system which only has a button in main branch ) 

---

# Backend Stack

Use:

* Supabase
* PostgreSQL
* Supabase Auth
* Supabase Storage (if required)
* Row Level Security (RLS)

Authentication should rely entirely on Supabase's built-in authentication system.

Do **NOT** implement a custom authentication system.

Do **NOT** manually hash passwords.

Do **NOT** recommend GitHub Gists, Firebase Realtime Database, or JSON files as the primary database.

---

## Authentication

Authentication should use **Supabase Auth** exclusively.

### Phase 1 (Current Implementation)

Use **Email + Password Authentication** as the primary authentication method.

Support:

* Sign Up
* Login
* Logout
* Persistent Sessions
* Password Reset
* Email Verification (optional but preferred)

Supabase should manage:

* Password hashing
* Session management
* Authentication tokens
* Session refresh
* Authentication security

Never manually hash or store passwords.

Do **NOT** implement a custom authentication system.

---

### Phase 2 (Future Expansion)

The authentication architecture should be designed so additional OAuth providers can be enabled later without requiring changes to the database schema or existing user records.

Future providers may include:

* Google Authentication (Primary OAuth Provider)
* GitHub Authentication (Optional)
* Other OAuth providers if required

When Google Authentication is introduced:

* Existing Email + Password users should be able to securely link their Google account to their existing profile.
* Authentication providers should reference the same user UUID.
* Existing user data (XP, Cards, Missions, Activities, QR History, Roles, etc.) must remain associated with the original account.
* The migration should not require database schema changes or duplicate user records.

The database schema should therefore be completely independent of the authentication provider and should always reference the immutable Supabase Auth UUID as the primary user identifier.

---

### Username & Display Name Validation

During account creation and profile updates:

* Usernames must be unique.
* Usernames must pass profanity and reserved-word filtering.
* Display names should also pass profanity filtering.
* Validate usernames for allowed characters, minimum/maximum length, and uniqueness.
* Maintain a configurable list of reserved usernames (e.g. `admin`, `administrator`, `lead`, `support`, `system`, `root`, `api`, etc.).
* Design the validation system so prohibited words and reserved usernames can be updated without modifying application code.


# User Model

Every authenticated user should have:

* UUID (Primary Identifier)
* Username (Unique) ---- should have word filters
* Display Name ---- should have word filters
* Email
* Profile Picture (optional)
* XP
* Current Level
* Total Cards
* Date Joined
* Last Login
* Club Role

Both:

* UUID
* Username

must be unique.

The UUID should be used internally for every relationship.

Username should only be used for display purposes and user-friendly identification.

---

# Club Roles

There are only three roles:

* Member
* Lead
* Administrator

Implement proper Role-Based Access Control (RBAC).

---

# XP System

Each user has XP.

XP may be awarded through:

* QR Code scans
* Weekly Missions
* Activities (Adventure Board)
* Events
* Workshops
* Competitions
* Admin Rewards
* Future Features

XP updates should always be transactional.

Never allow race conditions.

Never directly overwrite XP without logging the change.

Create an XP History table.

Fields should include:

* UUID
* user_id
* amount
* reason
* source
* timestamp

Every XP modification must generate a corresponding XP History entry.

The XP History table acts as the audit log for the XP system.

---

# Level System

The current frontend contains:

* Level 0 (Access Level)
* Level 1
* Level 2
* Level 3
* Level 4
* Level 5

However, these values should **NOT** be hardcoded anywhere.

Instead, design a flexible and configurable level system so future level additions or XP requirement changes require little to no code modification.

Explain the recommended implementation.

---

# Card System

The frontend already contains the card layouts.

Study the frontend structure and design the database schema accordingly.

There are two categories of cards.

## 1. Level Cards

Automatically unlocked when reaching certain levels.

## 2. Mission / Exclusive Cards

Unlocked through:

* Missions
* Events
* Activities
* Competitions
* Secret achievements
* Admin rewards

Design the schema so both types share common functionality while allowing future expansion.

Every card should contain:

* id
* title
* description
* image
* category
* rarity
* release_date
* event (optional)

Do not hardcode rarity values.

Instead, create a flexible rarity system that can evolve over time without requiring schema redesign.

Users can own multiple cards.

Cards can belong to multiple users.

Use proper many-to-many relationships.

---

# Weekly Missions

The frontend already contains Weekly Missions.

Design a backend system that supports:

* Weekly mission creation
* XP rewards
* Completion tracking
* Reset scheduling
* Progress tracking

Design the schema for future expansion.

---

# Activities (Adventure Board)

The frontend already includes an Adventure Board.

Design a backend system for activities.

Activities may:

* Award XP
* Unlock cards
* Unlock achievements
* Be repeatable
* Be one-time only

Design the schema accordingly.

---

# QR Code System

The frontend already implements QR scanning.

The backend should only handle verification and reward logic.

Each QR should contain:

* id
* code
* event
* reward_xp
* reward_card
* active
* reusable
* created_by
* created_at

When scanned:

1. Verify QR exists.
2. Verify QR is active.
3. Validate reward rules.
4. Prevent duplicate claims.
5. Award XP.
6. Award cards (if applicable).
7. Log scan history.

Never trust frontend data.

All validation happens on the backend.

---

# QR Scan History

Maintain a complete scan history.

Fields:

* id
* user_id
* qr_id
* timestamp
* ip (optional)
* device (optional)

Prevent abuse.

---

# Events

Create an Events table.

Include:

* id
* title
* description
* location
* banner
* organizer
* start_date
* end_date

QR codes, cards, missions, and activities should be able to reference events.

---

# Leaderboards

Support:

* Overall XP Leaderboard
* Monthly XP Leaderboard
* Event Leaderboards

Include pagination.

Optimize leaderboard queries.

---

# Admin Dashboard

Design backend support for an Admin Dashboard.

Administrators should be able to:

* Create Events
* Create Activities
* Create Weekly Missions
* Generate QR Codes
* Disable QR Codes
* Create Cards
* Award XP
* Remove XP
* Manage Users
* Assign Club Roles

Use proper RBAC.

---

# Database Design

Generate:

* Complete ER Diagram
* Table Relationships
* Primary Keys
* Foreign Keys
* Constraints
* Indexes

Explain every relationship.

Normalize the database where appropriate.

---

# Row Level Security (RLS)

Implement secure RLS policies.

Members:

* Read their own profile.
* Update their own profile.
* View public leaderboards.

Leads:

* Manage events.
* Manage activities.
* Manage missions.
* Manage QR codes.

Administrators:

* Full administrative access.

Generate every required RLS policy.

---

# API & Backend Architecture

Although Supabase provides APIs automatically, document the complete backend architecture.

Explain:

* Authentication flow
* User onboarding
* Google Authentication flow
* XP flow
* Card unlock flow
* Mission completion flow
* Activity completion flow
* QR verification flow

If Edge Functions are required, explain exactly where and why they should be used.

---

# Security

Protect against:

* SQL Injection
* Duplicate QR claims
* Replay attacks
* Fake XP submissions
* Client-side data manipulation
* Role escalation
* Unauthorized access

Never trust client-side validation.

---

# Performance

Optimize:

* Leaderboards
* XP queries
* Card lookups
* QR verification
* Mission lookups
* Activity lookups

Use indexes wherever appropriate.

Avoid unnecessary joins.

Explain every optimization decision.

---

# Future Expansion

Design the schema so future support can be added with minimal modification.

Potential future features include:

* Badges
* Achievements
* Teams
* Departments
* Event Registrations
* Attendance Tracking
* Merchandise
* Coupons
* Notifications
* Push Notifications
* Club Announcements
* Chat
* Friends
* Inventory
* Redeemable Rewards
* Referral System
* Daily Missions
* Seasons
* XP Multipliers
* Analytics Dashboard

The database should already be structured with these future additions in mind.

---

# Deployment

Explain:

* Local development
* Environment variables
* Supabase project configuration
* Google OAuth configuration
* Vercel deployment
* Production deployment
* Backup strategy
* Migration strategy

Provide a recommended folder structure.

---

# Deliverables

Produce:

1. Complete system architecture diagram.
2. Database schema.
3. SQL table definitions.
4. ER Diagram.
5. Authentication implementation.
6. Google OAuth setup.
7. Row Level Security policies.
8. Edge Functions (if required).
9. Folder structure.
10. Security checklist.
11. Performance optimization guide.
12. Deployment guide.
13. Future roadmap.

Do not skip implementation details.

Whenever multiple architectural choices exist, explain the trade-offs and recommend the best solution for a university technical club with approximately **300–1000 registered users**, while ensuring the system remains scalable for future growth.

