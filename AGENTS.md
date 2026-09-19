# IRCC Secure Account - Project Context

## Project Overview

This is a web application that replicates the Immigration, Refugees and Citizenship Canada (IRCC) Secure Account portal. It allows users to sign in, check application status, upload documents, manage messages, and track immigration applications.

## Tech Stack

- **Framework:** React 19.2.8
- **Routing:** React Router DOM 7.18.3 (BrowserRouter)
- **Build Tool:** Vite 8.2.2
- **Linting:** oxlint
- **Styling:** Custom CSS + Bootstrap 3.4.1 CDN + WET-BOEW (Web Experience Toolkit) CDN
- **Icons:** Font Awesome 5.15.4 CDN
- **State Management:** React Context API (AuthContext, DataContext)
- **Persistence:** sessionStorage for session state, read status, attachments, drafts

## Project Structure

```
ircc/
├── index.html          # Main entry point (React app)
├── portal.html         # Alternative vanilla JS implementation
├── package.json        # Dependencies and scripts
├── vite.config.js      # Vite configuration
├── UPDATE_PLAN.md      # Feature implementation tracking
├── AGENTS.md           # This file - project context for AI agents
├── public/             # Static assets (favicons, CSS, SVGs)
├── src/
│   ├── main.jsx        # React entry point
│   ├── App.jsx         # Router and route definitions
│   ├── App.css         # App-level styles
│   ├── index.css       # Global styles
│   ├── pages/          # 9 page components
│   ├── components/     # 6 reusable components
│   ├── context/        # 2 context providers
│   ├── styles/         # main.css
│   └── assets/         # Static assets
└── dist/               # Build output
```

## Routes

| Route | Component | Description |
|-------|-----------|-------------|
| `/` | `PublicPage` | Landing page with sign-in options |
| `/login` | `Login` | Role-aware administrator and applicant sign-in form |
| `/dashboard` | `Dashboard` | Account home with applications, messages |
| `/status` | `ApplicationStatus` | Application status tracking |
| `/documents` | `Documents` | Document checklist and upload |
| `/draft` | `Draft` | Application form with draft save |
| `/messages` | `Messages` | Message list |
| `/messages/:id` | `MessageDetail` | Individual message detail |
| `/profile` | `Profile` | User profile display |

## Components

- **Header:** Government of Canada header with logo and navigation
- **Footer:** Standard Canada.ca footer with site links
- **PortalLayout:** Layout wrapper (alternative, not currently used in routing)
- **PortalHeader:** Alternative branded header
- **PortalFooter:** Alternative footer
- **PortalNav:** Navigation with active route highlighting

## Context Providers

- **AuthContext:** Signed-in state, user object, login/logout functions
- **DataContext:** Messages, read status, document attachments, draft state

## Current Implementation Status

**Implemented:**
- Authentication flow with session persistence
- Dashboard with application overview
- Application status tracking with timeline
- Document management (upload/remove simulated)
- Messaging system with read/unread status
- Draft applications with sessionStorage persistence
- User profile display
- Government of Canada branding and design system

**Missing (see UPDATE_PLAN.md):**
- Account type guidance on landing page
- Alerts/announcements system
- News/announcements section
- Maintenance notices
- "Not sure how to sign in?" help link
- Comprehensive help section (8 topics)
- Personal reference code handling
- Link to all Government of Canada accounts
- Proper registration flow

## Design System

Follows Government of Canada Web Standards:
- WET-BOEW (Web Experience Toolkit) for design patterns
- Bootstrap 3.4.1 for grid and components
- Font Awesome 5.15.4 for icons
- Accessible markup with ARIA attributes
- Semantic HTML structure
- Bilingual support (English/French) via language selector

## Development Commands

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run oxlint

## Key Conventions

- Use React Context for state management (no Redux/MobX)
- sessionStorage for persistence (not localStorage)
- JSX files (not TypeScript)
- Follow existing component patterns and naming conventions
- Maintain accessibility standards
- Use Government of Canada design system components
