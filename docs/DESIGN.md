---
name: Precision Modern
colors:
  surface: '#f7f9fb'
  surface-dim: '#d8dadc'
  surface-bright: '#f7f9fb'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f4f6'
  surface-container: '#eceef0'
  surface-container-high: '#e6e8ea'
  surface-container-highest: '#e0e3e5'
  on-surface: '#191c1e'
  on-surface-variant: '#45464d'
  inverse-surface: '#2d3133'
  inverse-on-surface: '#eff1f3'
  outline: '#76777d'
  outline-variant: '#c6c6cd'
  surface-tint: '#565e74'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#131b2e'
  on-primary-container: '#7c839b'
  inverse-primary: '#bec6e0'
  secondary: '#0058be'
  on-secondary: '#ffffff'
  secondary-container: '#2170e4'
  on-secondary-container: '#fefcff'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#0b1c30'
  on-tertiary-container: '#75859d'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dae2fd'
  primary-fixed-dim: '#bec6e0'
  on-primary-fixed: '#131b2e'
  on-primary-fixed-variant: '#3f465c'
  secondary-fixed: '#d8e2ff'
  secondary-fixed-dim: '#adc6ff'
  on-secondary-fixed: '#001a42'
  on-secondary-fixed-variant: '#004395'
  tertiary-fixed: '#d3e4fe'
  tertiary-fixed-dim: '#b7c8e1'
  on-tertiary-fixed: '#0b1c30'
  on-tertiary-fixed-variant: '#38485d'
  background: '#f7f9fb'
  on-background: '#191c1e'
  surface-variant: '#e0e3e5'
typography:
  headline-xl:
    fontFamily: Hanken Grotesk
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Hanken Grotesk
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Hanken Grotesk
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
  headline-md:
    fontFamily: Hanken Grotesk
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 14px
    letterSpacing: 0.05em
rounded:
  sm: 0.125rem
  DEFAULT: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  base: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 48px
---

## Brand & Style

This design system is built on a foundation of **Corporate Modernism** with a focus on reliability, precision, and a high-performance feel. The target audience consists of professionals in SaaS, finance, and technical sectors who value clarity over decoration. 

The aesthetic is balanced and systematic, utilizing generous whitespace and a rigorous grid to evoke a sense of professional mastery and trustworthiness. It avoids unnecessary flourishes, ensuring that every visual element serves a functional purpose or reinforces the structural integrity of the interface.

## Colors

The palette is anchored by a deep slate primary color, providing a grounded and authoritative base. A vibrant blue serves as the secondary color, used strategically for primary actions and highlights to guide user attention. 

Tertiary slate-grays manage lower-priority information and borders, while the neutral off-white provides a clean, low-strain background for extended focus. Color is applied with restraint to maintain a sophisticated, data-centric atmosphere.

## Typography

The typographic system utilizes a triple-font approach to maximize clarity across different information types. **Hanken Grotesk** provides a sharp, contemporary edge for headlines. **Inter** handles body copy with its industry-standard legibility and neutral tone. **JetBrains Mono** is used for labels, metadata, and technical values to reinforce the precision-engineered feel of the design system.

Line heights are optimized for readability, with headlines featuring tighter tracking to appear more cohesive at larger sizes.

## Layout & Spacing

The layout follows a strict 8px spacing rhythm derived from a 4px base unit. A 12-column fluid grid is used for desktop layouts, transitioning to a 4-column grid for mobile devices. 

Gutters remain constant at 24px to ensure consistent vertical breathing room, while outer margins expand on larger screens to prevent content from becoming overly wide. Layouts should prioritize vertical stacking and clear grouping to facilitate rapid scanning of information.

## Elevation & Depth

This design system uses **Tonal Layers** and **Low-Contrast Outlines** rather than heavy shadows. Depth is communicated through subtle shifts in background color (e.g., a slightly darker neutral for the page background and a pure white for card surfaces).

When elevation is required for floating elements like dropdowns or modals, use extremely diffused, low-opacity neutral shadows (10-15% opacity) to maintain the clean, professional aesthetic without introducing "muddiness."

## Shapes

The shape language is defined by a specific **6px border radius** (the `rounded` / `DEFAULT` token) for all standard interactive elements. This choice provides a subtle softening of the corporate aesthetic while maintaining a disciplined, geometric feel that aligns with the "Precision Modern" brand.

Use the 6px radius for buttons, input fields, and small components. For larger containers like cards or panels, the radius should remain consistent at 6px to preserve the systematic visual language across the entire interface.

## Components

### Buttons
Primary buttons use the secondary color (#3B82F6) with white text and a 6px radius. Secondary buttons use a subtle slate-gray outline or ghost style. Interaction states should be indicated by a slight darkening of the background color.

### Input Fields
Fields feature a 1px border in a light slate-gray with 6px rounded corners. The focus state uses a 2px secondary color border. Labels use the `label-sm` typography role for a technical, precise appearance.

### Cards
Cards are defined by their white background and 1px light-gray border. They use the standard 6px corner radius. Internal padding should follow the `lg` (24px) spacing token.

### Chips & Tags
Small, 6px-rounded containers used for categorization. These should utilize the `label-sm` typography and maintain low color contrast to avoid distracting from primary actions.

### Lists
Lists should feature clear horizontal dividers using 1px slate-gray lines at 10-20% opacity. Interactive list items should have a subtle background hover state.