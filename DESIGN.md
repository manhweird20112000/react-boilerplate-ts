---
name: W3rd Codebase
description: A restrained API testing workbench for developers and testers.
colors:
  primary: '#6f43fd'
  surface: '#ffffff'
  surface-muted: '#f5f5f5'
  border-subtle: '#f0f0f0'
  border-hairline: '#eeeeee'
  text: '#1f1f1f'
  text-muted: '#6b7280'
  danger: '#ff4d4f'
typography:
  headline:
    fontFamily: 'Inter, sans-serif'
    fontSize: '20px'
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: 'normal'
  title:
    fontFamily: 'Inter, sans-serif'
    fontSize: '16px'
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: 'normal'
  body:
    fontFamily: 'Inter, sans-serif'
    fontSize: '14px'
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: 'normal'
  label:
    fontFamily: 'Inter, sans-serif'
    fontSize: '12px'
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: 'normal'
rounded:
  sm: '6px'
  md: '8px'
  lg: '12px'
spacing:
  xs: '8px'
  sm: '12px'
  md: '16px'
  lg: '24px'
components:
  button-primary:
    backgroundColor: '{colors.primary}'
    textColor: '{colors.surface}'
    typography: '{typography.body}'
    rounded: '{rounded.sm}'
    padding: '4px 15px'
    height: '32px'
  button-filled:
    backgroundColor: '{colors.surface-muted}'
    textColor: '{colors.text}'
    typography: '{typography.body}'
    rounded: '{rounded.sm}'
    padding: '4px 15px'
    height: '32px'
  form-field:
    backgroundColor: '{colors.surface}'
    textColor: '{colors.text}'
    typography: '{typography.body}'
    rounded: '{rounded.sm}'
    height: '32px'
  item-container:
    backgroundColor: '{colors.surface}'
    textColor: '{colors.text}'
    rounded: '{rounded.md}'
    padding: '12px'
---

# Design System: W3rd Codebase

## 1. Overview

**Creative North Star: "The API Workbench"**

This system is a compact, friendly work surface for developers and testers who spend long sessions creating requests, calling endpoints, and reading response state. It should feel professional without becoming cold: familiar Ant Design patterns, predictable spacing, and clear controls keep the interface close to the task.

The visual system is restrained by design. It uses a light, flat/layered interface with thin separators, white work surfaces, and a single violet accent reserved for primary action, selection, and focus. It rejects overly decorative, colorful, or gradient-heavy treatment because API inspection depends on calm reading and quick comparison.

**Key Characteristics:**

- Compact and friendly controls that stay readable under repeated use.
- Functional accent color, never decorative color.
- Familiar product UI patterns: sidebar, header, drawers, tables, forms, and pagination.
- Flat surfaces with layering through borders, spacing, and rare shadow.
- Complete interaction states for dense technical workflows.

## 2. Colors

The palette is light, neutral, and functional, with Focused Violet used as the single high-signal accent.

### Primary

- **Focused Violet**: Primary actions, selected calendar range endpoints, focus emphasis, and navigation highlights. Its role is to orient the user during API work, not to decorate the screen.

### Neutral

- **Workbench Surface**: The main white content, side navigation, header, drawers, forms, and tables.
- **Soft Control Fill**: Filled secondary buttons and low-emphasis control backgrounds.
- **Quiet Divider**: Table edges, sidebar separation, header separation, drawer section boundaries, and fixed pagination bars.
- **Primary Ink**: Main labels, page titles, table content, and form values.
- **Muted Ink**: Helper text, secondary descriptions, disabled context, and less important metadata.

### Named Rules

**The Signal-Only Violet Rule.** Focused Violet is used for primary intent, selection, and focus. Never use it as a decorative wash, gradient, hero treatment, or inactive surface color.

**The Neutral Workbench Rule.** Most of the interface stays neutral so request setup, response details, error states, and table data remain the visual priority.

## 3. Typography

**Display Font:** Inter, with sans-serif fallback
**Body Font:** Inter, with sans-serif fallback
**Label/Mono Font:** Inter for labels; introduce a mono face only for request, response, header, and code-like data views when those surfaces exist.

**Character:** The typography is product-native and quiet. It relies on weight and compact scale rather than oversized headings, which keeps the tool usable inside dense panels and drawers.

### Hierarchy

- **Headline** (600, 20px, 1.3): Page titles, app header titles, and primary section headings.
- **Title** (600, 16px, 1.4): Drawer titles, form group labels, modal titles, and table-adjacent section headers.
- **Body** (400, 14px, 1.5): Default UI text, table cells, descriptions, form values, and button labels.
- **Label** (500, 12px, 1.4): Field labels, compact metadata, table support labels, and calendar weekday text.

