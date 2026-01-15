#!/bin/bash

# Script to clean up old date-based CSV files, keeping only the latest ones
# Usage: ./scripts/cleanup-old-files.sh [season] [type]
# Example: ./scripts/cleanup-old-files.sh 25-26 regular

SEASON=${1:-"25-26"}
TYPE=${2:-"regular"}

BASE_DIR="public/data/${SEASON}/${TYPE}"

echo "Cleaning up old files for season ${SEASON}, type ${TYPE}..."

# Clean up player files
if [ -d "${BASE_DIR}/player" ]; then
  echo "Cleaning player files..."
  cd "${BASE_DIR}/player"
  
  # Find all files matching the pattern and sort by date (newest first)
  LATEST_PLAYER=$(ls -t ${SEASON}_*_${TYPE}_players_rapm.csv 2>/dev/null | head -1)
  
  if [ -n "$LATEST_PLAYER" ]; then
    echo "Keeping latest player file: $LATEST_PLAYER"
    # Delete all other files
    ls ${SEASON}_*_${TYPE}_players_rapm.csv 2>/dev/null | grep -v "$LATEST_PLAYER" | xargs rm -f
    echo "Deleted old player files"
  fi
fi

# Clean up lineup files
if [ -d "${BASE_DIR}/lineup" ]; then
  echo "Cleaning lineup files..."
  cd "${BASE_DIR}/lineup"
  
  # For each lineup size (2, 3, 4, 5)
  for SIZE in 2 3 4 5; do
    LATEST_LINEUP=$(ls -t ${SEASON}_*_${TYPE}_lineups_${SIZE}.csv 2>/dev/null | head -1)
    
    if [ -n "$LATEST_LINEUP" ]; then
      echo "Keeping latest lineup file (size ${SIZE}): $LATEST_LINEUP"
      # Delete all other files for this size
      ls ${SEASON}_*_${TYPE}_lineups_${SIZE}.csv 2>/dev/null | grep -v "$LATEST_LINEUP" | xargs rm -f
    fi
  done
  echo "Deleted old lineup files"
fi

echo "Cleanup complete!"
