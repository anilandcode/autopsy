---
version: "alpha"
name: "Design Inspiration Layout"
description: "Design Inspiration Feature Section is designed for highlighting product capabilities and value points. Key features include reusable structure, responsive behavior, and production-ready presentation. It is suitable for component libraries and responsive product interfaces."
colors:
  primary: "#0F172A"
  secondary: "#FD6703"
  tertiary: "#F5A345"
  neutral: "#FFFFFF"
  background: "#FFFFFF"
  surface: "#0F172A"
  text-primary: "#0F172A"
  text-secondary: "#64748B"
  border: "#E2E8F0"
  accent: "#0F172A"
typography:
  display-lg:
    fontFamily: "Inter"
    fontSize: "48px"
    fontWeight: 500
    lineHeight: "48px"
    letterSpacing: "-0.025em"
  body-md:
    fontFamily: "Inter"
    fontSize: "12px"
    fontWeight: 400
    lineHeight: "16px"
  label-md:
    fontFamily: "Inter"
    fontSize: "12px"
    fontWeight: 500
    lineHeight: "16px"
rounded:
  full: "9999px"
spacing:
  base: "4px"
  sm: "4px"
  md: "6px"
  lg: "8px"
  xl: "10px"
  gap: "4px"
  card-padding: "16px"
  section-padding: "24px"
components:
  button-primary:
    backgroundColor: "{colors.secondary}"
    textColor: "{colors.neutral}"
    typography: "{typography.label-md}"
    rounded: "{rounded.full}"
    padding: "6px"
  card:
    backgroundColor: "{colors.neutral}"
    rounded: "16px"
    padding: "24px"
---

## Overview

- **Composition cues:**
  - Layout: Grid
  - Content Width: Full Bleed
  - Framing: Glassy
  - Grid: Strong

## Colors

The color system uses light mode with #0F172A as the main accent and #FFFFFF as the neutral foundation.

- **Primary (#0F172A):** Main accent and emphasis color.
- **Secondary (#FD6703):** Supporting accent for secondary emphasis.
- **Tertiary (#F5A345):** Reserved accent for supporting contrast moments.
- **Neutral (#FFFFFF):** Neutral foundation for backgrounds, surfaces, and supporting chrome.

- **Usage:** Background: #FFFFFF; Surface: #0F172A; Text Primary: #0F172A; Text Secondary: #64748B; Border: #E2E8F0; Accent: #0F172A

- **Gradients:** bg-gradient-to-br from-[#EAE2F8] to-[#F3E8FF], bg-gradient-to-tr from-[#E2D8F0] to-[#FADDF0], bg-gradient-to-br from-[#E0F2FE] to-[#FCE7F3] via-[#F3E8FF], bg-gradient-to-r from-blue-300 to-purple-300

## Typography

Typography relies on Inter across display, body, and utility text.

- **Display (`display-lg`):** Inter, 48px, weight 500, line-height 48px, letter-spacing -0.025em.
- **Body (`body-md`):** Inter, 12px, weight 400, line-height 16px.
- **Labels (`label-md`):** Inter, 12px, weight 500, line-height 16px.

## Layout

Layout follows a grid composition with reusable spacing tokens. Preserve the grid, full bleed structural frame before changing ornament or component styling. Use 4px as the base rhythm and let larger gaps step up from that cadence instead of introducing unrelated spacing values.

Treat the page as a grid / full bleed composition, and keep that framing stable when adding or remixing sections.

- **Layout type:** Grid
- **Content width:** Full Bleed
- **Base unit:** 4px
- **Scale:** 4px, 6px, 8px, 10px, 12px, 16px, 20px, 24px
- **Section padding:** 24px, 32px
- **Card padding:** 16px, 24px, 32px
- **Gaps:** 4px, 8px, 12px, 16px

## Elevation & Depth

Depth is communicated through glass, border contrast, and reusable shadow or blur treatments. Keep those recipes consistent across hero panels, cards, and controls so the page reads as one material system.

Surfaces should read as glass first, with borders, shadows, and blur only reinforcing that material choice.

- **Surface style:** Glass
- **Borders:** 1px #E2E8F0; 1px #F1F5F9; 1px #FFFFFF; 16px #0F172A
- **Shadows:** rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0.04) 0px 8px 40px 0px; rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0.1) 0px 20px 25px -5px, rgba(0, 0, 0, 0.1) 0px 8px 10px -6px; rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0.1) 0px 4px 6px -1px, rgba(0, 0, 0, 0.1) 0px 2px 4px -2px
- **Blur:** 64px, 12px

### Techniques
- **Gradient border shell:** Use a thin gradient border shell around the main card. Wrap the surface in an outer shell with 24px padding and a 0px radius. Drive the shell with linear-gradient(to right top, rgb(226, 216, 240), rgb(250, 221, 240)) so the edge reads like premium depth instead of a flat stroke. Keep the actual stroke understated so the gradient shell remains the hero edge treatment. Inset the real content surface inside the wrapper with a slightly smaller radius so the gradient only appears as a hairline frame.

## Shapes

Shapes rely on a tight radius system anchored by 8px and scaled across cards, buttons, and supporting surfaces. Icon geometry should stay compatible with that soft-to-controlled silhouette.

Use the radius family intentionally: larger surfaces can open up, but controls and badges should stay within the same rounded DNA instead of inventing sharper or pill-only exceptions.

- **Corner radii:** 8px, 16px, 40px, 9999px
- **Icon treatment:** Linear
- **Icon sets:** Solar

## Components

Anchor interactions to the detected button styles. Reuse the existing card surface recipe for content blocks.

### Buttons
- **Primary:** background #FD6703, text #FFFFFF, radius 9999px, padding 6px, border 0px solid rgb(229, 231, 235).

### Cards and Surfaces
- **Card surface:** background #FFFFFF, border 1px solid rgba(226, 232, 240, 0.6), radius 16px, padding 24px, shadow none.
- **Card surface:** background #FFFFFF, border 1px solid rgba(226, 232, 240, 0.6), radius 16px, padding 32px, shadow none.
- **Card surface:** border 0px solid rgb(229, 231, 235), radius 0px, padding 24px, shadow none.

### Iconography
- **Treatment:** Linear.
- **Sets:** Solar.

## Do's and Don'ts

Use these constraints to keep future generations aligned with the current system instead of drifting into adjacent styles.

### Do
- Do use the primary palette as the main accent for emphasis and action states.
- Do keep spacing aligned to the detected 4px rhythm.
- Do reuse the Glass surface treatment consistently across cards and controls.
- Do keep corner radii within the detected 8px, 16px, 40px, 9999px family.

### Don't
- Don't introduce extra accent colors outside the core palette roles unless the page needs a new semantic state.
- Don't mix unrelated shadow or blur recipes that break the current depth system.
- Don't exceed the detected expressive motion intensity without a deliberate reason.

## Motion

Motion feels expressive but remains focused on interface, text, and layout transitions. Timing clusters around 150ms and 300ms. Easing favors ease and cubic-bezier(0.4. Hover behavior focuses on color and shadow changes.

**Motion Level:** expressive

**Durations:** 150ms, 300ms, 500ms, 12000ms, 24000ms, 6000ms

**Easings:** ease, cubic-bezier(0.4, 0, 0.2, 1), ease-in-out

**Hover Patterns:** color, shadow
