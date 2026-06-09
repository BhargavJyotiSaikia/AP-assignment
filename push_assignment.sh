#!/bin/bash

echo "=========================="
echo " Assignment Upload Tool"
echo "=========================="

read -p "Assignment Number: " NUM

BRANCH="assignment${NUM}"

read -p "Code file(s) (space separated): " FILES

echo
echo "Paste Assignment Question."
echo "Press CTRL+D when finished."
QUESTION=$(cat)

git checkout main

git checkout -B "$BRANCH"

cat > README.md << EOF

# Assignment $NUM

## Question

$QUESTION

## Files

EOF

for file in $FILES
do
if [ ! -f "$file" ]; then
echo "ERROR: File not found -> $file"
git checkout main
exit 1
fi

```
echo "- $(basename "$file")" >> README.md
```

done

git add README.md $FILES

git commit -m "Add Assignment $NUM"

git push -u origin "$BRANCH"

git checkout main

echo
echo "Assignment $NUM uploaded successfully."
echo "Returned to main branch."
