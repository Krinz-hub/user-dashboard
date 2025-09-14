# DevOS — Design System

## Goal

Create one coherent visual system. Individual components must not invent their own design language.

## Styling Rule

Use Tailwind CSS and centralized CSS variables.

Do not create component-specific CSS files unless there is a genuinely unavoidable third-party integration requirement.

Avoid:

```text
Dashboard.css
Card.css
Sidebar.css
ProjectCard.css
```

Prefer shared primitives and utility classes.

## Semantic Tokens

Define tokens for:

- background
- foreground
- card
- muted
- muted foreground
- border
- primary
- primary foreground
- success
- warning
- danger
- focus ring

## Typography

Use a restrained type scale.

Recommended hierarchy:

- page title
- section title
- body
- secondary text
- metadata

Avoid oversized typography that consumes most of the viewport.

## Spacing

Use the Tailwind spacing scale consistently.

Do not randomly mix arbitrary pixel values.

## Radius

Use a small number of radius levels:

- small
- medium
- large

Do not make every element excessively rounded.

## Shadows

Use subtle elevation.

Avoid heavy glowing shadows.

## Icons

Use Lucide icons consistently.

Icons must support meaning; do not add icons purely as decoration.

## Components

Build reusable primitives:

- Button
- Input
- Select
- Dialog
- Dropdown
- Badge
- Card
- Tabs
- Tooltip
- Skeleton
- EmptyState
- ErrorState
- DataTable where needed

## Dark and Light Mode

Both themes must use the same semantic token system.

Do not hardcode separate component colors for dark mode.

## Visual Character

The product should feel:

- calm
- technical
- premium
- focused
- understated

Avoid excessive:

- gradients
- glassmorphism
- neon
- glowing borders
- floating decorative elements
- animated backgrounds
