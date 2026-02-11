## OSINT Hub

OSINT Hub is an open website and dataset, which presents a comparative analysis of OSINT tools and services for data collection and analysis. The resources are organized into 8 categories, with options to filter individual tools by their functionality. Since this field is constantly evolving, we welcome your contributions to help us keep the OSINT Hub up to date.

Data now lives in per-section files under `public/data/*.json` (e.g., `indexed_internet.json`, `devices.json`, etc.).

> [!NOTE]  
> The comparative analysis was conducted exclusively using information from official repositories, product websites, and technical documentation, without performing empirical benchmarking of the identified tools and services. It is also possible that some links may no longer be active. In this case, we welcome updates to the dataset according to the instructions provided below.

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

## Contributing to public/data/*.json

Contributions are welcome! The dataset is validated with a strict schema so the app remains stable.

### Where to edit
- Files: `public/data/[section].json`
- Schema references: `types/schema.ts` (Zod) and `types/data.schema.json` (JSON Schema)

### How to propose changes
1. Fork and create a feature branch.
2. Update `public/data/[section].json`:
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
- `yarn validate`: validate all `public/data/*.json` files
- `yarn lint`: run Biome linter
- `yarn format`: run Biome formatter


