#!/usr/bin/env sh
# Repo-local public boundary guard for toreva/kit.
#
# This repo is a public thin client surface. Internal coordination artifacts
# belong in cdx or the owning internal repo, even when they do not contain
# credentials.
set -e

blocked_paths='^(\.memory/|\.husky/|intake/|reports/dispatch/|memory/objects/|plans/|docs/decisions/)$|^(\.husky/|intake/|reports/dispatch/|memory/objects/|plans/|docs/decisions/)'
blocked_files='^(AGENTS\.md|CLAUDE\.md|AGENT_CHARTER\.md|REPO_CHARTER\.md|MEMORY\.md|KPIs\.md)$'

blocked="$(git diff --cached --name-only --diff-filter=ACMR \
  | grep -E "$blocked_paths|$blocked_files|(\.err$)" \
  | grep -vE '^\.husky/local/pre-commit\.sh$' || true)"
if [ -n "$blocked" ]; then
  echo "x refusing to commit internal coordination artifacts in kit:"
  echo "$blocked" | sed 's/^/  - /'
  echo "  Move important internal facts/docs to cdx or the owning internal repo."
  exit 1
fi
