#!/bin/bash

# Script to clean up old files for ALL seasons and types
# Usage: ./scripts/cleanup-all.sh
# 
# This script will run cleanup for all combinations of:
# - Seasons: 25-26 (and any future seasons with date-based files)
# - Types: regular, playin, playoff

echo "=========================================="
echo "Cleaning up old files for ALL seasons/types"
echo "=========================================="
echo ""

# Define seasons that use date-based file naming
SEASONS=("25-26")
TYPES=("regular" "playin" "playoff")

for SEASON in "${SEASONS[@]}"; do
  for TYPE in "${TYPES[@]}"; do
    echo "Processing: ${SEASON} ${TYPE}..."
    ./scripts/cleanup-old-files.sh "$SEASON" "$TYPE"
    echo ""
  done
done

echo "=========================================="
echo "All cleanup operations complete!"
echo "=========================================="
