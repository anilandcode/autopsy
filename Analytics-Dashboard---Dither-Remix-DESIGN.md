---
version: "alpha"
name: "Analytics Dashboard - Dither Remix"
description: "Analytics Dither Login Section is designed for authenticating users through a focused access flow. Key features include reusable structure, responsive behavior, and production-ready presentation. It is suitable for authentication screens in web products."
colors:
  primary: "#34D399"
  secondary: "#FACC15"
  tertiary: "#10B981"
  neutral: "#050505"
  background: "#050505"
  surface: "#FFFFFF"
  text-primary: "#FFFFFF"
  text-secondary: "#D4D4D4"
  border: "#FFFFFF"
  accent: "#34D399"
typography:
  display-lg:
    fontFamily: "Inter"
    fontSize: "60px"
    fontWeight: 600
    lineHeight: "60px"
    letterSpacing: "-0.025em"
  body-md:
    fontFamily: "Inter"
    fontSize: "12px"
    fontWeight: 400
    lineHeight: "16px"
rounded:
  sm: "6px"
  lg: "8px"
spacing:
  base: "4px"
  sm: "1px"
  md: "2px"
  lg: "4px"
  xl: "6px"
  gap: "4px"
  card-padding: "8px"
  section-padding: "64px"
components:
  button-primary:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.surface}"
    typography: "{typography.body-md}"
    rounded: "{rounded.lg}"
    padding: "6px"
  button-secondary:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.surface}"
    rounded: "{rounded.sm}"
    padding: "6px"
  button-link:
    textColor: "{colors.surface}"
    typography: "{typography.body-md}"
    rounded: "0px"
    padding: "0px"
  card:
    rounded: "{rounded.lg}"
    padding: "11px"
---

## Overview

- **Composition cues:**
  - Layout: Grid
  - Content Width: Full Bleed
  - Framing: Glassy
  - Grid: Strong

## Colors

The color system uses dark mode with #34D399 as the main accent and #050505 as the neutral foundation.

