# DevOS — Git Workflow

## Existing Repository

Before making changes:

```bash
git status
git log --oneline --decorate --graph --all
git remote -v
```

Understand the existing project before rewriting it.

## History

Preserve legitimate history.

Do not:

- rewrite old commits
- fabricate historical work
- backdate commits
- generate meaningless commits
- create fake activity solely to manipulate contribution graphs

## Branches

Use meaningful branches:

```text
feature/github-integration
feature/project-management
feature/analytics
fix/mobile-dashboard
refactor/api-architecture
```

## Commit Messages

Use concise, truthful messages.

Examples:

```text
feat: add project creation flow
fix: handle empty project state
refactor: extract GitHub service
perf: cache repository statistics
test: add project API coverage
docs: document GitHub integration
ci: add typecheck workflow
```

## Commit Size

Prefer focused commits.

One commit should generally represent one coherent change.

Do not split trivial one-line changes into artificial commits merely for activity.

## Pull Requests

PR descriptions should explain:

- what changed
- why
- testing performed
- screenshots for UI changes where useful

## Releases

Use semantic versioning when the product reaches meaningful milestones.

## Development History

The project may naturally evolve over a long period. The Git history should reflect actual work performed, including refactors, features, fixes, tests, documentation, performance improvements, and deployment work.

Do not optimize development for contribution-graph appearance.
