# Quality assurance

This project was built and exercised locally in Windows with Node/npm, the Codex browser, and installed Google Chrome. Nothing was deployed.

## Automated coverage

Unit tests cover search tokenization and aliases, combined filters, unknown-value exclusion and ordering, non-mutating sorting, unique semantic routes, daily discovery across the Dhaka day boundary, related/curated selections, corrupt/unavailable storage, bounded comparison, strict schema constraints, and duplicate/contradictory imports.

Playwright runs desktop Chrome and Pixel 7 viewport projects. Journeys cover query-string filters and direct refresh; favorites and comparison persistence/removal; power-unit and difference controls; command search keyboard behavior; gallery zoom, arrow navigation and restored focus; 3D controls/disposal; failed images and WebGL fallback; reduced-motion navigation; and every primary route without page-level horizontal overflow or runtime exceptions. Axe checks run on home, explorer, vehicle detail, populated comparison, and manufacturer directory.

The headless browser uses SwiftShader to make graphics tests reproducible. A separate failure test deliberately disables WebGL. Accessibility automation is an additional check, not a claim of complete screen-reader certification. Firefox, Safari, and real touch hardware have not been tested.

## Manual visual checks

The settled homepage, archive, vehicle exhibit, and 3D workshop were inspected in the app browser. Desktop and mobile comparison were checked for contained horizontal scrolling. The generated studio background and corrected BMW E30, McLaren F1, and Td5 Defender photographs were visually reviewed. Route screenshots cover home, explorer, manufacturer, generation, car, comparison, favorites, timeline, engineering, glossary, 404, and workshop.

## Screenshots

Run `npm run qa:screenshots` with the local server active. For installed Chrome, set `$env:PLAYWRIGHT_CHANNEL = 'chrome'` first. Screenshots use reduced motion so they capture settled content. They are real rendered application views, not design mockups.

| Desktop                                           | Mobile                                       |
| ------------------------------------------------- | -------------------------------------------- |
| [Home](screenshots/desktop-home.png)              | [Home](screenshots/mobile-home.png)          |
| [Explorer](screenshots/desktop-explore.png)       | [Explorer](screenshots/mobile-explore.png)   |
| [Vehicle](screenshots/desktop-exhibit.png)        | [Vehicle](screenshots/mobile-exhibit.png)    |
| [Comparison](screenshots/desktop-compare.png)     | [Comparison](screenshots/mobile-compare.png) |
| [Manufacturer](screenshots/desktop-brand.png)     |                                              |
| [Generation](screenshots/desktop-generation.png)  |                                              |
| [Favorites](screenshots/desktop-collection.png)   |                                              |
| [Timeline](screenshots/desktop-timeline.png)      |                                              |
| [Engineering](screenshots/desktop-technology.png) |                                              |
| [Glossary](screenshots/desktop-glossary.png)      |                                              |
| [404](screenshots/desktop-404.png)                |                                              |
| [3D workshop](screenshots/desktop-workshop.png)   |                                              |

## Regression fixes made during validation

- Native dialog cleanup now closes the top-layer modal before restoring focus, including StrictMode effect replay.
- Rapidly clearing a search and selecting a manufacturer now composes pending URL edits instead of restoring stale query text.
- Small muted labels and pale-panel text meet the tested contrast thresholds.
- Comparison difference dots are decorative; semantic table values remain accessible.
- Three mismatched search-result photographs were replaced with reviewed exact files, and media maintenance now uses a deterministic source manifest.
- Imports reject semantic route collisions even when incoming IDs are different.

## Final results — 2026-10-04 (Asia/Dhaka)

| Check                                    | Result                                                                                     |
| ---------------------------------------- | ------------------------------------------------------------------------------------------ |
| `npm run lint`                           | Passed; no warnings or errors                                                              |
| `npm test`                               | 29 tests passed across 4 files                                                             |
| `npm run data:validate`                  | 34 variants and unique routes; all referenced image files and credits present              |
| `npm run media:sync`                     | 37 reviewed photographs retained; zero failures                                            |
| `npm run test:e2e` with installed Chrome | 20 desktop/mobile journeys passed                                                          |
| Axe on settled reduced-motion content    | Zero violations for tested WCAG A/AA tags on five critical views in both viewport projects |
| `npm run data:sources`                   | 39 unique references; no 404/410 responses; three 403 access restrictions                  |
| `npm run build`                          | Strict TypeScript and optimized Vite production build passed                               |
| Local production preview                 | Vehicle deep link and direct browser refresh verified on port 4173                         |
| `npm run qa:screenshots`                 | 16 actual desktop/mobile/workshop screenshots saved                                        |

The initial application script is approximately 156kB gzip. The optional Three.js workshop module is approximately 161kB gzip and is requested only when opened. CSS is approximately 17kB gzip, with fonts and image assets served separately. These are build sizes, not a measured Lighthouse score or a guarantee of real-device frame rates.
