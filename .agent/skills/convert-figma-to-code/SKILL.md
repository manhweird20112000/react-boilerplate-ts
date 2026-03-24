---
name: figma-mcp-to-code
description: >
  Convert Figma designs into production-ready code using the Figma MCP Server.
  Use this skill whenever the user wants to: convert a Figma frame or component
  to code, implement a UI component from a Figma link, extract design tokens,
  handle icons and image assets from Figma, or use Figma MCP inside Claude Code,
  Cursor, or VS Code.
  Trigger on: "convert figma to code", "implement this figma component",
  "figma MCP", "figma to react/html/tailwind", "export icons from figma",
  "figma design to component", or any request to turn a Figma design into
  working frontend code.
---

# Figma MCP → Code

This skill covers the end-to-end process of converting Figma designs into high-quality code using the Figma MCP Server, with a focus on **component-level conversion** and **correct asset (icon/image) folder placement**.

---

## Overview

The Figma MCP Server lets an AI agent read the **actual structure** of a Figma file — node tree, layout constraints, component variants, design tokens, spacing — rather than just a screenshot. This produces far more accurate and consistent code.

```
Figma File  →  MCP Server  →  AI Agent (Claude Code / Cursor / VS Code)  →  Code
```

---

## Step 1 – Setup: Connect the Figma MCP Server

### Option A — Remote Server (recommended, no install needed)

Add to your project's `.mcp.json` or your global Claude Code config:

```json
{
  "mcpServers": {
    "figma": {
      "command": "npx",
      "args": ["-y", "figma-developer-mcp"],
      "env": {
        "FIGMA_API_KEY": "your_figma_api_key_here"
      }
    }
  }
}
```

Or via CLI:
```bash
claude mcp add --transport http figma https://mcp.figma.com/mcp
```

### Option B — Desktop Server (local, selection-based)

Requires the **Figma Desktop App** to be open. No link needed — the AI reads whatever is currently selected in Figma.

### Other editors

| Editor | How to connect |
|---|---|
| Cursor | Settings → MCP → Add Server → paste `https://mcp.figma.com/mcp` |
| VS Code | `⌘ Shift P` → MCP: Add Server → HTTP → paste URL |
| Windsurf | See https://docs.codeium.com/windsurf/mcp |

---

## Step 2 – Get the Figma Link

1. Open the Figma file **in the browser** (not the Desktop app)
2. **Select the frame or component** you want to convert
3. Copy the URL from the address bar — it contains the `node-id`:
   ```
   https://www.figma.com/design/AbCdEfGh/My-App?node-id=123-456
   ```
4. Paste this URL into your AI tool prompt

> The AI does not navigate to the URL — it extracts the `node-id` and queries the MCP server automatically.

---

## Step 3 – Component Conversion Workflow

This is the core workflow. Always convert at the **component level**, not page level.

### 3.1 Identify the component boundary

Before writing any prompt:
- In Figma, select the **smallest self-contained frame** that represents the component (e.g. `Button`, `Card`, `NavItem` — not an entire page)
- Check the layer name — a well-named component (`ProductCard`, `AlertBanner`) leads to better output
- Note any variants shown in the Figma frame (hover, disabled, loading states)

### 3.2 Basic conversion prompt

```
Convert this Figma component to a React + TypeScript component using Tailwind CSS:
[paste Figma URL]

Requirements:
- Component name should match the Figma layer name
- Use Tailwind utility classes only (no inline styles)
- Export as a named export
- Props must have a typed interface
```

### 3.3 Full conversion prompt (recommended)

```
Convert this Figma component to code:
[paste Figma URL]

Stack: React 18 + TypeScript + Tailwind CSS v3
Conventions:
- File: src/components/[ComponentName]/[ComponentName].tsx
- Props interface: [ComponentName]Props (in same file)
- Named export only
- All Figma variants → mapped to props (e.g. variant, size, disabled)
- Responsive: mobile-first

Assets:
- Icons: export as SVG to src/assets/icons/[icon-name].svg
- Images: save to src/assets/images/[image-name].[ext]
- Import icons as React components via:
  import { ReactComponent as IconName } from '@/assets/icons/icon-name.svg'

Do not hardcode any color values — use the project's Tailwind config tokens if available.

At the end of your response, include a section called "## Assets to Export"
listing every icon and image that needs to be manually exported from Figma.
```

### 3.4 Iterative refinement prompts

After getting the initial output, use these follow-up prompts:

| Goal | Prompt |
|---|---|
| Fix spacing | "The padding inside the card looks too tight. Match the Figma spacing exactly." |
| Add missing variant | "Add a `disabled` prop that grays out the button and disables pointer events." |
| Pixel-perfect check | "Compare this component against the Figma design and list any visual differences." |
| Accessibility | "Add proper ARIA attributes and keyboard navigation to this component." |
| Extract tokens only | "Extract all color, spacing, and typography tokens from this frame: [URL]" |

---

## Step 4 – Asset Handling: Icons and Images

This is the most commonly mishandled part of Figma-to-code conversion. Follow this structure strictly.

### 4.1 Recommended folder structure

```
src/
├── assets/
│   ├── icons/               ← SVG icons only (from Figma icon components)
│   │   ├── arrow-right.svg
│   │   ├── close.svg
│   │   └── chevron-down.svg
│   └── images/              ← Raster images, illustrations, photos, logo
│       ├── hero-banner.png
│       ├── avatar-placeholder.jpg
│       └── logo.svg
├── components/
│   └── Button/
│       └── Button.tsx       ← No asset files inside component folders
```

### 4.2 Rules for icons

