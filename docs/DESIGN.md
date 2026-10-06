# Design system

Motor Atlas uses graphite surfaces, warm off-white text, restrained vermilion accents, and an occasional pale engineering panel. The visual direction is an independent editorial museum with original identity and layouts.

| Token              | Value / purpose                 |
| ------------------ | ------------------------------- |
| Background         | `#111211`                       |
| Surface            | `#191b19`                       |
| Raised surface     | `#222521`                       |
| Primary text       | `#f1efe8`                       |
| Secondary text     | `#a6aaa2`                       |
| Small muted text   | `#969d8f`                       |
| Accent             | `#e87550`                       |
| Border             | white at 10% opacity            |
| Body               | locally hosted DM Sans Variable |
| Headings           | locally hosted Manrope Variable |
| Editorial emphasis | system serif italic             |
| Default radius     | 4px; pills reserved for tags    |
| Easing             | `cubic-bezier(.22, 1, .36, 1)`  |

`global.css` owns tokens and shared controls; `pages.css` owns page-specific arrangements. Spacing is built around 4/8px increments with fluid page gutters. Large headings use `clamp`; reading columns retain a comfortable line length. Cards align shared metadata and actions. Specifications use semantic definition lists; comparison uses a real table with column and row headers.

Motion is limited to the introduction, subtle hero parallax, image reveals, hover feedback, navigation surfaces, and comparison docking. Reduced-motion preferences remove movement and preserve immediate access. No blocking splash screen, fake counters, or automatic carousel movement is used. Workshop rotation starts only when requested.

Desktop uses a sticky filter column and multi-column editorial grids. Mobile uses an explicit filter toggle, stacked sections, compact navigation, and contained horizontal comparison/era rails. Global keyboard search and gallery dialogs retain native focus confinement and restore opener focus. All controls provide visible focus treatments and meaningful names. Unknown data remains visibly unavailable.

The logo is an original SVG mark and typographic wordmark. Manufacturer names use text treatments; no manufacturer logos were copied into the identity. The studio hero is an explicitly labelled visual adaptation; documentary photographs retain separate credits.
