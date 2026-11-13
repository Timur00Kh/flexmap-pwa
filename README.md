# FlexMap

A mobile-first, English/Russian, private mobility self-observation PWA.

Two primary sections: guided practice and My map. Stretching is the default practice mode, with Basic mobility retained as a separate mode (18 movements each, 32 unique movements and 4 shared). The catalog, history, comparison and settings appear when needed. Each check uses one large reference image and five range thumbnails; an incomplete bilateral check resumes on the missing side. Existing version 1 IndexedDB data and JSON backups remain compatible.

**App:** https://timur00kh.github.io/flexmap-pwa/

## Run and verify

Node.js 22+, `npm ci`, `npm run dev`. Open http://localhost:3000/flexmap-pwa/.

`npm run typecheck`, `npm run lint`, `npm run build`.

Static output is `out/`. Serve it under `/flexmap-pwa/` (not domain root). EN/RU routes are exported at `/flexmap-pwa/en/` and `/flexmap-pwa/ru/`; the root detects browser/saved language. No backend, middleware or accounts.

`npm test` runs Playwright smoke and scoring tests against a static preview at http://localhost:4173/flexmap-pwa/ (started automatically after you build). Set `PLAYWRIGHT_BASE_URL` to test production. Install Chromium with `npx playwright install chromium` if needed. Test results are synthetic and isolated by browser context.

## Behavior and scoring

Each mode has 18 illustrated movements. Stretching focuses on straight-knee folds, hip/shoulder positions and personal progress. Basic mobility retains the original general movement checks. Side-specific movements collect independent left/right results. A pain/discomfort stop saves an observation with no numeric score. Each scored observation must explicitly confirm no pain or compensation.

In Stretching, the interface reports levels 1–5 and changes relative to previous observations; it does not display a percentage of muscle stretch. The internal heatmap and Basic mobility use the same ordinal mapping 0/25/50/75/100. The latest observation for each movement and side supersedes older observations, including when the latest is stopped. Group scores average latest scored observations mapped to that group within the selected mode. Shared movements reuse the same observations across modes; unrelated movements are excluded from that mode's score, completion and history. Overall score averages latest scored movement/side observations. Coverage is scored movement/side observations divided by all possible movement/side positions. Missing and stopped positions remain unscored, never zero-filled. History shows comparison with previous scored observation for the same movement/side.

These are self-reported ordinal observations, **not clinical measurements, muscle length estimates, validated diagnostic tests or treatment guidance**. Uncertainty is high and displayed in the application. Muscle group attribution is a simplified association, not isolation of an individual muscle. Illustrations are schematic reference positions, not goniometry. Safety context: [NHS flexibility exercises](https://www.nhs.uk/live-well/exercise/flexibility-exercises/). The exercise catalogue and scales are original and have not been clinically validated. The sports context and limits of the progression landmarks are documented in [stretching methodology](docs/stretching-method.md).

## Data and offline

Results: IndexedDB via Dexie. Preferences: localStorage. No analytics, telemetry or third-party data requests. Version 1 JSON export/import validates fields, bounds, movement IDs and side consistency. Import merges by result ID. Export before clearing browser storage or changing devices.

The service worker caches the app shell, locale pages, icons and versioned static assets. Updates wait for explicit user action. Offline use requires an initial successful load and service-worker installation. iOS installation uses Share → Add to Home Screen; Android/desktop show an install action when browser-supported. Browser storage eviction can remove data/cache.

## Stack and assets

Next.js App Router static export, React/TypeScript, Tailwind CSS, shadcn-style Button (Radix Slot/CVA), React Three Fiber/Three.js/drei, Zustand, Dexie, Lucide icons, Playwright. GitHub Actions checks and deploys to GitHub Pages.

The ready-made Écorché anatomical model is licensed under CC BY-SA 4.0 and is bundled locally (5.7 MB), with separate named anatomical structures mapped to nine broad movement groups. Attribution is visible in the app. Full source, license and upstream credits: [anatomy assets](docs/anatomy-assets.md). The application's MIT license does not replace this model's Creative Commons license.

The 32 exercise image sheets were created with the built-in image generator, visually reviewed, and packaged as local WebP sprites. [Accepted prompts, processing and limitations](docs/exercise-visuals.md). They are illustrated references, not measured joint angles or clinically validated test standards. App icons remain original project artwork. WebGL is required for the interactive anatomical model; a localized fallback explains when unavailable. Dependency licenses remain their respective authors' licenses.
