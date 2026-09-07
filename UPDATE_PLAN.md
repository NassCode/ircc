# IRCC Secure Account - Update Plan

This document tracks the implementation of missing features identified by comparing our current implementation with the real IRCC account page at https://www.canada.ca/en/immigration-refugees-citizenship/services/application/account.html

## Priority 1: Pre-Login Experience

### [ ] Account Type Guidance
**Description:** Add "Check if this is the right account for you" section with expandable lists
- Apply for these applications (list)
- Check the status of these applications (list)
- Upload requested documents for these applications (list)
**Status:** Not started
**Notes:** This should be on the landing page before sign-in options

### [ ] Alerts/Announcements System
**Description:** Dynamic alerts section for processing delays and service changes
- Study permit applicant alerts
- Medical exam result delays
- Student Direct Stream status
**Status:** Not started
**Notes:** Should be configurable, possibly from a JSON config or API endpoint

### [ ] News/Announcements
**Description:** Display current government notices (e.g., class action settlements)
**Status:** Not started
**Notes:** Could be static content updated periodically or fetched from API

### [ ] Maintenance Notices
**Description:** Show scheduled downtime information
**Status:** Not started
**Notes:** Should include date, time, timezone, and duration

## Priority 2: Sign-In & Help

### [ ] "Not sure how to sign in?" Help Link
**Description:** Add help link next to sign-in options
**Status:** Not started
**Notes:** Should link to a help page or open a modal with guidance

### [ ] Comprehensive Help Section
**Description:** Add 8 help topics for account issues:
- Errors and issues when you sign in
- Forgot GCKey password or username
- GCKey two-factor authentication
- GCKey revoked
- Change your Sign-In Partner
- If you don't find your application in your account
- If your personal reference code doesn't work
- More help options
**Status:** Not started
**Notes:** Could be a dedicated /help page or section on landing page

### [ ] Personal Reference Code Handling
**Description:** Add support for personal reference codes in account access
**Status:** Not started
**Notes:** Real IRCC uses these for account linking; need to understand use case

### [ ] Link to All Government Accounts
**Description:** Add "Find another government account" section
**Status:** Not started
**Notes:** External link to https://www.canada.ca/en/government/sign-in-online-account.html

## Priority 3: Registration

### [ ] Proper Registration Flow
**Description:** Create actual registration page/form instead of linking to login
**Status:** Not started
**Notes:** Real page links to /en/immigration-refugees-citizenship/services/application/register.html

## Completed Features (Post-Login)

These are already implemented and working:
- [x] Login with GCKey/Interac options
- [x] Dashboard with application list
- [x] Application status tracking with timeline
- [x] Document upload interface
- [x] Messaging system with read/unread status
- [x] Draft applications with persistence
- [x] User profile display
- [x] Government of Canada branding and design system

## Progress Summary

| Priority | Completed | In Progress | Not Started |
|----------|-----------|-------------|-------------|
| 1        | 0/4       | 0           | 4           |
| 2        | 0/4       | 0           | 4           |
| 3        | 0/1       | 0           | 1           |
| **Total**| **0/9**   | **0**       | **9**       |

## Implementation Notes

- Use existing React + Vite + React Router stack
- Follow Government of Canada design system (WET-BOEW) conventions
- Maintain accessibility standards (ARIA attributes, semantic HTML)
- Use sessionStorage for state persistence (existing pattern)
- Consider creating a config file for alerts/announcements content
