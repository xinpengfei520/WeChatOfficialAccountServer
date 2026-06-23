# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

A WeChat Official Account server (Node.js/Express) that serves a movie mini-site (douban data, trailers, danmu) and handles WeChat message/menu callbacks.

## Running

`npm run lint` (ESLint, flat config in `eslint.config.js`) checks the code; `npm run lint:fix` auto-fixes. `npm test` is a placeholder that only errors — there are no tests. Run the app entry points directly with `node`:

- `node app.js` — start the web + WeChat callback server on port **3000**. Connects to MongoDB first, then mounts routes.
- `node server/index.js` — one-off data pipeline: crawls theaters/trailers (puppeteer), saves to MongoDB, uploads images/videos to Qiniu. Run manually to refresh data; not scheduled.
- `node wechat/wechat.js` — **has side effects**: the IIFE at the bottom deletes & recreates the WeChat custom menu and runs material-upload tests. Run only when you intend to (re)configure the menu.

## Prerequisites

- **MongoDB must be running and reachable** before starting `app.js` or the pipeline (default `mongodb://localhost:27017/DouBan`, override with `MONGODB_URI`). The app awaits the DB connection at startup.
- **Public tunnel required for WeChat**: WeChat callbacks and JS-SDK signing use `SERVER_URL`. Expose port 3000 via ngrok (or similar) and set `SERVER_URL` to that public URL — it must match the address WeChat reaches.

## Configuration & secrets

All credentials are loaded from `.env` via `dotenv` — there are **no hardcoded secrets in the code**. Copy `.env.example` to `.env` and fill in real values. Required vars: `WECHAT_TOKEN`, `WECHAT_APP_ID`, `WECHAT_APP_SECRET`, `SERVER_URL`, `QINIU_ACCESS_KEY`, `QINIU_SECRET_KEY`, `QINIU_BUCKET`, `MONGODB_URI`.

- **Never commit `.env`** (it is gitignored). When adding a new secret, read it from `process.env` and add a placeholder line to `.env.example`.
- Note: the original credentials are still present in early git history and are considered compromised — rotate them in the WeChat and Qiniu consoles rather than reusing.

## Conventions

- Templating is **EJS** (`view engine` = `ejs`), views in `./views`.
- API endpoint constants live in `cons/` (`weChatApi.js`, `douBanApi.js`, `imageApi.js`); data models (mongoose) in `model/`.
