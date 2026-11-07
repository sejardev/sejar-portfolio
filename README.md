# Sejar — Developer portfolio

A responsive portfolio showcasing business websites and small, useful web applications.

**[Visit the portfolio](https://sejardev.github.io/sejar-portfolio/)** · **[Try Pocket](https://sejardev.github.io/sejar-portfolio/pocket/)**

## Selected work

| Project | What it does | Links |
| --- | --- | --- |
| Pocket | Tracks expenses with monthly summaries, category breakdowns, search and CSV export. | [Demo](https://sejardev.github.io/sejar-portfolio/pocket/) · [Code and documentation](pocket/) |
| AdemiTrade | A website for a construction materials company, built with HTML, CSS and JavaScript. | [Website](https://ademitrade.com) |

## Stack

HTML, CSS and vanilla JavaScript. No build step or runtime dependencies. Hosted on GitHub Pages.

## Run locally

Run `python -m http.server 8000` in this directory and open `http://localhost:8000`. Use a local server for Pocket because it loads JavaScript modules.

## Checks

Run `node --test pocket/model.test.mjs` to test money calculations, dates, monthly filtering, data validation and CSV escaping.

## Structure

- `index.html`, `style.css`, `script.js`: portfolio page and navigation.
- `pocket/`: standalone expense tracker and its documentation/tests.

Pocket stores data only in the visitor's browser. See its [README](pocket/README.md) for limitations and implementation details.
