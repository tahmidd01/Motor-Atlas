# Architecture

## Boundaries

```text
src/types/automotive.ts       Entity and measurement contracts
src/data/manufacturers.ts    Countries and manufacturers
src/data/vehicles.ts         Curated source records and normalization
src/data/catalog.ts          Joined catalog, URLs, display helpers, daily discovery
src/data/media.json          Local images and attribution
src/data/imported-vehicles.json  Validated additions
src/data/editorial.ts        Historical and engineering content
src/lib/                    Pure search, filters, collections, validation
src/features/garage/        Persistent favorites and comparison
src/components/             Reusable layout, cards, gallery, search, specs, 3D
src/pages/                  Route-level product views
src/styles/                 Shared tokens, layouts, responsive treatments
scripts/                    Data import, validation, media, QA maintenance
tests/                      Unit and browser journeys
```

Country, manufacturer, model, generation, and variant records have stable identifiers. The authoring seed is deliberately compact; normalization builds separate typed model/generation/variant arrays. The enriched `Car` is a read-only presentation view of those entities, not an additional copy to edit. Model and generation IDs derive from manufacturer/model/generation slugs. Imports reject duplicate IDs, duplicate public routes, unknown manufacturers, and contradictory generation years before writing.

## Routes

| Route                                      | View                                       |
| ------------------------------------------ | ------------------------------------------ |
| `/`                                        | Cinematic home                             |
| `/cars`                                    | Explorer; query-string filter state        |
| `/cars/:brand/:model/:generation/:variant` | Vehicle exhibit                            |
| `/brands`, `/brands/:brand`                | Manufacturer directory and history         |
| `/models/:brand/:model`                    | Model family                               |
| `/models/:brand/:model/:generation`        | Generation                                 |
| `/countries`, `/countries/:country`        | Country directory and automotive context   |
| `/collections`, `/collections/:collection` | Curated selections                         |
| `/collection`                              | Personal favorites                         |
| `/compare`                                 | Up to four vehicles; optional `cars=id,id` |
| `/timeline`                                | Historical milestones and era discovery    |
| `/technology`, `/technology/:topic`        | Engineering topics                         |
| `/glossary`                                | Searchable definitions                     |
| `/data`                                    | Dataset statistics and methodology         |
| `/credits`                                 | References and photo credits               |
| unmatched                                  | Designed 404 with discovery links          |

## State and interactions

Explorer state lives in URL parameters, so refreshing and sharing preserve selections. Changing manufacturer resets dependent model/generation selections. Pending parameter edits are composed immediately to avoid rapid consecutive interactions restoring an old search query. Filtering is pure and applies numerical constraints only to known values; unknowns sort last in numeric orders.

`GarageContext` owns favorites, bounded comparison, and accessible status notifications. Storage validates JSON against known IDs, removes duplicates, caps comparison at four, catches unavailable storage, and listens for cross-tab changes. Personal state is tied to the origin; preview and development ports have separate storage.

Native dialogs implement focus confinement. Both search and gallery explicitly close the native dialog and restore opener focus during cleanup, including React StrictMode's effect replay. Gallery state is keyed by vehicle. Search supports keyboard selection and restores focus when dismissed.

## Rendering and performance

Home is eager; secondary route modules are lazy. Three.js and GLTF loading are isolated behind the workshop action. Canvas resolution is capped; rendering pauses outside the viewport or while the document is hidden. Renderer, geometry, material, texture, orbit control, animation-frame, and observer resources are disposed on unmount. GLB models are optional and require an explicit credit/license; no network model is requested by default.

Photographs and fonts are local. Images reserve their dimensions through stable containers, use decoding/lazy loading, and provide an original SVG fallback. There is no runtime analytics, remote font service, or live specification API. The module graph is small enough for a local client-side catalog; a search index or API boundary can replace pure filters when measured data growth justifies it.

## Extending

Add entities and validated records rather than hardcoded cards or collections. A future SQL schema should preserve the same foreign-key hierarchy and separate specification provenance from media licensing. A future editor should call the same validation boundary. Server rendering/prerendering would improve crawlability without changing the catalog contracts.