- **Source:** Export from Figma as SVG (right-click layer → Export → SVG)
- **Folder:** Always `src/assets/icons/` — never inside a component folder
- **Naming:** kebab-case noun (`arrow-right.svg`, not `icon1.svg` or `ArrowRight.svg`)
- **Usage in React (SVGR):**
  ```tsx
  import { ReactComponent as ArrowRight } from '@/assets/icons/arrow-right.svg';

  // Usage
  <ArrowRight className="w-4 h-4 text-gray-500" />
  ```
- **Never** hardcode raw SVG markup inline inside a `.tsx` file
- **Never** place icon files inside a component's own subfolder

### 4.3 Rules for images

- **Folder:** Always `src/assets/images/`
- **Naming:** kebab-case, descriptive (`hero-banner.png`, `team-photo.jpg`)
- **Logo:** `src/assets/images/logo.svg` — it's a brand asset, not a UI icon
- **Usage:**
  ```tsx
  import heroBanner from '@/assets/images/hero-banner.png';

  // Usage
  <img src={heroBanner} alt="Hero section banner" />
  ```

### 4.4 Prompt addition for correct asset placement

Always append this to your conversion prompt:

```
Asset handling rules:
- For every icon in the design: reference it as src/assets/icons/[icon-name].svg
- For every image in the design: reference it as src/assets/images/[image-name].[ext]
- Use descriptive kebab-case names for all asset files
- Do NOT inline SVG markup inside the component file
- At the end, list all assets under "## Assets to Export" so I know
  what to manually export from Figma
```

### 4.5 Expected "Assets to Export" output

A well-formed response should end with:

```markdown
## Assets to Export from Figma

### Icons — export as SVG to src/assets/icons/
- chevron-down.svg
- close.svg
- search.svg

### Images — export at 2x to src/assets/images/
- hero-illustration.png
- avatar-placeholder.jpg
```

This gives the developer a clear, actionable checklist.

---

## Step 5 – Providing Codebase Context

The AI produces much better output when it knows your project's conventions. Create a small context file and commit it to your repo:

```markdown
# figma-context.md

## Stack
- React 18 + TypeScript
- Tailwind CSS v3 (config at tailwind.config.ts)
- shadcn/ui for base primitives

## Component conventions
- Location: src/components/[Name]/[Name].tsx
- Props interface inline in same file as [Name]Props
- Named exports only

## Asset folders
- Icons (SVG only): src/assets/icons/
- Images / illustrations / logo: src/assets/images/

## Existing base components (reuse, do not recreate)
- Button → src/components/Button/Button.tsx
- Card → src/components/Card/Card.tsx
- Input → src/components/Input/Input.tsx

## Design tokens
- Colors, spacing, typography → src/styles/tokens.ts
```

Reference it in every Figma prompt:
```
Read figma-context.md for project conventions, then convert this component: [Figma URL]
```

---

## Step 6 – Available MCP Tools (Reference)

| Tool | What it does | When to use |
|---|---|---|
| `get_design_context` | Full structure of a frame/layer | Default — use for all component conversion |
| `get_variable_defs` | Design variables (colors, spacing, typography) | Generating a design tokens file |
| `get_code_connect_map` | Maps Figma nodes → existing code components | After setting up Code Connect |
| `get_metadata` | Lightweight metadata only | Very large frames where context overflows |
| `get_figma_data` | Raw Figma REST API response | Debugging or custom scripting |

---

## Step 7 – Troubleshooting

### Output doesn't match the design visually
- Select a smaller, more focused frame (single component, not a whole section)
- Confirm the Figma layer has a proper name — unnamed layers produce generic output
- Add explicit visual requirements: `"The card has a 1px border, 8px radius, 16px inner padding"`

### AI inlines SVG markup or puts icons in wrong folder
- Explicitly state: `"Do not inline SVG. Reference all icons from src/assets/icons/"`
- Check that icons in Figma are proper **component instances** (not raw vector shapes)

### AI generates wrong image paths
- Include the full expected path in your prompt: `"All images come from src/assets/images/"`
- If the design has placeholder content, say so: `"The avatar is a placeholder — use src/assets/images/avatar-placeholder.jpg"`

### Context window overflow on large designs
- Use `get_metadata` instead of `get_design_context`
- Break the design into smaller components and convert one at a time
- Start with the most reused primitive (e.g. `Button` before `Form`)

### MCP server not connecting
- Verify your Figma API key (generate at figma.com → Account → Personal access tokens)
- Desktop server: Figma Desktop App must be running with a file open
- Remote server: check network / proxy settings

### Starter plan (6 tool calls/month limit)
- Batch multiple small components into one prompt when possible
- Use `get_metadata` for large frames to reduce call depth
- Upgrade to a Professional plan with a Dev seat for unlimited calls

---

## Key Principles

1. **Always convert at the component level** — never ask the AI to convert an entire page in one shot. Break it into individual components first.

2. **Icons always go to `src/assets/icons/`** — never inline SVGs in `.tsx` files, never store them inside a component's folder.

3. **Images always go to `src/assets/images/`** — reference by import path, never embed as base64.

4. **Always request an "Assets to Export" section** — this gives a clear checklist of what needs to be manually exported from Figma.

5. **Layer naming in Figma matters** — well-named components and icon layers (`icon/arrow-right`, `ProductCard`) produce significantly better code.

6. **MCP reads structure, not behavior** — hover states, animations, and transitions must be described explicitly in the prompt.

---

## References

- Figma MCP Developer Docs: https://developers.figma.com/docs/figma-mcp-server/
- Figma MCP GitHub Guide: https://github.com/figma/mcp-server-guide
- Code Connect Docs: https://www.figma.com/developers/api#code-connect
- Figma Help Center: https://help.figma.com/hc/en-us/articles/32132100833559