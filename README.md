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
- Schema references: `types/schema.ts` (Zod, used by `yarn validate`) and `types/JSON/[section].schema.json` (JSON Schema, editor hints)

### Field definitions
Attributes follow the methodology of the [paper](#how-to-cite) (Section 3). Use `null` when a value cannot be reliably verified; the website shows it as N/A.

| Field | Meaning |
|---|---|
| `name` | Tool or service name. |
| `categories` | Functionalities and techniques, as codes defined in the section's `meta.categories`. |
| `link` | Website or repository of the tool. |
| `link_onion` | Darknet only: the tool's v3 `.onion` address. |
| `open_source` | `true` if distributed under an open license. |
| `accessibility` | `true` for free access, `false` for paid only. For limited free access (e.g., a free tier), use `true` and explain in `accessibility_note`. |
| `API` | `true` if an API is available. Describe restrictions (paid, rate-limited) in `API_note`. |
| `maintained` | Commercial tools: officially supported. Open-source tools: latest commit within the last year. Optional `maintained_note` explains the status. |
| `functional` | Optional. Set to `false` only when the tool no longer works; such records are listed at the end of the table. |
| `description` | Short description of what the tool does. |
| `services`, `CVE` | Network devices only: whether the tool lists services running on devices and known vulnerabilities (CVEs). |
| `social_networks` | Social networks only: supported platforms; use `"Multiple platforms"` for tools covering many networks. |

### How to propose changes
1. Fork and create a feature branch.
2. Update `public/data/[section].json`:
   - Add or edit records in the file's `data` array. Sections: `indexed_internet`, `archived_web`, `network_devices`, `darknet`, `social_networks`, `search_engines`, `domains_ips`, and `mixed`.
   - Ensure each new record includes all required fields for that section (e.g., `name`, `categories`, `API`, plus section specifics like `maintained`, `services`, or `social_networks`).
   - Records may only contain fields defined in the schema; unknown fields (including typos) fail validation. To add a new field, define it in both `types/schema.ts` and `types/JSON/[section].schema.json`.
   - Categories used in records must exist in that section’s `meta.categories`. Add new categories there if needed with at least a `name`.
3. Format and validate locally:
   ```bash
   yarn format
   yarn validate
   ```
   - The validator checks schema compliance, reports totals, flags undefined categories, and warns about potential duplicate tool names.
4. Commit and open a Pull Request describing your changes.

### Tips
- Keep `name` values consistent (case/spacing) to avoid duplicate warnings.
- Prefer adding short, clear `description` and `*_note` fields when applicable.

## Useful scripts
- `yarn dev`: start Vite dev server
- `yarn build`: build for production to `dist`
- `yarn preview`: preview the production build
- `yarn validate`: validate all `public/data/*.json` files
- `yarn lint`: run Biome linter
- `yarn format`: run Biome formatter

## How to cite

If you use or build upon the materials, please use the cite block or BibTeX entry below to cite the original paper (not only this web link).

LAZAROV, Willi; MORAVEC, Vojtech; LOUTOCKY, Pavel; VOSTOUPAL, Jakub and MARTINASEK, Zdenek. Comparative analysis of OSINT tools, techniques, and legal aspects. Computers & Security. 2026, vol. 168, article no. 104938. ISSN 0167-4048. Available from: https://doi.org/10.1016/j.cose.2026.104938.

```bibtex
@article{lazarov2026osint,
  title     = {Comparative analysis of {OSINT} tools, techniques, and legal aspects},
  author    = {Lazarov, Willi and Moravec, Vojtech and Loutocky, Pavel and Vostoupal, Jakub and Martinasek, Zdenek},
  journal   = {Computers \& Security},
  volume    = {168},
  pages     = {104938},
  year      = {2026},
  issn      = {0167-4048},
  publisher = {Elsevier},
  doi       = {10.1016/j.cose.2026.104938}
}
```
