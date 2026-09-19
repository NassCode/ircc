# IRCC Secure Account

A locally hosted account-management application built with React and Vite. It is not connected to IRCC.

## Run locally

```sh
npm install
npm run dev
```

Then open http://localhost:5173.

The development server creates `data/ircc.json` automatically using LowDB and seeds only an administrator. No separate database server is needed.

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

- Role-aware administrator and applicant sign-in
- Administrator account creation and full application record management
- Application status tracking with editable timeline stages
- Document-request metadata and provided-document management
- Persistent account messages, read status, and upload metadata
- Applicant profile display

## Application types

Administrators can assign Visitor visa, Study permit, Work permit, Work and labour, Invitation, Sponsorship, or a custom type. Work and labour records include employment details. Invitation and Sponsorship records include structured information about the invited or sponsored person, including identity, citizenship, residence, passport, and relationship details.

## Administrator account

On a fresh database, use these default administrator credentials:

- Username: `admin`
- Password: `Admin2026!`

Set `ADMIN_USERNAME` and `ADMIN_PASSWORD` before the first run to override these defaults. Changing the variables later does not alter an existing database. The administrator creates applicant accounts and assigns one application to each account.

Do not enter real GCKey, banking, immigration, or personal information.

The LowDB JSON file is local development data and is excluded from Git. Delete `data/ircc.json` while the development server is stopped to recreate a fresh database on the next start. Uploaded documents are represented by metadata only; file contents are not stored.

Reference: https://www.canada.ca/en/immigration-refugees-citizenship/services/application/account.html
