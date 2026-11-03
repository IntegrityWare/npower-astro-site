# AGENTS.md

## Standalone release publishing

- Always show a prominent, explicitly labeled build date beside downloads for Render Worker, Power Surfacing VIZ for Windows, and VIZ for Mac. Keep this requirement for every future release.
- Use each installer's verified build date, not its upload date. Maintain ISO `buildDate` values in `src/lib/productDownloads.js` and use the shared `BuildDate` component in download cards and product download panels.
- On each release, update the installer URL, version, size, build date, checksum, R2 manifest and filename routes together. Verify the uploaded object before publishing its website link. Keep the previous object and routes until the replacement is uploaded, verified, and live. Then remove the immediately superseded installer object and its manifest entry and filename routes. Apply this separately to VIZ Windows, VIZ Mac, and Render Worker; do not delete unrelated installers.

## Project Context

This is a Base44 app repository. Treat it as user-owned application code, keep changes focused on the user's request, and preserve existing project conventions.

Start with `README.md` for local setup, environment variables, and publish workflow.

## Base44 References

- CLI overview: https://docs.base44.com/developers/references/cli/get-started/overview.md
- Agent skills: https://docs.base44.com/developers/backend/overview/skills.md

If your agent supports Agent Skills, install or update Base44 skills before Base44-specific work:

```bash
npx skills add base44/skills
```

## Key Files

- `src/`: frontend application source.
- `src/api/base44Client.js`: frontend Base44 SDK client.
- `vite.config.js`: Vite config and Base44 Vite plugin setup.
- `.env.local`: local-only environment values; never commit secrets.
- Site host URL: set `PUBLIC_SITE_URL` (and optionally `PUBLIC_ORGANIZATION_URL`) in `.env` / `.env.local`. See `.env.example`. Default host is staging (`https://www.npowersoftwarenew.com`); at production launch set `PUBLIC_SITE_URL=https://www.npowersoftware.com` and rebuild.

## Working Notes

- Use `base44 dev` as the default local development command when you need the local Base44 backend. It can run the backend and frontend together.
- When docs or code mention the frontend being started automatically, that usually means the Base44 project config includes `site.serveCommand`, for example `"serveCommand": "npm run dev"` in `base44/config.jsonc`.
- Use `npm run dev` only for frontend-only work against the hosted Base44 backend.
- Prefer the existing Base44 CLI workflow over adding new npm scripts for Base44-specific tasks.
- Reuse the existing SDK client and Vite plugin patterns before adding new Base44 integration paths.
- Run the relevant checks from `package.json` before finishing code changes.
