# DevOS — AI Coding Agent Rules

This file is the primary operating contract for coding agents working on DevOS.

## Before Coding

Read:

```text
00-PROJECT-OVERVIEW.md
01-PRODUCT-REQUIREMENTS.md
02-ARCHITECTURE.md
03-TECH-STACK.md
04-DESIGN-SYSTEM.md
05-UI-UX-SPECIFICATION.md
06-RESPONSIVE-SPECIFICATION.md
20-CODE-QUALITY.md
```

Then read the feature-specific document relevant to the task.

## Repository First

Inspect the existing repository before making architectural changes.

Do not assume the current codebase matches the documentation.

Prefer incremental improvement when the existing implementation is sound.

## Do Not

- rewrite the entire project without justification
- introduce unnecessary dependencies
- create individual CSS files for ordinary components
- duplicate components
- create giant components
- create unnecessary abstractions
- fill pages with text
- add decorative charts
- make every element a card
- use excessive gradients
- use excessive glassmorphism
- use emoji as primary UI
- expose secrets
- fabricate historical Git activity
- backdate commits
- rewrite legitimate Git history

## UI Rule

The interface must be minimal.

For every element ask:

> Does this help the user decide, understand, or act?

If not, remove it.

## Responsive Rule

Every UI change must be tested mentally and structurally for:

```text
320px
375px
430px
768px
1024px
1280px
1440px
1920px
```

Do not implement desktop-only UI.

## Styling Rule

Use:

- Tailwind
- shared components
- semantic design tokens

Avoid component-specific CSS.

## Data Rule

Do not fetch more data than the current screen needs.

## API Rule

UI → service/query → API → controller → service → repository/integration.

Do not bypass layers without a strong reason.

## Error Rule

Every asynchronous feature needs:

- loading
- empty
- error
- success

states.

## AI Rule

AI should solve a concrete problem.

Never add AI simply to make the application appear AI-powered.

## Git Rule

Commits must describe actual work performed.

Examples:

```text
feat: add GitHub repository sync
fix: handle expired GitHub connection
refactor: simplify dashboard query
test: cover task authorization
docs: document project API
```

Do not manufacture commits to create artificial contribution activity.

## Implementation Process

For each task:

1. inspect relevant code
2. understand dependencies
3. identify smallest sensible change
4. implement
5. typecheck
6. lint
7. test
8. inspect responsive behavior
9. remove unused code
10. summarize what changed

## Completion Standard

A feature is not complete merely because it renders.

Verify:

- functionality
- visual hierarchy
- responsiveness
- accessibility
- loading state
- empty state
- error handling
- type safety
- tests where appropriate
- no dead code

## Design Decision Priority

When requirements conflict, prioritize:

1. user clarity
2. accessibility
3. correctness
4. maintainability
5. performance
6. visual polish
7. novelty

## Final Principle

Build less, but make what exists excellent.

DevOS should feel like a focused developer workspace, not a collection of dashboard widgets.
