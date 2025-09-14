# DevOS — AI Features

## Principle

AI is an assistant layer, not the product itself.

## Project Planner

Input:

```text
Build a weather application
```

Output:

```text
1. Define architecture
2. Build weather API integration
3. Create dashboard
4. Add authentication
5. Add deployment
```

The user should be able to edit the generated plan.

## Task Breakdown

Input:

```text
Build authentication
```

Possible output:

```text
Create auth schema
Create signup endpoint
Create login endpoint
Add session handling
Build login UI
Add tests
```

## Weekly Review

Generate a concise review from real activity:

- completed work
- notable progress
- bottleneck
- suggested next focus

Keep output short.

## Project Health

Evaluate signals such as:

- stale tasks
- overdue tasks
- recent activity
- milestone progress

Do not present AI guesses as facts.

Use language such as:

```text
Possible bottleneck
```

instead of:

```text
Your bottleneck is definitely...
```

## AI Architecture

```text
Frontend
 ↓
API
 ↓
AI Service
 ↓
Provider
```

Never call the AI provider directly from the browser.

## Prompting

Store reusable prompts centrally.

Do not scatter giant prompts across React components.

## Privacy

Do not send unnecessary personal/project data to an AI provider.

Allow users to understand what information is being processed.

## Failure

AI failure must never break the core application.

If AI is unavailable, the rest of DevOS remains functional.
