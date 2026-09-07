# IRCC Secure Account Demo

An unofficial, local UI demonstration inspired by the Immigration, Refugees and Citizenship Canada secure account portal. It uses fictional data and is not connected to IRCC. Built with React and Vite.

## Run locally

```sh
npm install
npm run dev
```

Then open http://localhost:5173.

## Build for production

```sh
npm run build
```

## Project structure

- `src/pages/` - Page components (PublicPage, Login, Dashboard, etc.)
- `src/components/` - Reusable components (Header, Footer, Navigation)
- `src/context/` - React context for state management (Auth, Data)
- `src/styles/` - CSS styles

## Features

- Secure account sign-in with GCKey or Interac Sign-In Partner
- Application status tracking
- Document upload and checklist management
- Account messages and notifications
- Profile management
- Draft application saving

## Account

Use only the fictional demo credentials:

- Username: `alex.morgan`
- Password: `Alex2026!`

Do not enter real GCKey, banking, immigration, or personal information.

Reference: https://www.canada.ca/en/immigration-refugees-citizenship/services/application/account.html
