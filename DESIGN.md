---
name: W3rd Codebase
description: SAP Fiori Horizon inspired, dense internal console design system.
colors:
  background: "#F5F6F7"
  foreground: "#131E29"
  card: "#FFFFFF"
  card-foreground: "{colors.foreground}"
  popover: "{colors.card}"
  popover-foreground: "{colors.foreground}"
  primary: "#0070F2"
  primary-foreground: "#FFFFFF"
  secondary: "#EBF8FF"
  secondary-foreground: "{colors.foreground}"
  muted: "#EFF1F2"
  muted-foreground: "#556B82"
  accent: "#EBF8FF"
  accent-foreground: "{colors.foreground}"
  border: "#E5E5E5"
  input: "#D9D9D9"
  ring: "{colors.primary}"
  destructive: "#AA0808"
  sidebar: "{colors.card}"
  sidebar-foreground: "{colors.foreground}"
  sidebar-primary: "{colors.primary}"
  sidebar-primary-foreground: "{colors.primary-foreground}"
  sidebar-accent: "{colors.accent}"
  sidebar-accent-foreground: "{colors.foreground}"
  sidebar-border: "{colors.border}"
  sidebar-ring: "{colors.ring}"
  brand: "{colors.primary}"
typography:
  display:
    fontFamily: "{typography.body.fontFamily}"
    fontSize: "1.25rem"
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: "-0.01em"
  headline:
    fontFamily: "{typography.body.fontFamily}"
    fontSize: "1.125rem"
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: "-0.01em"
  title:
    fontFamily: "{typography.body.fontFamily}"
    fontSize: "1rem"
    fontWeight: 600
    lineHeight: 1.35
    letterSpacing: "-0.005em"
  body:
    fontFamily: "\"72\", Inter, system-ui, -apple-system, BlinkMacSystemFont, \"Segoe UI\", sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "normal"
  label:
    fontFamily: "{typography.body.fontFamily}"
    fontSize: "0.75rem"
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: "0.01em"
rounded:
  sm: "calc(0.625rem * 0.6)"
  md: "calc(0.625rem * 0.8)"
  lg: "0.625rem"
  xl: "calc(0.625rem * 1.4)"
spacing:
  xs: "0.25rem"
  sm: "0.5rem"
  md: "0.75rem"
  lg: "1rem"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.primary-foreground}"
    rounded: "{rounded.lg}"
    padding: "0.5rem 0.625rem"
  button-outline:
    backgroundColor: "{colors.background}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.lg}"
    padding: "0.5rem 0.625rem"
  dialog-surface:
    backgroundColor: "{colors.popover}"
    textColor: "{colors.popover-foreground}"
    rounded: "{rounded.xl}"
    padding: "1rem"
---

# Design System: W3rd Codebase

## 1. Overview

**Creative North Star: "The Precision Console"**

This system is built for internal operators working quickly through dense information. It rewards accuracy and speed through consistent structure, predictable component behavior, and high-clarity states. It should feel like a well-tuned instrument, not a decorative theme.

This project explicitly rejects a Bootstrap-like, border-heavy, dated look. Borders exist, but they are thin, quiet, and always subordinate to hierarchy.

**Key Characteristics:**
- Dense by default, readable by design.
- Familiar patterns, no invented affordances.
- State clarity over decoration.
- Restrained accent usage, focus and selection are the signal.

## 2. Colors

Colors follow SAP Fiori Horizon reference values. Morning Horizon is the light palette, Evening Horizon is the dark palette, and we map them into semantic tokens so components remain stable.

### Primary
- **Brand / Highlight** (#0070F2): Primary actions, focus ring, information emphasis.

### Neutral
- **App Background Base** (#F5F6F7): Main app surface.
- **Header / Card / Container** (#FFFFFF): Elevated surfaces.
- **Text and Titles** (#131E29): Default text.
- **Subtitles and Labels** (#556B82): Secondary copy and labels.
- **List Selection** (#EBF8FF): Selection background and subtle accents.
- **List / Table Borders** (#E5E5E5): Hairline separators.

### Named Rules (optional, powerful)
**The Signal-Only Accent Rule.** The brand highlight is not decoration. Use it only for primary intent (CTA), selection, focus rings, and semantic emphasis where ambiguity would cost time.

## 3. Typography

**Display Font:** 72 (fallback to Inter and system fonts)  
**Body Font:** 72 (fallback to Inter and system fonts)  
**Character:** Neutral, precise, and highly legible at small sizes. Weight and spacing do the hierarchy, not font changes.

### Hierarchy
- **Display** (600, 1.25rem, 1.25): Page titles only.
- **Headline** (600, 1.125rem, 1.3): Section headers and panel titles.
- **Title** (600, 1rem, 1.35): Dialog titles and key labels.
- **Body** (400, 0.875rem, 1.5): Default UI text and descriptions.
- **Label** (500, 0.75rem, 1.2): Form labels, table meta, helper text where needed.

**Reference scale (SAP-like):** 36/24/20/18/16/14px for headings, and 16/14/12px for body sizes. We keep the system compact by default, and only use the larger steps for top-level page titles.

### Named Rules (optional)
**The Small-Type Discipline Rule.** Labels stay small and calm. Use weight and spacing for clarity, never oversized type for authority.

## 4. Elevation

This system is flat by default. Elevation appears only when it communicates state, focus, or modality (dialogs, sheets, popovers). Shadows are soft and wide, never hard-edged.

### Named Rules (optional)
**The Modal Wins Rule.** When a dialog or sheet is open, the overlay and surface elevation must clearly establish a new interaction layer.

## 5. Components

### Buttons
- **Shape:** Gently rounded corners (0.625rem radius, `--radius`), smaller variants clamp down.
- **States:** Default, hover, focus-visible, active, disabled, invalid are mandatory.
- **Primary:** Uses `--primary` with `--primary-foreground`, minimal padding, no loud gradients.
- **Outline/Ghost:** Used for secondary actions, hover uses `--muted` fills.

### Dialogs / Sheets
- **Surface:** Rounded and clean, subtle ring, soft shadow.
- **Overlay:** Darken and blur slightly so the active layer is unambiguous.

### Data tables
- **Container:** Rounded, bordered, stable header and pinned columns.
- **Sticky header:** Always readable on scroll, with a quiet separator.

## 6. Do's and Don'ts

### Do:
- **Do** keep accent usage restrained and functional (focus, selection, primary actions).
- **Do** use thin, quiet borders for separation, not to “decorate” the UI.
- **Do** ship complete interaction states: hover, focus-visible, active, disabled, loading, error.

### Don't:
- **Don't** drift into a Bootstrap-like UI (heavy borders, coarse spacing, dated feel).
- **Don't** use gradient text, decorative glass blur, or “stripe borders” as accents.
