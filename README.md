# IRCC local UI replica

A standalone, unofficial approximation of the public IRCC secure account sign-in page. Built with HTML, CSS, and JavaScript, with all styling and scripts embedded in `index.html`.

## Run locally

Download or clone this repository and open `index.html` in a modern browser. No installation or build step is required.

Alternatively, from the repository directory:

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

Then open http://localhost:8000.

## Included

- Responsive page layout
- Expandable account and help sections
- Navigation menu and local help search
- Demo sign-in dialogs

The pages are labeled as an unofficial demo. They do not transmit credentials, upload personal documents, or submit applications. External resource links lead to official Canadian government pages.

## Demo account

Open `portal.html` or use a sign-in button on the public page.

- Username: `demo.applicant`
- Password: `Demo123!`

This shared login is checked in browser JavaScript; it is not a security boundary. Use only the displayed demo credentials. Session storage keeps a demo login flag, read-message flags, sample attachment state, and sample draft selections. Signing out clears the login flag. The credentials are not stored from form input or transmitted.

Internal pages include an account dashboard, application status, message list and message details, a document checklist with a built-in sample attachment, a sample draft form, and a fictional profile. All records are fictional. These layouts are illustrative, not verified replicas of authenticated IRCC screens.

Reference: https://www.canada.ca/en/immigration-refugees-citizenship/services/application/account.html

## Validation

Internal anchor targets and JavaScript syntax were checked. Browser visual testing has not been performed.
