# Demo of Boe Eno Moto, a web resource for Bororo language

A front-end-only demo of **Boe Eno Moto**: a searchable text corpus, a Bororo-Portuguese dictionary and a fauna vocabulary for the Bororo language, running entirely in the browser from static data files.

- **Live demo:** https://boe-eno-moto-demo.vercel.app/
- **Current version of the project (developed by others):** https://boeenomoto.terradoc.org/

> This repository is a student snapshot of an earlier prototype. It is not the current official site.

## Background

I worked as a student web developer under the supervision of Dr. Fabrício Ferraz Gerardi, within an EU-funded project. My task was to develop the web resource for the indigenous Bororo language, Boe Eno Moto. In its original form it had several modules: a text corpus, a dictionary, a list of all word forms, an ethnobiological lexicon (animals and plants), school materials, myths, songs and videos.

After the funded project ended, the resource was taken further by others. The current version, [boeenomoto.terradoc.org](https://boeenomoto.terradoc.org/), was developed after my work and is separate from this repository.

This repository keeps the version I built available as a static portfolio demo. To make that possible without a server, I moved the data from a server-side API into plain data files and rebuilt the search to run in the browser. The demo includes only the corpus, the dictionary and the fauna vocabulary; the word forms, plants, myths, songs and videos modules are not included.

## Original architecture

The original version was a classic three-tier web application:

```text
┌────────────────┐     ┌───────────────────┐     ┌─────────────────────┐
│ React Frontend │ ◀─▶ │ Backend (Express) │ ◀─▶ │ PostgreSQL Database │
└────────────────┘     └───────────────────┘     └─────────────────────┘
```

- **Frontend:** React, calling the API with `fetch`.
- **API:** Node.js with Express (`api/server.js`). It had endpoints for texts, KWIC search, dictionary lookup and autocomplete, fauna, ethnobotany and word forms, and it served the pronunciation recordings (`.wav`) as static files.
- **Database:** PostgreSQL managed on DBeaver, with separate tables for all the collected linguistic data.
- **Hosting:** frontend, backend and database were all hosted on Render.
- **My part:** the whole stack. I built the React frontend, the Express API, the PostgreSQL schema and data import scripts, and the Render deployment.

## About this demo

```text
┌────────────────┐   ┌─────────────────────────────────────────────────────┐  
│ React Frontend │ → │ Static data files (TSV / CSV / TXT / JSON) on a CDN │
└────────────────┘   └─────────────────────────────────────────────────────┘
```

Due to the reason of costs, I replaced the API and database with files in `public/data/` and moved the search logic (KWIC, dictionary lookup, autocomplete, filtering) into the browser (`src/lib/`).

| | Original                             | This demo |
|---|--------------------------------------|---|
| Data | PostgreSQL database behind an API    | Static files, downloaded on demand |
| Search | On the server                        | In the browser |
| Hosting | Frontend + backend + database        | Static site on Vercel |
| Upkeep | Server and database must stay online | None |

**Trade-offs:** the demo needs no server, and it never "sleeps". In exchange, every visitor downloads the data they use, and it can't handle data that changes frequently or user accounts. That is acceptable for a fixed language dataset: about 4,800 dictionary entries, about 18,500 word forms and six texts.

### Features of this demo
- **Corpus (reading view):** five Bororo texts, with word search (exact word or contains), a case-sensitive toggle, highlighted matches and next/previous navigation.
  - **KWIC (key word in context):** search selected texts and see each match with 1-8 words of context on either side.
  - **Parallel texts:** about 1,700 Bororo-Portuguese sentence pairs, with filtering.
  - **Frequency list:** the 500 most frequent words in the corpus.
- **Dictionary:** about 4,800 entries with IPA, part of speech tags, definition, example sentences and images; autocomplete suggestions as you type, and a results page for each entry.
- **Fauna:** 97 animals with Portuguese, Bororo and scientific names, category and Bororo classification, and photos; accent-insensitive search (`onca` finds *Onça*).
- **Responsive navigation** and a single-page app with direct links to every section.

### Tech Stack of this demo
- **Frontend:** React 19, React Router 7, Tailwind CSS 4
- **Build tool:** Vite 8
- **Data:** static files in `public/data/` (TSV for the dictionary and fauna, CSV for parallel texts, TXT for the corpus), downloaded and parsed in the browser on demand, with no backend and no database
- **Hosting:** Vercel (a rewrite rule in `vercel.json` sends all routes to `index.html`)
- **Tooling:** ESLint

### Run locally
Requires Node.js 22 or newer.

```bash
npm install
npm run dev        # development server
npm run build      # production build into dist/
npm run preview    # serve the production build locally
```

### Project structure
```text
public/
  data/            dictionary, fauna, parallel corpus and texts
  fauna/           animal images
src/
  pages/           Main, About, Corpus, Dictionary, DictionaryResults, Fauna
  components/      navbars, footer, search bar, corpus tabs
  lib/             data loading and search (corpus.js, dictionary.js)
vercel.json        routing rule for the single-page app
```

## What I have learnt 🧗🏼‍♀️

- **This was my first full-stack project**: not perfect, and the learning curve was steep. Time and patience were part of it.
- **Tools age/ move fast, so I have to keep updating myself**: Create React App is outdated, I moved hosting this demo by Vite.
- **Real data is messy**: Line endings, missing entries and encoding issues are frustration but there are always ways to overcome.
- **Plan at least a bit before you code**: It is better than just code what I have in my mind, especially without certain consideration of UX.
- **Build a prototype first, make it perfect later**: get something working, then improve it. That is how I developed the original site.

## Credits & Licence
The corpus, dictionary and fauna data come from the **Boe Eno Moto** project by **Dr. Fabrício Ferraz Gerardi** and **Hing Man Chiu**, licensed under a [Creative Commons Attribution 4.0 International License](https://creativecommons.org/licenses/by/4.0/).
This repository does not add its own licence. For the authoritative version of the project and its data, see https://boeenomoto.terradoc.org/.
