#!/opt/homebrew/bin/bash
set -e

#=============================================================================
# Configuration
#=============================================================================
ORG_NAME="codezeug"
ARCHIVE_ORG="codezeug-archive"

#=============================================================================
# Argument Parsing
#=============================================================================
AUTO_YES=false
for arg in "$@"; do
    case "$arg" in
        -y) AUTO_YES=true ;;
        *) echo "Unknown argument: $arg"; exit 1 ;;
    esac
done

#=============================================================================
# Interactive Prompts
#=============================================================================
echo "GitHub Classroom Repository Archiver"
echo "====================================="
echo ""

if [[ "$ORG_NAME" == "YOUR-CLASSROOM-ORG" ]]; then
    echo "ERROR: Please edit this script and set ORG_NAME to your GitHub org."
    exit 1
fi

# Dry run?
read -p "Is this a dry run? (y/n): " dry_run_input
case "$dry_run_input" in
    [Yy]*) DRY_RUN=true ;;
    [Nn]*) DRY_RUN=false ;;
    *) echo "Invalid input. Exiting."; exit 1 ;;
esac

# If this is a dry run, tell the user.
if [[ "$DRY_RUN" == true ]]; then
    echo ""
    echo "=== DRY RUN MODE: No changes will be made. ==="
    echo ""
fi

# Give the user a chance to confirm the org names before proceeding
echo "Organization to archive from: $ORG_NAME"
echo "Organization to archive to: $ARCHIVE_ORG"
read -p "Continue? (y/n): " confirm_orgs
case "$confirm_orgs" in
    [Yy]*) ;;
    *) echo "Aborted."; exit 0 ;;
esac

# Cutoff months
read -p "Archive student repos older than how many months? " months_ago
if ! [[ "$months_ago" =~ ^[0-9]+$ ]]; then
    echo "Please enter a valid number. Exiting."
    exit 1
fi

# Calculate cutoff date
if [[ "$(uname)" == "Darwin" ]]; then
    cutoff_date=$(date -v-"${months_ago}"m +%Y-%m-%dT00:00:00Z)
else
    cutoff_date=$(date -d "${months_ago} months ago" +%Y-%m-%dT00:00:00Z)
fi

echo ""
echo "Cutoff date: $cutoff_date"
echo "Fetching repositories from $ORG_NAME..."
echo ""

#=============================================================================
# Fetch all hw-* repos as JSON array
#=============================================================================
all_repos_json=$(gh repo list "$ORG_NAME" --limit 2000 --json name,createdAt,isArchived)

# Filter to hw-* prefix and non-archived repos
hw_repos_json=$(echo "$all_repos_json" | jq '[.[] | select(.name | startswith("hw-")) | select(.isArchived == false)]')

# Extract just the names for lookup
repo_names=$(echo "$hw_repos_json" | jq -r '.[].name' | sort)

if [[ -z "$repo_names" ]]; then
    echo "No hw-* repositories found in $ORG_NAME."
    exit 0
fi

#=============================================================================
# Identify base repos vs student repos
#=============================================================================
# Hardcoded list of assignment base names (the part after hw- or hw-##-)
# Student repos match: hw-{base}-{username} or hw-{number}-{base}-{username}

declare -a BASE_NAMES=(
    "aabb"
    "bst"
    "bubbles"
    "collide"
    "fsm"
    "graph"
    "graphs"
    "hash"
    "hashes"
    "huffman"
    "linked-lists"
    "template"
    "using-git"
)

# Build lookup set for base names
declare -A is_base_name
for base in "${BASE_NAMES[@]}"; do
    is_base_name["$base"]=1
done

# Categorize each repo
declare -a base_repos
declare -a student_repos

while IFS= read -r name; do
    [[ -z "$name" ]] && continue

    is_student=false

    # Check new format: hw-{base}-{username}
    # If name matches hw-{BASE_NAME}-something, it's a student repo
    for base in "${BASE_NAMES[@]}"; do
        if [[ "$name" == "hw-$base-"* && "$name" != "hw-$base" ]]; then
            student_repos+=("$name")
            is_student=true
            break
        fi
    done

    # Check old format: hw-{number}-{base}-{username}
    if [[ "$is_student" == false && "$name" =~ ^hw-[0-9]+-([^-]+(-[^-]+)*)-. ]]; then
        # Extract potential base name (everything between hw-##- and the last -segment)
        rest="${name#hw-[0-9]*-}"  # remove hw-##- prefix
        for base in "${BASE_NAMES[@]}"; do
            if [[ "$rest" == "$base-"* ]]; then
                student_repos+=("$name")
                is_student=true
                break
            fi
        done
    fi

    if [[ "$is_student" == false ]]; then
        base_repos+=("$name")
    fi
