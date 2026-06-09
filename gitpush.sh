#!/bin/bash

set -e

# Ensure reads come from terminal

exec < /dev/tty

echo "===================================="
echo " Assignment Git Automation Script"
echo "===================================="

# ----------------------------

# Assignment Number

# ----------------------------

read -p "Enter assignment number: " num

if [[ ! "$num" =~ ^[0-9]+$ ]]; then
echo "Invalid assignment number."
exit 1
fi

BRANCH="assignment$num"

# ----------------------------

# Switch to main

# ----------------------------

CURRENT=$(git branch --show-current)

if [[ "$CURRENT" != "main" ]]; then
echo "Switching to main..."
git checkout main
fi

echo "Fetching latest changes..."
git fetch origin

# ----------------------------

# Create / Checkout Branch

# ----------------------------

if git show-ref --verify --quiet "refs/heads/$BRANCH"; then
echo "Branch exists locally."
git checkout "$BRANCH"

elif git ls-remote --exit-code --heads origin "$BRANCH" >/dev/null 2>&1; then
echo "Branch exists remotely."
git checkout -b "$BRANCH" "origin/$BRANCH"

else
echo "Creating branch $BRANCH..."
git checkout -b "$BRANCH"
fi

# ----------------------------

# README.md

# ----------------------------

echo
echo "Enter README content."
echo "Type END on a new line when finished."
echo

README_CONTENT=""

while IFS= read -r line
do
[[ "$line" == "END" ]] && break
README_CONTENT+="$line"$'\n'
done

cat > README.md <<EOF

# Assignment $num

$README_CONTENT
EOF

echo "README.md created."

# ----------------------------

# Source File

# ----------------------------

echo
read -p "Enter code filename (example: assignment$num.c or assignment$num.java): " CODE_FILE

if [[ -z "$CODE_FILE" ]]; then
echo "Filename cannot be empty."
exit 1
fi

echo
echo "Paste your source code."
echo "Type END on a new line when finished."
echo

CODE_CONTENT=""

while IFS= read -r line
do
[[ "$line" == "END" ]] && break
CODE_CONTENT+="$line"$'\n'
done

printf "%s" "$CODE_CONTENT" > "$CODE_FILE"

echo "$CODE_FILE created."

# ----------------------------

# Git Operations

# ----------------------------

echo
echo "Current Branch:"
git branch

echo "gitpush.sh" >> .gitignore

echo
echo "Adding files..."
git add README.md "$CODE_FILE"

echo
echo "Git Status:"
git status

if git diff --cached --quiet; then
echo "No changes to commit."
exit 0
fi

echo
read -p "Commit message (leave blank for default): " COMMIT_MSG

if [[ -z "$COMMIT_MSG" ]]; then
COMMIT_MSG="Add Assignment $num"
fi

git commit -m "$COMMIT_MSG"

echo
echo "Pushing to GitHub..."

git push -u origin "$BRANCH"

echo
echo "===================================="
echo " Assignment $num pushed successfully"
echo " Branch : $BRANCH"
echo " File   : $CODE_FILE"
echo "===================================="
