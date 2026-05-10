# Autopsy AI — Design System Cheat Sheet

Quick-reference for the **Enterprise AI Logic Systems** design language used across the Autopsy AI codebase.

---

## Palette

| Token | Hex | Role |
|-------|-----|------|
| Primary | `#4B4BA0` | Accent, emphasis, CTAs |
| Secondary | `#1A1E1C` | Supporting accent |
| Tertiary | `#8F47AE` | Contrast moments |
| Background | `#1A1E1C` | Page background |
| Surface | `#0F1110` | Cards, panels |
| Text Primary | `#FFFFFF` | Headlines, body |
| Text Secondary | `#A1A1AA` | Captions, metadata |
| Border | `#FFFFFF` | Dividers, strokes |

**Gradients**
- `bg-gradient-to-b from-white/20 to-transparent via-white/5`
- `bg-gradient-to-b from-[#161917] to-[#0a0c0b]`

---

## Typography

| Token | Font | Size | Weight | Line Height |
|-------|------|------|--------|-------------|
| display-lg | Newsreader | 48 px | 200 | 48 px |
| body-md | Inter | 14 px | 200 | 22.75 px |
| label-md | Inter | 12 px | 300 | 16 px |

- **Display**: Newsreader, weight 200, tracking `-0.025em`
- **Body / UI**: Inter, weights 200–500

---

## Spacing

Base unit: **4.8 px**

Scale: `1px`, `3px`, `4.8px`, `6px`, `7.5px`, `8px`, `12px`, `16px`

- Section padding: `24px`, `32px`, `40px`, `48px`
- Card padding: `40px`, `48px`
- Gaps: `8px`, `24px`, `32px`

---

## Elevation & Surfaces

**Style:** Elevated (not glassy).

- **Borders:** `1px solid #FFFFFF` or `1px solid #DCE5DF`
- **Shadows:**
  - `rgba(0,0,0,0.5) 0px 15px 35px -5px`
  - `rgba(0,0,0,0.6) 0px 40px 80px -20px, rgba(0,0,0,0.8) 0px 0px 0px 1px, rgba(255,255,255,0.08) 0px 1px 0px 0px inset`
- **Gradient-border shell:** wrap surface in `1px` padded shell with `16px` radius, drive edge with `linear-gradient(rgba(255,255,255,0.2), rgba(255,255,255,0.05), rgba(0,0,0,0))` for premium depth.

---

## Shapes

Corner radii: `12px`, `15px`, `16px`, `32px`, `9999px`

- Cards / panels: `0px`–`16px`
- Buttons (secondary): `9999px` (pill)
- Links: `0px`

---

## Components

### Buttons
- **Secondary:** bg `#FFFFFF`, text `#F4F4F5`, radius `9999px`, padding `8px`, border `1px solid rgba(255,255,255,0.1)`
- **Link:** text `#A1A1AA`, radius `0px`, padding `0px`

### Cards
- Radius `0px`–`16px`, padding `48px`, shadow none
- Reuse the elevated surface recipe consistently

### Icons
- Style: **Linear**
- Sets: **Solar** (also accept Lucide in code)

---

## Motion

**Level:** Moderate

- **Durations:** `150ms`, `300ms`, `700ms`
- **Easings:** `ease`, `cubic-bezier(0.4, 0, 0.2, 1)`
- **Hover:** text / color changes
- **Scroll:** GSAP ScrollTrigger for section reveals

---

## Do / Don't

| Do | Don't |
|----|-------|
| Use `#4B4BA0` as the main accent | Introduce extra accent colors without semantic reason |
| Keep spacing aligned to 4.8 px rhythm | Invent unrelated spacing values |
| Reuse Elevated surface treatment everywhere | Mix unrelated shadow or blur recipes |
| Keep corner radii inside the 12–9999 px family | Sharp-only or pill-only exceptions |

---

## Code Quick-refs

```tsx
// Typical card surface
<div className="bg-[#0F1110] border border-white/10 p-12 rounded-none">

// Gradient border glow shell
<div className="absolute -inset-[1px] bg-gradient-to-r from-white/10 via-[#4B4BA0]/50 to-white/10 rounded-full opacity-50 group-hover:opacity-100 transition-opacity duration-500 blur-[2px]" />

// Display typography
<h1 className="font-serif text-[48px] font-[200] tracking-tight leading-[48px]">

// Body typography
<p className="font-sans text-[14px] font-[200] leading-[22.75px] text-[#A1A1AA]">
```