done <<< "$repo_names"

echo "Found ${#base_repos[@]} base assignment repo(s) (will NOT be archived):"
for repo in "${base_repos[@]}"; do
    echo "  - $repo"
done

echo ""
echo "Found ${#student_repos[@]} student repo(s) total."

#=============================================================================
# Filter student repos by date
#=============================================================================
declare -a repos_to_archive

for student_repo in "${student_repos[@]}"; do
    created_at=$(echo "$hw_repos_json" | jq -r --arg name "$student_repo" '.[] | select(.name == $name) | .createdAt')

    if [[ "$created_at" < "$cutoff_date" ]]; then
        repos_to_archive+=("$student_repo")
    fi
done

# Remove instructor repos
declare -a filtered_repos
for repo in "${repos_to_archive[@]}"; do
    if [[ "$repo" != *"johnsogg"* ]]; then
        filtered_repos+=("$repo")
    fi
done
repos_to_archive=("${filtered_repos[@]}")

echo "Found ${#repos_to_archive[@]} student repo(s) older than $months_ago month(s) (excluding instructor repos)."
echo ""

#=============================================================================
# Summary and Action
#=============================================================================
if [[ ${#repos_to_archive[@]} -eq 0 ]]; then
    echo "No repos to move. Done."
    exit 0
fi

if [[ "$DRY_RUN" == true ]]; then
    echo "=== DRY RUN: Would move ${#repos_to_archive[@]} repo(s) to $ARCHIVE_ORG ==="
    echo ""
    for repo in "${repos_to_archive[@]}"; do
        echo "  $repo"
    done
    echo ""
    echo "To actually move these, run again and answer 'n' to dry run."
else
    echo "The following ${#repos_to_archive[@]} repo(s) will be moved to $ARCHIVE_ORG:"
    echo ""
    for repo in "${repos_to_archive[@]}"; do
        echo "  $repo"
    done
    echo ""
    read -n 1 -s -r -p "Press any key to begin archiving, or Ctrl-C to abort..."
    echo ""
    echo ""
    echo "=== Moving ${#repos_to_archive[@]} repo(s) to $ARCHIVE_ORG ==="
    echo ""

    # Create temp directory for cloning
    TEMP_DIR=$(mktemp -d)
    trap "rm -rf $TEMP_DIR" EXIT

    moved=0
    failed=0

    for i in "${!repos_to_archive[@]}"; do
        repo="${repos_to_archive[$i]}"
        echo "Moving: $repo"

        # Clone bare
        if ! git clone --bare --quiet "https://github.com/$ORG_NAME/$repo.git" "$TEMP_DIR/$repo.git" 2>/dev/null; then
            echo "  ERROR: Failed to clone $repo"
            ((++failed))
        else
            # Create new repo in archive org
            if ! gh repo create "$ARCHIVE_ORG/$repo" --private 2>/dev/null; then
                echo "  ERROR: Failed to create $ARCHIVE_ORG/$repo"
                rm -rf "$TEMP_DIR/$repo.git"
                ((++failed))
            else
                # Push mirror
                if ! git -C "$TEMP_DIR/$repo.git" push --mirror "https://github.com/$ARCHIVE_ORG/$repo.git" 2>/dev/null; then
                    echo "  ERROR: Failed to push to $ARCHIVE_ORG/$repo"
                    rm -rf "$TEMP_DIR/$repo.git"
                    ((++failed))
                else
                    # Clean up local clone
                    rm -rf "$TEMP_DIR/$repo.git"

                    # Delete original
                    if ! gh repo delete "$ORG_NAME/$repo" --yes 2>/dev/null; then
                        echo "  WARNING: Moved but failed to delete original"
                    fi

                    ((++moved))
                fi
            fi
        fi

        # Prompt to continue unless this is the last repo or -y was passed
        if [[ "$AUTO_YES" == false && $i -lt $((${#repos_to_archive[@]} - 1)) ]]; then
            echo ""
            read -p "Continue to next repo? (y/n): " cont
            case "$cont" in
                [Yy]*) echo "" ;;
                *) echo "Stopped. Moved $moved repo(s), $failed failed."; exit 0 ;;
            esac
        fi
    done

    echo ""
    echo "Done. Moved $moved repo(s), $failed failed."
fi
