---description: List GitHub issues, read details, close with commit references---
## List all open issues

```sh
gh issue list --limit 20
```

## View specific issue

```sh
gh issue view <NUMBER> --json title,body,labels
```

## Close issue with commit reference

1. Find the commit hash(es) that resolve the issue:

```sh
git log --oneline --all --grep="<keyword>"
```

2. Close the issue with a comment listing commits:

```sh
gh issue close <NUMBER> --comment "Zamknięte przez <HASH>: <opis>"
```

## Batch: close multiple issues at once

```sh
for n in 1 2 3; do gh issue close "$n" --comment "Closed by <HASH>"; done
```
