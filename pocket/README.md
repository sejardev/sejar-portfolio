# Pocket

A small expense tracker built with HTML, CSS and JavaScript. Track everyday spending without creating an account.

**[Open the live demo](https://sejardev.github.io/sejar-portfolio/pocket/)** · **[Sejar's portfolio](https://sejardev.github.io/sejar-portfolio/)**

## Features

- Add expenses with a description, date, category and euro amount.
- View monthly totals, daily averages and category breakdowns.
- Search entries and delete individual expenses with confirmation.
- Export the selected month's expenses as CSV.
- Try clearly labeled sample data without replacing existing entries.
- Responsive layout, labeled form fields and keyboard focus indicators.

## Run locally

Serve the repository through a local HTTP server, for example `python -m http.server 8000`, then open `http://localhost:8000/pocket/`. No dependencies or build step required.

## Tests

Run `node --test pocket/model.test.mjs` from the repository root. Tests cover money validation, date validation, monthly summaries, saved-data validation and CSV escaping.

## Implementation

`model.mjs` contains validation, integer-cent calculations and CSV serialization. `app.js` handles rendering, browser storage and interactions. User-entered descriptions are rendered as text rather than HTML. CSV fields beginning with formula characters are prefixed to prevent spreadsheet formula execution.

## Data and limitations

Data is stored in localStorage for this browser and origin. It is not sent to a server, synchronized between devices, encrypted, or backed up. Clearing browser data removes saved entries. Export a CSV to keep a copy. If storage is unavailable, the app explains that changes only last for the current session. EUR is the only supported currency; this is a manual tracker with no bank integrations.

## Possible next steps

- Edit existing expenses.
- Import a validated backup.
- Add configurable monthly budgets.
