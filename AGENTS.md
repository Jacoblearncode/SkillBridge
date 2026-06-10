# AGENTS.md

## Project Type

- Static multi-page website (HTML, CSS, vanilla JavaScript).
- No package manager, build step, linter, or automated test suite is configured.

## Key Structure

- Pages: [index.html](index.html), [browse-skills.html](browse-skills.html), [community.html](community.html), [about-us.html](about-us.html), [contact.html](contact.html)
- Shared styles: [assets/css/style.css](assets/css/style.css)
- Shared scripts: [assets/js/script.js](assets/js/script.js)
- Project context/docs: [README.md](README.md), [style-guide.md](style-guide.md), [skillbridge.md](skillbridge.md)

## Local Preview

- Open any page directly in a browser, or run a simple local server from repo root:

```powershell
python -m http.server 8000
```

- Then open `http://localhost:8000/`.
- Live server/Five Server can be opened on 127.0.0.1:5500

## Implementation Conventions

- Reuse existing CSS custom properties from [assets/css/style.css](assets/css/style.css). Do not introduce undefined tokens like `--text-color` or `--bg-surface`.
- Preserve the established dark/glass visual language (surface gradients, subtle borders, blur, and shadow depth).
- Keep shared behavior in [assets/js/script.js](assets/js/script.js) and use the existing data-attribute hooks (`data-navbar`, `data-slider`, `data-accordion`, etc.).
- Keep page-specific styling scoped to the page unless the pattern is reused across multiple pages.

## Review Expectations

- Keep explanations concise and outcome-focused.
- For review requests, prioritize findings first: bugs, regressions, accessibility/responsive risks, and missing validation.
- Report findings by severity and include exact file links.

## Verification Expectations

- Always verify changed pages manually in browser at desktop and mobile widths.
- At minimum, verify impacted navigation, modals, sliders/accordions, and responsive layout behavior.
- Explicitly state what was verified and what could not be verified.

## Notes For Agents

- Link to existing docs instead of duplicating long design/token lists.
- Prefer small, targeted edits and avoid broad refactors unless requested.
