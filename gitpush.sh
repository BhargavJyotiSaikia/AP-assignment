#!/bin/bash

# ─────────────────────────────────────────────
#  Assignment Branch Setup Script
# ─────────────────────────────────────────────

set -e

# ── 1. Ask for assignment number ──────────────
read -p "Enter assignment number: " num

if [[ -z "$num" || ! "$num" =~ ^[0-9]+$ ]]; then
  echo "Error: Please enter a valid number."
  exit 1
fi

BRANCH="assignment$num"

# ── 2. Ensure we're on main ───────────────────
CURRENT=$(git branch --show-current)
if [[ "$CURRENT" != "main" ]]; then
  echo "Warning: You are on '$CURRENT', not 'main'. Switching to main first..."
  git checkout main
fi

git pull origin main --quiet

# ── 3. Create and checkout the branch ─────────
if git show-ref --verify --quiet "refs/heads/$BRANCH"; then
  echo "Branch '$BRANCH' already exists. Checking it out..."
  git checkout "$BRANCH"
else
  echo "Creating and switching to branch '$BRANCH'..."
  git checkout -b "$BRANCH"
fi

# ── 4. .gitignore ──────────────────────────────
if [[ ! -f ".gitignore" ]]; then
  cat > .gitignore <<IGNORE
*.swp
*.swo
assignment_setup.sh
IGNORE
  echo ".gitignore created."
else
  # Append only if entries are missing
  grep -qxF "*.swp"             .gitignore || echo "*.swp"             >> .gitignore
  grep -qxF "*.swo"             .gitignore || echo "*.swo"             >> .gitignore
  grep -qxF "assignment_setup.sh" .gitignore || echo "assignment_setup.sh" >> .gitignore
  echo ".gitignore updated."
fi

# ── 5. README.md ───────────────────────────────
echo ""
echo "─── README.md ───────────────────────────────"
read -p "Assignment title: " title

echo "Enter README content (press ENTER twice to finish):"
readme_content=""
while IFS= read -r line; do
  [[ -z "$line" ]] && break
  readme_content+="$line"$'\n'
done

cat > README.md <<RDME
# $title

$readme_content
RDME

echo "README.md created."

# ── 6. Code input ──────────────────────────────
echo ""
echo "─── Source Code ─────────────────────────────"
read -p "Code file extension (e.g. java, c, py, cpp): " ext

if [[ -z "$ext" ]]; then
  echo "Error: Extension cannot be empty."
  exit 1
fi

CODE_FILE="${BRANCH}.${ext}"

echo "Paste your code below. Type END on a new line when done:"
code_content=""
while IFS= read -r line; do
  [[ "$line" == "END" ]] && break
  code_content+="$line"$'\n'
done

printf "%s" "$code_content" > "$CODE_FILE"
echo "$CODE_FILE created."

# ── 7. Git operations ──────────────────────────
echo ""
echo "─── Git Operations ──────────────────────────"

echo "[branch list]"
git branch

echo ""
echo "[adding files...]"
git add .gitignore README.md "$CODE_FILE"

echo ""
echo "[status]"
git status

echo ""
read -p "Commit message (leave blank for default): " commit_msg
if [[ -z "$commit_msg" ]]; then
  commit_msg="Add $BRANCH: $CODE_FILE and README"
fi

git commit -m "$commit_msg"

echo ""
echo "[pushing to origin/$BRANCH ...]"
git push -u origin "$BRANCH"

echo ""
echo "✓ Done! Branch '$BRANCH' is live with:"
echo "  • README.md"
echo "  • $CODE_FILE"
echo "  • .gitignore (*.swp and assignment_setup.sh excluded)"
