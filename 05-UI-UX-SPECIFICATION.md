# DevOS — UI/UX Specification

## General Rule

Every page must have one primary purpose.

If a user cannot identify the main action within a few seconds, simplify the page.

## Navigation

Desktop navigation:

```text
DevOS

Overview
Projects
Tasks
GitHub
Analytics
Goals
Focus

Settings
```

Keep navigation compact.

## Mobile Navigation

Do not shrink the desktop sidebar into an unusable narrow column.

Use a mobile-friendly navigation pattern such as:

- bottom navigation for primary destinations
- drawer for secondary destinations

## Page Header

Use:

```text
Page title
Short optional context
Primary action
```

Do not write large descriptive paragraphs.

## Cards

Cards should group related information.

Do not place every metric into its own card.

## Dashboard

Recommended layout:

```text
Header
Current Focus

Key Metrics

Activity + Goals

Active Projects

Recent Activity
```

Adapt the grid based on viewport width.

## Project Page

Use:

```text
Project Header
Tabs

Overview
Tasks
Milestones
Activity
Analytics
```

Use tabs to prevent information overload.

## Analytics

Charts must answer questions.

Every chart needs:

- meaningful title
- useful time range
- readable labels
- empty state
- loading state
- accessible alternative where practical

## Tables

Do not use large desktop tables on small screens.

On mobile:

- convert to stacked rows/cards where appropriate
- or allow intentional horizontal scrolling

## Forms

Forms should:

- group related fields
- use clear labels
- show inline validation
- preserve user input after recoverable errors
- avoid unnecessary fields

## Modals

Use dialogs only for focused tasks.

Do not put entire workflows into giant modal windows.

## Feedback

Use concise feedback:

```text
Project created
GitHub connected
Changes saved
```

Avoid verbose notifications.

## Empty States

Example:

```text
No projects yet.

[Create project]
```

## Error States

Example:

```text
Couldn't load GitHub activity.

[Try again]
```

## Accessibility

Support:

- keyboard navigation
- focus states
- semantic landmarks
- labels
- accessible dialogs
- sufficient contrast
- reduced motion

## Anti-AI-UI Rules

Avoid the common generated-dashboard appearance:

- every section inside a rounded card
- excessive gradients
- excessive emoji
- random floating elements
- giant hero text
- meaningless charts
- excessive glass effects
- repetitive icon + heading + paragraph cards

The UI should look intentionally designed.
