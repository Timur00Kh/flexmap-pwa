# FlexMap

A mobile-first, English/Russian, private mobility self-observation PWA.

**App:** https://timur00kh.github.io/flexmap-pwa/

## Run and verify

Node.js 22+, `npm ci`, `npm run dev`. Open http://localhost:3000/flexmap-pwa/.

`npm run typecheck`, `npm run lint`, `npm run build`.

Static output is `out/`. Serve it under `/flexmap-pwa/` (not domain root). EN/RU routes are exported at `/flexmap-pwa/en/` and `/flexmap-pwa/ru/`; the root detects browser/saved language. No backend, middleware or accounts.

`npm test` runs Playwright smoke and scoring tests against a static preview at http://localhost:4173/flexmap-pwa/ (started automatically after you build). Set `PLAYWRIGHT_BASE_URL` to test production. Install Chromium with `npx playwright install chromium` if needed. Test results are synthetic and isolated by browser context.

## Behavior and scoring

18 illustrated checks. Side-specific movements collect independent left/right results. A pain/discomfort stop saves an observation with no numeric score. Each scored observation must explicitly confirm no pain or compensation.

Levels 1–5 map to ordinal scores 0/25/50/75/100. The latest observation for each movement and side supersedes older observations, including when the latest is stopped. Group scores average latest scored observations mapped to that group. Overall score averages latest scored movement/side observations. Coverage is scored movement/side observations divided by all possible movement/side positions. Missing and stopped positions remain unscored, never zero-filled. History shows comparison with previous scored observation for the same movement/side.

These are self-reported ordinal observations, **not clinical measurements, muscle length estimates, validated diagnostic tests or treatment guidance**. Uncertainty is high and displayed in the application. Muscle group attribution is a simplified association, not isolation of an individual muscle. Illustrations are schematic reference positions, not goniometry. Safety context: [NHS flexibility exercises](https://www.nhs.uk/live-well/exercise/flexibility-exercises/). The exercise catalogue and scales are original and have not been clinically validated.

## Data and offline

Results: IndexedDB via Dexie. Preferences: localStorage. No analytics, telemetry or third-party data requests. Version 1 JSON export/import validates fields, bounds, movement IDs and side consistency. Import merges by result ID. Export before clearing browser storage or changing devices.

The service worker caches the app shell, locale pages, icons and versioned static assets. Updates wait for explicit user action. Offline use requires an initial successful load and service-worker installation. iOS installation uses Share → Add to Home Screen; Android/desktop show an install action when browser-supported. Browser storage eviction can remove data/cache.

## Stack and assets

Next.js App Router static export, React/TypeScript, Tailwind CSS, shadcn-style Button (Radix Slot/CVA), React Three Fiber/Three.js/drei, Zustand, Dexie, Lucide icons, Playwright. GitHub Actions checks and deploys to GitHub Pages.

All anatomy geometry, SVG exercise drawings and app icons are generated from project source and original to FlexMap, under the project MIT license. No third-party anatomical model or photographic asset is used. The segmented model is deliberately simplified. WebGL is required for the interactive model; a localized error message is shown when unavailable. Dependency licenses remain their respective authors' licenses.
