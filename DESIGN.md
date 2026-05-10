---
version: "alpha"
name: "Enterprise AI Logic Systems"
description: "Enterprise Logic Pricing Section is designed for comparing plans and supporting conversion decisions. Key features include plan comparison blocks and conversion-oriented actions. It is suitable for subscription pricing pages and plan comparison experiences."
colors:
  primary: "#4B4BA0"
  secondary: "#1A1E1C"
  tertiary: "#8F47AE"
  neutral: "#1A1E1C"
  background: "#1A1E1C"
  surface: "#0F1110"
  text-primary: "#FFFFFF"
  text-secondary: "#A1A1AA"
  border: "#FFFFFF"
  accent: "#4B4BA0"
typography:
  display-lg:
    fontFamily: "Newsreader"
    fontSize: "48px"
    fontWeight: 200
    lineHeight: "48px"
    letterSpacing: "-0.025em"
  body-md:
    fontFamily: "Inter"
    fontSize: "14px"
    fontWeight: 200
    lineHeight: "22.75px"
  label-md:
    fontFamily: "Inter"
    fontSize: "12px"
    fontWeight: 300
    lineHeight: "16px"
rounded:
  md: "0px"
  full: "9999px"
spacing:
  base: "4.8px"
  sm: "1px"
  md: "3px"
  lg: "4.8px"
  xl: "6px"
  gap: "8px"
  card-padding: "40px"
  section-padding: "24px"
components:
  button-secondary:
    backgroundColor: "{colors.text-primary}"
    textColor: "#F4F4F5"
    typography: "{typography.label-md}"
    rounded: "{rounded.full}"
    padding: "8px"
  button-link:
    textColor: "{colors.text-secondary}"
    rounded: "{rounded.md}"
    padding: "0px"
  card:
    rounded: "{rounded.md}"
    padding: "48px"
---

## Overview

- **Composition cues:**
  - Layout: Grid
  - Content Width: Bounded
  - Framing: Open
  - Grid: Strong

## Colors

The color system uses dark mode with #4B4BA0 as the main accent and #1A1E1C as the neutral foundation.

- **Primary (#4B4BA0):** Main accent and emphasis color.
- **Secondary (#1A1E1C):** Supporting accent for secondary emphasis.
- **Tertiary (#8F47AE):** Reserved accent for supporting contrast moments.
- **Neutral (#1A1E1C):** Neutral foundation for backgrounds, surfaces, and supporting chrome.

- **Usage:** Background: #1A1E1C; Surface: #0F1110; Text Primary: #FFFFFF; Text Secondary: #A1A1AA; Border: #FFFFFF; Accent: #4B4BA0

- **Gradients:** bg-gradient-to-b from-white/20 to-transparent via-white/5, bg-gradient-to-b from-[#161917] to-[#0a0c0b]

## Typography

Typography pairs Newsreader for display hierarchy with Inter for supporting content and interface copy.

- **Display (`display-lg`):** Newsreader, 48px, weight 200, line-height 48px, letter-spacing -0.025em.
- **Body (`body-md`):** Inter, 14px, weight 200, line-height 22.75px.
- **Labels (`label-md`):** Inter, 12px, weight 300, line-height 16px.

## Layout

Layout follows a grid composition with reusable spacing tokens. Preserve the grid, bounded structural frame before changing ornament or component styling. Use 4.8px as the base rhythm and let larger gaps step up from that cadence instead of introducing unrelated spacing values.

Treat the page as a grid / bounded composition, and keep that framing stable when adding or remixing sections.

- **Layout type:** Grid
- **Content width:** Bounded
- **Base unit:** 4.8px
- **Scale:** 1px, 3px, 4.8px, 6px, 7.5px, 8px, 12px, 16px
- **Section padding:** 24px, 32px, 40px, 48px
- **Card padding:** 40px, 48px
- **Gaps:** 8px, 24px, 32px

## Elevation & Depth

Depth is communicated through elevated, border contrast, and reusable shadow or blur treatments. Keep those recipes consistent across hero panels, cards, and controls so the page reads as one material system.

Surfaces should read as elevated first, with borders, shadows, and blur only reinforcing that material choice.

- **Surface style:** Elevated
- **Borders:** 1px #FFFFFF; 1px #DCE5DF
- **Shadows:** rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0.5) 0px 15px 35px -5px; rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0.4) 0px 2px 15px 0px inset; rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0.6) 0px 40px 80px -20px, rgba(0, 0, 0, 0.8) 0px 0px 0px 1px, rgba(255, 255, 255, 0.08) 0px 1px 0px 0px inset

### Techniques
- **Gradient border shell:** Use a thin gradient border shell around the main card. Wrap the surface in an outer shell with 1px padding and a 16px radius. Drive the shell with linear-gradient(rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.05), rgba(0, 0, 0, 0)) so the edge reads like premium depth instead of a flat stroke. Keep the actual stroke understated so the gradient shell remains the hero edge treatment. Inset the real content surface inside the wrapper with a slightly smaller radius so the gradient only appears as a hairline frame.

## Shapes

Shapes rely on a tight radius system anchored by 12px and scaled across cards, buttons, and supporting surfaces. Icon geometry should stay compatible with that soft-to-controlled silhouette.

Use the radius family intentionally: larger surfaces can open up, but controls and badges should stay within the same rounded DNA instead of inventing sharper or pill-only exceptions.

- **Corner radii:** 12px, 15px, 16px, 32px, 9999px
- **Icon treatment:** Linear
- **Icon sets:** Solar

## Components

Anchor interactions to the detected button styles. Reuse the existing card surface recipe for content blocks.

### Buttons
- **Secondary:** background #FFFFFF, text #F4F4F5, radius 9999px, padding 8px, border 1px solid rgba(255, 255, 255, 0.1).
- **Links:** text #A1A1AA, radius 0px, padding 0px, border 0px solid rgb(229, 231, 235).

### Cards and Surfaces
- **Card surface:** radius 0px, padding 48px, shadow none.

### Iconography
- **Treatment:** Linear.
- **Sets:** Solar.

## Do's and Don'ts

Use these constraints to keep future generations aligned with the current system instead of drifting into adjacent styles.

### Do
- Do use the primary palette as the main accent for emphasis and action states.
- Do keep spacing aligned to the detected 4.8px rhythm.
- Do reuse the Elevated surface treatment consistently across cards and controls.
- Do keep corner radii within the detected 12px, 15px, 16px, 32px, 9999px family.

### Don't
- Don't introduce extra accent colors outside the core palette roles unless the page needs a new semantic state.
- Don't mix unrelated shadow or blur recipes that break the current depth system.
- Don't exceed the detected moderate motion intensity without a deliberate reason.

## Motion

Motion feels controlled and interface-led across text, layout, and section transitions. Timing clusters around 150ms and 700ms. Easing favors ease and cubic-bezier(0.4. Hover behavior focuses on text and color changes. Scroll choreography uses GSAP ScrollTrigger for section reveals and pacing.

**Motion Level:** moderate

**Durations:** 150ms, 700ms, 300ms

**Easings:** ease, cubic-bezier(0.4, 0, 0.2, 1)

**Hover Patterns:** text, color

**Scroll Patterns:** gsap-scrolltrigger
