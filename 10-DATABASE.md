# DevOS — Database Specification

## Database

MongoDB with Mongoose.

## User

```text
_id
name
email
passwordHash
avatar
preferences
createdAt
updatedAt
```

## Project

```text
_id
ownerId
name
description
status
progress
repository
technologies
createdAt
updatedAt
archivedAt
```

## Task

```text
_id
ownerId
projectId
title
description
status
priority
labels
dueDate
createdAt
updatedAt
completedAt
```

## Goal

```text
_id
ownerId
title
period
target
current
deadline
status
createdAt
updatedAt
```

## FocusSession

```text
_id
ownerId
projectId
taskId
startedAt
endedAt
duration
status
notes
```

## Activity

```text
_id
ownerId
source
type
metadata
timestamp
```

## GitHubRepository

```text
_id
ownerId
githubId
name
fullName
url
private
language
stars
forks
lastSyncedAt
```

## Indexing

Index common queries:

- ownerId
- ownerId + status
- projectId + status
- ownerId + timestamp
- githubId

## Ownership

All user-owned models must contain an ownership relationship.

Queries must always scope results to the authenticated user.

## Soft Delete

Use archive/soft-delete behavior where data recovery is useful.

Do not permanently delete data by default when an archive model is more appropriate.