### Named Rules

**The No Display Labels Rule.** Product labels, buttons, and data never use display type. Use Inter, clear weight, and spacing instead.

**The Dense Reading Rule.** Body copy can remain compact, but long explanatory text should cap at 65 to 75 characters per line.

## 4. Elevation

The system is flat/layered. Depth is communicated first through white surfaces, thin separators, fixed positioning, and spacing. Shadow is allowed only when a surface must sit above the page, such as pagination fixed to the viewport, drawers, dropdowns, date pickers, and overlays.

### Shadow Vocabulary

- **Fixed Bar Lift** (`0 -6px 16px rgba(0, 0, 0, 0.04)`): Used by the bottom pagination bar to separate it from scrollable content without looking heavy.
- **Overlay Lift**: Use Ant Design defaults for drawers, dropdowns, pickers, and menus. These shadows are structural, not decorative.

### Named Rules

**The Flat-Until-Detached Rule.** Surfaces at rest are flat. Shadows appear only when a component is detached from the document flow or fixed above scrolling content.

## 5. Components

Components should feel compact and friendly: close to Ant Design defaults, easy to recognize, and tuned for repeated API testing work.

### Buttons

- **Shape:** Soft product radius (6px).
- **Primary:** Focused Violet background with white text, used for submit, create, apply, and the single highest-priority command in a local group.
- **Hover / Focus:** Keep Ant Design state treatment. Focus states must remain visible and meet WCAG AA expectations.
- **Secondary / Ghost / Tertiary:** Filled default buttons are used for export, reset, cancel, and overflow actions. They should stay neutral and lower-emphasis than primary.

### Chips

- **Style:** No permanent chip system is established yet. When filters or request tags are added, use neutral fills with violet only for selected state.
- **State:** Selected, dirty, or active chips must have both color and a non-color indicator such as weight, icon, checkmark, or clear affordance.

### Cards / Containers

- **Corner Style:** Item containers use a restrained 8px radius.
- **Background:** White surface against a neutral app canvas.
- **Shadow Strategy:** Flat by default. Use border and spacing before shadow.
- **Border:** Hairline neutral borders such as `rgba(5, 5, 5, 0.08)` for form item groups and `rgba(5, 5, 5, 0.06)` for shell separators.
- **Internal Padding:** Use 12px for compact repeated items, 16px for drawer bodies and mobile surfaces, 24px for desktop page content.

### Inputs / Fields

- **Style:** Ant Design field defaults with Inter typography, 32px control height, white fill, subtle border, and 6px radius.
- **Focus:** Use the primary focus ring and border shift from Ant Design. Do not remove the visible focus state.
- **Error / Disabled:** Use Ant Design semantic states. Error content must include text, not color alone.

### Navigation

- **Style:** Light sidebar and fixed header, both white, separated by thin neutral borders. Desktop uses a 240px sidebar, collapsing to 80px; mobile uses a left drawer.
- **Typography:** Navigation labels use normal product body scale with icons from Ant Design.
- **Active State:** Use the Ant Design selected menu state. Keep selection clear without adding side-stripe accent borders.
- **Mobile Treatment:** Sidebar becomes a drawer; primary page actions stack vertically and filter controls move into a bottom drawer.

### Adaptive Range Picker

The range picker is the signature custom component. Desktop uses Ant Design RangePicker; mobile swaps to a bottom drawer with a full-width day grid. Range start and end use Focused Violet, range middle uses the primary background tint, and disabled/outside dates use muted ink.

## 6. Do's and Don'ts

### Do:

- **Do** use Focused Violet only for primary actions, focus, selection, and meaningful state.
- **Do** keep surfaces light, neutral, and flat unless a component is detached above the page.
- **Do** use Inter across product UI for a consistent professional feel.
- **Do** preserve Ant Design interaction states for hover, focus-visible, active, disabled, loading, and error.
- **Do** use 16px mobile padding and 24px desktop page padding unless a tighter component context requires 12px.
- **Do** communicate important states with text, icon, shape, or affordance in addition to color.

### Don't:

- **Don't** make the product overly decorative, colorful, or gradient-heavy.
- **Don't** use marketing-style SaaS visuals, noisy dashboards, playful ornamentation, or visual treatments that distract from reading request and response details.
- **Don't** use gradient text, decorative glass blur, or colored side-stripe borders as accents.
- **Don't** make inactive states full-saturation violet.
- **Don't** replace familiar product affordances with custom controls unless there is a measurable workflow reason.
- **Don't** remove keyboard focus states or rely on color alone for validation and selection.
