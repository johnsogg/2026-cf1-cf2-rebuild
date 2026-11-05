#!/usr/bin/env bash
# Publish a clean, history-free snapshot of a PRIVATE homework repo as a PUBLIC
# template repo that students copy with "Use this template".
#
# Naming: private repos are `hw-<name>-private`; the public template students
# copy is `hw-<name>`. One public template serves both CF1 and CF2.
#
#   ./publish-template.sh hw-aabb-private              # dry run: shows what would happen
#   ./publish-template.sh hw-aabb-private --execute    # create/update codezeug/hw-aabb
#
# What gets published: the files of the local `main` branch of the private repo
# (via `git archive`), as ONE new commit with no history. The `solution` branch
# and main's older commits (which may contain the solution) are never included.
# Uncommitted changes are NOT included. Re-publishing force-pushes a fresh
# single commit over the public repo.
#
# Needs: git, gh (authenticated with rights to create repos in the org).
set -euo pipefail

ORG=codezeug
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# Note to self: this script lives in the book repo (2026-cf1-cf2-rebuild/scripts)
# and expects the private homework repos in a sibling directory of the book repo:
#   ~/courses/2026-cf1-cf2-rebuild/   <- this repo
#   ~/courses/cf2-private/            <- hw-*-private clones live here
PRIVATE_DIR="$(cd "$SCRIPT_DIR/../.." 2>/dev/null && pwd)/cf2-private"
if [[ ! -d "$PRIVATE_DIR" ]]; then
  echo "Can't find the private homework directory." >&2
  echo "Expected it at: $PRIVATE_DIR" >&2
  echo "(a 'cf2-private' directory next to the 2026-cf1-cf2-rebuild repo, holding the hw-*-private clones)" >&2
  exit 1
fi
EXECUTE=0
POSITIONAL=()

for arg in "$@"; do
  case "$arg" in
    --execute) EXECUTE=1 ;;
    -*) echo "unknown option: $arg" >&2; exit 2 ;;
    *) POSITIONAL+=("$arg") ;;
  esac
done

if [[ ${#POSITIONAL[@]} -ne 1 ]]; then
  echo "usage: $0 hw-<name>-private [--execute]" >&2
  exit 2
fi
SRC="${POSITIONAL[0]}"

[[ "$SRC" =~ ^hw-[a-z0-9-]+-private$ ]] || { echo "source must look like hw-<name>-private, got '$SRC'" >&2; exit 2; }

TARGET="${SRC%-private}"
NAME="${TARGET#hw-}"
SRC_DIR="$PRIVATE_DIR/$SRC"

[[ -d "$SRC_DIR/.git" ]] || { echo "not a git repo: $SRC_DIR" >&2; exit 1; }
git -C "$SRC_DIR" rev-parse --verify -q main >/dev/null || { echo "$SRC has no local 'main' branch" >&2; exit 1; }

SHA="$(git -C "$SRC_DIR" rev-parse --short main)"
echo "Source:  $SRC_DIR (main @ $SHA)"
echo "Target:  $ORG/$TARGET (public template)"
echo

if [[ -n "$(git -C "$SRC_DIR" status --porcelain)" ]]; then
  echo "WARNING: $SRC has uncommitted changes. They are NOT included; only committed 'main' is published."
fi
if git -C "$SRC_DIR" rev-parse --verify -q origin/main >/dev/null \
   && [[ "$(git -C "$SRC_DIR" rev-parse main)" != "$(git -C "$SRC_DIR" rev-parse origin/main)" ]]; then
  echo "WARNING: local main differs from origin/main (unpushed or unpulled commits)."
fi

TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT
mkdir "$TMP/export"
git -C "$SRC_DIR" archive main | tar -x -C "$TMP/export"

# Guard: refuse to publish anything that looks like a solution.
LEAKS="$(cd "$TMP/export" && find . -type f -iname '*solution*' -o -type d -iname '*solution*' | head)"
if [[ -n "$LEAKS" ]]; then
  echo "REFUSING: snapshot contains paths that look like solutions:" >&2
  echo "$LEAKS" >&2
  exit 1
fi

echo "Snapshot contains $(cd "$TMP/export" && find . -type f | wc -l | tr -d ' ') files:"
(cd "$TMP/export" && find . -type f | sed 's|^\./|  |' | sort)
echo

# Does the target exist already?
EXISTS=0
VISIBILITY=""
if command -v gh >/dev/null 2>&1; then
  if INFO="$(gh repo view "$ORG/$TARGET" --json visibility,isTemplate --jq '.visibility + " template=" + (.isTemplate|tostring)' 2>/dev/null)"; then
    EXISTS=1
    VISIBILITY="${INFO%% *}"
    echo "Target exists: $INFO"
  else
    echo "Target does not exist yet; it would be created (public, marked as a template)."
  fi
else
  echo "gh not found; can't check whether $ORG/$TARGET exists."
  [[ $EXECUTE -eq 1 ]] && { echo "gh is required for --execute." >&2; exit 1; }
fi

if [[ $EXISTS -eq 1 && "$VISIBILITY" != "PUBLIC" ]]; then
  echo "REFUSING: $ORG/$TARGET exists but is not public. Fix its visibility by hand first." >&2
  exit 1
fi

if [[ $EXECUTE -ne 1 ]]; then
  echo
  echo "Dry run only. Re-run with --execute to publish."
  exit 0
fi

if [[ $EXISTS -eq 0 ]]; then
  gh repo create "$ORG/$TARGET" --public --description "Homework template: $NAME"
  gh repo edit "$ORG/$TARGET" --template
fi

cd "$TMP/export"
git init -q -b main
git add -A
git commit -q -m "Publish $NAME from $SRC@$SHA"
git remote add origin "git@github.com:$ORG/$TARGET.git"
git push --force origin main

echo
echo "Published https://github.com/$ORG/$TARGET (single commit, no history)."
echo "Reminder: students need 'Use this template' -> Private, then install codezeug-graderbot on THEIR repo."
