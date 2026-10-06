# Media provenance and maintenance

The app serves 37 downloaded, reviewed Wikimedia Commons photographs locally as WebP, plus one studio adaptation. Each photograph has a 1600px exhibit asset and a 720px thumbnail. Source metadata is retained in `src/data/media.json`; full attributions and license links are in [ATTRIBUTIONS.md](ATTRIBUTIONS.md) and the in-app `/credits` page.

## Photograph workflow

`scripts/media-sources.json` holds exact, visually reviewed Commons filenames. `npm run media:sync` checks local files and preserves the existing manifest. Missing assets are fetched by exact filename; it never substitutes an arbitrary search result. The script checks for supported Creative Commons/public-domain licensing, preserves attribution, and converts/resizes using Sharp.

```powershell
npm run media:sync
npm run media:sync -- --refresh
npm run docs:credits
npm run data:validate
```

Review every new picture yourself: model, body shape, generation, visible trim, and image quality. Captions explicitly warn when the pictured trim/year can differ. Conversion, resizing, and displayed cropping are recorded as changes; adapted media retains the source license. Keep author and license links with any public redistribution.

## Studio hero adaptation

Tool: built-in `image_gen.imagegen` (image-edit mode).

Reference: [Alexander Migl's Porsche 992 GT3 RS photograph](<https://commons.wikimedia.org/wiki/File:Porsche_992_GT3_RS_MYLE_Festival_2025_DSC_9586_(cropped).jpg>), CC BY-SA 4.0.

Local reference: `public/media/porsche-911-992-gt3-rs.webp`.

Generated original: `C:\Users\tahmi\.codex\generated_images\01a102b7-953a-7fe2-95f9-6daa278dc8eb\exec-d1238451-d508-44b6-8ae5-fb1dee3c8958.png`.

Delivered optimized asset: `public/media/hero-studio.webp`. Credit and change notice are defined in `src/data/catalog.ts`; the adaptation is distributed under CC BY-SA 4.0. It appears in the Porsche gallery with an explicit AI-edit label, and the homepage links to the credit.

Creative instruction: preserve the referenced grey GT3 RS's geometry, headlights, wheels, paint, and wing; replace the busy show background with a dark premium studio, subtle reflective floor, soft white overhead lighting, and a slight warm rim; place the car on the right with negative space for editorial text; add no extra logos, text, smoke, or objects. This is a visual treatment, not evidence of an actual studio shoot.

## 3D and identity

The abstract wheel assembly and fallback silhouette are original procedural geometry/SVG created for this project. They are not asserted to be models of an indexed vehicle. To add a licensed car mesh, populate `model3d` with a local GLB path, credit, and license. GLTFLoader normalizes its bounds and offers orbit/zoom/reset. Preserve texture licenses and attribution as well as mesh licensing.

DM Sans and Manrope are locally served through Fontsource and licensed under the SIL Open Font License. The installed font packages contain their license files. Lucide icons use the ISC license; Three.js, React, and other dependencies retain their own package licenses. No manufacturer endorsement or affiliation is implied.
