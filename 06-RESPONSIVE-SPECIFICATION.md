# DevOS — Responsive Specification

## Supported Widths

Design and test at minimum:

- 320px
- 375px
- 430px
- 640px
- 768px
- 1024px
- 1280px
- 1440px
- 1920px

## Mobile

Requirements:

- no accidental horizontal overflow
- touch-friendly targets
- readable text
- stacked layouts
- compact navigation
- charts resize safely
- dialogs fit the viewport
- forms remain usable

## Tablet

Use intermediate grid layouts.

Do not simply use the mobile layout with larger spacing.

## Desktop

Use multi-column layouts where they improve scanning.

Keep a sensible content max-width.

## Large Screens

Do not stretch content across the entire screen.

Use:

```text
max-width + centered content
```

when appropriate.

## Responsive Typography

Typography should scale conservatively.

Do not make headings enormous on desktop.

## Responsive Cards

Cards should reflow naturally.

Avoid fixed heights unless required by the component.

## Responsive Charts

Charts must:

- resize
- preserve readable labels
- avoid clipping
- provide tooltips appropriate to input method

## Navigation

Desktop:

- sidebar

Mobile:

- bottom navigation and/or drawer

## Testing

Before shipping a page, inspect it at:

```text
320
375
430
768
1024
1280
1440
1920
```

Check:

- overflow
- spacing
- typography
- navigation
- interaction
- charts
- dialogs
- tables
