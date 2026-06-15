# Sekai Creation Flow

Componentized React + TypeScript implementation of the creation-flow redesign in
`sekai-redesign (4).html`.

## Run

```bash
npm install
npm run dev
```

## Structure

- `src/App.tsx`: flow state, mock build adapter, and composed screens
- `src/components/Composer.tsx`: idea composer, effort selection, and suggestions
- `src/components/Dock.tsx`: idle/build dock states and tool entry points
- `src/components/Primitives.tsx`: reusable sheets, steppers, tools, and toast
- `src/styles.css`: design tokens, motion, device shell, and mobile layout

The mock build and playtest timers are intentionally isolated in `App.tsx` so
backend stage events can replace them without changing the visual components.
