# rsh.pw

Minimal URL shortener and link bundle service built with Astro, Tailwind, and SQLite.

The project supports:

- single-link shortening
- bulk shortening
- optional link expiration and usage limits
- shareable link bundles similar to Linktree
- bundle recovery and editing via recovery password
- English and Russian UI
- standalone Node deployment behind Nginx

## Tech Stack

- Astro 5
- Tailwind CSS
- better-sqlite3
- Nano ID
- QR Code Styling
- Node adapter for Astro

## Features

### URL shortener

- create short links from long URLs
- optional custom slug
- optional expiration time
- optional max-use limit
- local history in the browser
- QR code generation for created links

### Link bundles

- create a public bundle page with multiple links
- customize theme, background, card style, and button shape
- highlight important links
- recover bundle access with a generated password
- edit or delete bundles later

## Project Structure

```text
.
|-- public/
|-- src/
|   |-- components/
|   |-- db/
|   |-- i18n/
|   |-- lib/
|   `-- pages/
|       |-- api/
|       |-- b/
|       |-- bundle/
|       `-- ru/
|-- astro.config.mjs
|-- ecosystem.config.cjs
|-- nginx.conf
|-- package.json
`-- rsh.db
```

## Local Development

### Requirements

- Bun or npm
- Node.js

### Install

```sh
bun install
```

If you prefer npm:

```sh
npm install
```

### Start dev server

```sh
bun run dev
```

Or:

```sh
npm run dev
```

By default Astro runs on `http://localhost:4321`.

## Build

```sh
bun run build
```

Preview locally:

```sh
bun run preview
```

## Data Storage

The app uses a local SQLite database file:

```text
rsh.db
```

Tables are initialized automatically on startup in [src/db/client.js](src/db/client.js).

## API Endpoints

### Short links

- `POST /api/shorten` - create a short link
- `POST /api/bulk-shorten` - create multiple short links at once

### Bundles

- `GET /api/bundle?slug=...` - fetch bundle data
- `POST /api/bundle` - create bundle
- `PUT /api/bundle` - update bundle
- `DELETE /api/bundle` - delete bundle
- `POST /api/bundle-verify` - verify recovery password

## Internationalization

The project currently supports:

- English
- Russian

Translations live in [src/i18n/ui.ts](src/i18n/ui.ts).

## Deployment Notes

This repository already includes deployment-oriented files:

- [astro.config.mjs](astro.config.mjs) - Astro config with Node standalone output
- [ecosystem.config.cjs](ecosystem.config.cjs) - PM2 process config
- [nginx.conf](nginx.conf) - Nginx reverse proxy and static asset config

Production flow is roughly:

1. Build the app with `bun run build`
2. Start `dist/server/entry.mjs` with PM2
3. Proxy public traffic through Nginx

## Status

This repository is an active app project, not a starter template.

Current polish still worth doing:

- add a proper license file
- add screenshots to the README
- document backup and migration strategy for `rsh.db`
- split some large UI files into smaller modules

## License

This project is licensed under the [MIT License](LICENSE).