- **Primary (#34D399):** Main accent and emphasis color.
- **Secondary (#FACC15):** Supporting accent for secondary emphasis.
- **Tertiary (#10B981):** Reserved accent for supporting contrast moments.
- **Neutral (#050505):** Neutral foundation for backgrounds, surfaces, and supporting chrome.

- **Usage:** Background: #050505; Surface: #FFFFFF; Text Primary: #FFFFFF; Text Secondary: #D4D4D4; Border: #FFFFFF; Accent: #34D399

- **Gradients:** bg-gradient-to-b from-transparent to-transparent via-white/10, bg-gradient-to-b from-transparent to-transparent via-white/5, bg-gradient-to-b from-white to-white/60, bg-gradient-to-b from-white/30 to-white/5

## Typography

Typography relies on Inter across display, body, and utility text.

- **Display (`display-lg`):** Inter, 60px, weight 600, line-height 60px, letter-spacing -0.025em.
- **Body (`body-md`):** Inter, 12px, weight 400, line-height 16px.

## Layout

Layout follows a grid composition with reusable spacing tokens. Preserve the grid, full bleed structural frame before changing ornament or component styling. Use 4px as the base rhythm and let larger gaps step up from that cadence instead of introducing unrelated spacing values.

Treat the page as a grid / full bleed composition, and keep that framing stable when adding or remixing sections.

- **Layout type:** Grid
- **Content width:** Full Bleed
- **Base unit:** 4px
- **Scale:** 1px, 2px, 4px, 6px, 8px, 10px, 12px, 16px
- **Section padding:** 64px
- **Card padding:** 8px, 9px, 11px, 12px
- **Gaps:** 4px, 6px, 8px, 10px

## Elevation & Depth

Depth is communicated through glass, border contrast, and reusable shadow or blur treatments. Keep those recipes consistent across hero panels, cards, and controls so the page reads as one material system.

Surfaces should read as glass first, with borders, shadows, and blur only reinforcing that material choice.

- **Surface style:** Glass
- **Borders:** 1px #FFFFFF; 1px #10B981
- **Shadows:** rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 1px 2px 0px; rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0.4) 0px 4px 24px 0px; rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 2px 4px 0px inset
- **Blur:** 12px, 40px, 8px

### Techniques
- **Gradient border shell:** Use a thin gradient border shell around the main card. Wrap the surface in an outer shell with 1px padding and a 12px radius. Drive the shell with linear-gradient(rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.05)) so the edge reads like premium depth instead of a flat stroke. Keep the actual stroke understated so the gradient shell remains the hero edge treatment. Inset the real content surface inside the wrapper with a slightly smaller radius so the gradient only appears as a hairline frame.

## Shapes

Shapes rely on a tight radius system anchored by 4px and scaled across cards, buttons, and supporting surfaces. Icon geometry should stay compatible with that soft-to-controlled silhouette.

Use the radius family intentionally: larger surfaces can open up, but controls and badges should stay within the same rounded DNA instead of inventing sharper or pill-only exceptions.

- **Corner radii:** 4px, 6px, 8px, 12px, 16px, 9999px
- **Icon treatment:** Linear
- **Icon sets:** Solar

## Components

Anchor interactions to the detected button styles. Reuse the existing card surface recipe for content blocks.

### Buttons
- **Primary:** background #FFFFFF, text #FFFFFF, radius 8px, padding 6px, border 1px solid rgba(255, 255, 255, 0.1).
- **Secondary:** background #FFFFFF, text #FFFFFF, radius 6px, padding 6px, border 1px solid rgba(255, 255, 255, 0.1).
- **Links:** text #FFFFFF, radius 0px, padding 0px, border 0px solid rgb(229, 231, 235).

### Cards and Surfaces
- **Card surface:** border 1px solid rgba(255, 255, 255, 0.05), radius 8px, padding 11px, shadow none.
- **Card surface:** border 1px solid rgba(255, 255, 255, 0.05), radius 12px, padding 12px, shadow none.
- **Card surface:** border 1px solid rgba(255, 255, 255, 0.05), radius 12px, padding 16px, shadow none.

### Iconography
- **Treatment:** Linear.
- **Sets:** Solar.

## Do's and Don'ts

Use these constraints to keep future generations aligned with the current system instead of drifting into adjacent styles.

### Do
- Do use the primary palette as the main accent for emphasis and action states.
- Do keep spacing aligned to the detected 4px rhythm.
- Do reuse the Glass surface treatment consistently across cards and controls.
- Do keep corner radii within the detected 4px, 6px, 8px, 12px, 16px, 9999px family.

### Don't
- Don't introduce extra accent colors outside the core palette roles unless the page needs a new semantic state.
- Don't mix unrelated shadow or blur recipes that break the current depth system.
- Don't exceed the detected expressive motion intensity without a deliberate reason.

## Motion

Motion feels expressive but remains focused on interface, text, and layout transitions. Timing clusters around 150ms and 3000ms. Easing favors ease and 1). Hover behavior focuses on color and text changes. Scroll choreography uses GSAP ScrollTrigger for section reveals and pacing.

**Motion Level:** expressive

**Durations:** 150ms, 3000ms, 300ms, 1500ms, 2000ms, 500ms

**Easings:** ease, 1), 0.2, cubic-bezier(0.4, 0, linear

**Hover Patterns:** color, text, stroke, transform

**Scroll Patterns:** gsap-scrolltrigger

## WebGL

Reconstruct the graphics as a full-bleed background field using webgl, custom shaders. The effect should read as retro-futurist, technical, and meditative: fluid wave field with green on black and sparse spacing. Build it from shader field so the effect reads clearly. Animate it as slow breathing pulse. Interaction can react to the pointer, but only as a subtle drift. Preserve dom fallback.

**Id:** webgl

**Label:** WebGL

**Stack:** WebGL

**Insights:**
  - **Scene:**
    - **Value:** Full-bleed background field
  - **Effect:**
    - **Value:** Fluid wave field
  - **Primitives:**
    - **Value:** Shader field
  - **Motion:**
    - **Value:** Slow breathing pulse
  - **Interaction:**
    - **Value:** Pointer-reactive drift
  - **Render:**
    - **Value:** WebGL, custom shaders

**Techniques:** Breathing pulse, Pointer parallax, Shader gradients, Noise fields, DOM fallback

**Code Evidence:**
  - **HTML reference:**
    - **Language:** html
    - **Snippet:**
      ```html
      <!-- Remixed Dither Background Component -->
      <div class="fixed inset-0 w-full h-full -z-20 bg-[#050505]">
          <canvas id="dither-bg" class="w-full h-full opacity-80" style="mask-image: linear-gradient(to bottom, black 0%, black 75%, transparent 100%); -webkit-mask-image: linear-gradient(to bottom, black 0%, black 75%, transparent 100%);"></canvas>
      </div>
      ```
  - **JS reference:**
    - **Language:** js
    - **Snippet:**
      ```
      const canvas = document.getElementById('dither-bg');
      const gl = canvas.getContext('webgl');

      const vsSource = `
          attribute vec2 position;
          void main() { gl_Position = vec4(position, 0.0, 1.0); }
      `;
      ```
  - **Renderer setup:**
    - **Language:** js
    - **Snippet:**
      ```
      const canvas = document.getElementById('dither-bg');
      const gl = canvas.getContext('webgl');

      const vsSource = `
          attribute vec2 position;
          void main() { gl_Position = vec4(position, 0.0, 1.0); }
      ```
  - **Draw call:**
    - **Language:** js
    - **Snippet:**
      ```
      `;

      const fsSource = `
          precision highp float;
          uniform vec2 u_resolution;
          uniform float u_time;

          float hash(vec2 p) {
      …
      ```
