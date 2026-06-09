#!/bin/bash

echo "==================================="
echo "      Assignment Upload Tool"
echo "==================================="

# Ensure we start from main

git checkout main > /dev/null 2>&1

# Assignment number

read -p "Enter Assignment Number: " NUM

BRANCH="assignment${NUM}"

echo
echo "Creating/Switching to branch: $BRANCH"

git checkout -B "$BRANCH"

# README

echo
echo "Opening README.md..."
echo "Write the assignment question and details."
sleep 1

nano README.md

# Code files

echo
read -p "How many code files do you want to add? " N

FILES=""

for ((i=1; i<=N; i++))
do
echo
read -p "Enter filename $i (example: assignment1.c): " FILE

```
if [ ! -f "$FILE" ]; then
    touch "$FILE"
fi

nano "$FILE"

FILES="$FILES $FILE"
```

done

echo
echo "Adding files..."

git add README.md $FILES

echo
read -p "Commit message (leave empty for default): " MSG

if [ -z "$MSG" ]; then
MSG="Add Assignment $NUM"
fi

git commit -m "$MSG"

echo
echo "Pushing to GitHub..."

git push -u origin "$BRANCH"

echo
echo "Returning to main..."

git checkout main

echo
echo "Assignment $NUM uploaded successfully!"
