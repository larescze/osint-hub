## OSINT Hub

Lightweight React + Vite app that lists OSINT resources. Data lives in `public/data/data.json`.

## Run locally

### Prerequisites
- Node.js 18+
- Yarn 1.x (classic)

### Install dependencies
```bash
yarn
```

### Start the dev server
```bash
yarn dev
```

### Build and preview production
```bash
yarn build
yarn preview
```

## Contributing to public/data/data.json

Contributions are welcome! The dataset is validated with a strict schema so the app remains stable.

### Where to edit
- File: `public/data/data.json`
- Schema references: `types/schema.ts` (Zod) and `types/data.schema.json` (JSON Schema)

### How to propose changes
1. Fork and create a feature branch.
2. Update `public/data/data.json`:
   - Add or edit entries under the correct top-level section: `indexed_internet`, `archived_web`, `devices`, `dark_web`, `social_networks`, `search_engines`, or `mixed`.
   - Ensure each new record includes all required fields for that section (e.g., `tool`, `categories`, `API`, plus section specifics like `maintained`, `services`, or `social_network`).
   - Categories used in records must exist in that section’s `meta.categories`. Add new categories there if needed with at least a `name`.
3. Validate locally:
   ```bash
   yarn validate
   ```
   - The validator checks schema compliance, reports totals, flags undefined/unused categories, and warns about potential duplicate tool names.
4. Commit and open a Pull Request describing your changes.

### Tips
- Keep `tool` names consistent (case/spacing) to avoid duplicate warnings.
- Prefer adding short, clear `description` and `*_note` fields when applicable.

## Useful scripts
- `yarn dev`: start Vite dev server
- `yarn build`: build for production to `dist`
- `yarn preview`: preview the production build
- `yarn validate`: validate `public/data/data.json`
- `yarn lint`: run Biome linter
- `yarn format`: run Biome formatter


