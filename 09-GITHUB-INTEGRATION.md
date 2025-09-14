# DevOS — GitHub Integration

## Goal

Turn GitHub activity into concise developer insights.

## Connection

Use GitHub OAuth.

Store only the minimum required information.

Never expose GitHub client secrets to the browser.

## Data

Potentially synchronize:

- profile
- repositories
- commits
- pull requests
- issues
- stars
- forks
- languages
- contribution activity where available

## Service Architecture

```text
github/
├── github.client.ts
├── github.service.ts
├── github.mapper.ts
├── github.types.ts
└── github.cache.ts
```

## API Flow

```text
Frontend
 ↓
GET /api/github/activity
 ↓
Controller
 ↓
GitHubService
 ↓
GitHub Client
 ↓
GitHub API
```

## Caching

Do not request the same data repeatedly.

Use appropriate cache durations based on data volatility.

## Rate Limits

Handle:

- rate-limit responses
- expired OAuth
- unavailable repository
- deleted repository
- network failure

## UI

Show summary first:

```text
1,284 commits
42 PRs
18 repositories
```

Then allow details.

## Repository Cards

Show:

- repository name
- visibility
- primary language
- stars
- recent activity

Do not show every available GitHub field.

## Contribution Heatmap

The heatmap should be compact and readable.

Provide a text summary for accessibility.

## Sync

Allow manual refresh.

Later support scheduled/background synchronization.

## Data Integrity

Map external GitHub objects into internal types.

Do not expose raw GitHub API response structures throughout the application.
