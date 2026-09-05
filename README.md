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

The page is labeled as an unofficial demo. It does not collect credentials, authenticate, upload documents, or submit applications. External resource links lead to official Canadian government pages. Authenticated account screens are not included.

Reference: https://www.canada.ca/en/immigration-refugees-citizenship/services/application/account.html

## Validation

Internal anchor targets and JavaScript syntax were checked. Browser visual testing has not been performed.
