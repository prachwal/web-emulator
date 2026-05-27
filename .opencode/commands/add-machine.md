---description: Scaffold a new machine preset---
Create files for a new machine named $ARGUMENTS:
1. `src/video/presets/<machine>.ts` — T()/G() presets with palette, margins, font geometry
2. `docs/<machine>.md` — spec table, implemented/missing checklists
3. Register in `src/video/presets/index.ts` — import + PRESETS spread
4. Add demo function in `src/video/text/DemoTextScene.ts` + register in demoFns
5. Add feature badges in `src/app/AppShell.tsx` machineFeatures
6. Add font files to `public/fonts/<machine>/` if needed
7. Update font presets in `src/video/fonts/fontPresets.ts` if needed
