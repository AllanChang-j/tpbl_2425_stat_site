#!/bin/bash

# Script to clean up old date-based CSV files, keeping only the latest ones
# Usage: ./scripts/cleanup-old-files.sh [season] [type]
# Example: ./scripts/cleanup-old-files.sh 25-26 regular
# 
# IMPORTANT: This script ONLY cleans files for the specified season and type.
# It will NOT affect files from other seasons or competition types.

SEASON=${1:-"25-26"}
TYPE=${2:-"regular"}

BASE_DIR="public/data/${SEASON}/${TYPE}"

# Validate that the directory exists
if [ ! -d "$BASE_DIR" ]; then
  echo "Error: Directory $BASE_DIR does not exist!"
  echo "Please check the season and type parameters."
  exit 1
fi

echo "=========================================="
echo "Cleaning up old files for:"
echo "  Season: ${SEASON}"
echo "  Type: ${TYPE}"
echo "  Directory: ${BASE_DIR}"
echo "=========================================="
echo ""

# Clean up player files
if [ -d "${BASE_DIR}/player" ]; then
  echo "Processing player files in: ${BASE_DIR}/player"
  cd "${BASE_DIR}/player" || exit 1
  
  # Find all files matching the pattern (only for this season and type)
  FILES=$(ls ${SEASON}_*_${TYPE}_players_rapm.csv 2>/dev/null)
  
  if [ -z "$FILES" ]; then
    echo "  No player files found matching pattern: ${SEASON}_*_${TYPE}_players_rapm.csv"
  else
    FILE_COUNT=$(echo "$FILES" | wc -l | tr -d ' ')
    echo "  Found ${FILE_COUNT} file(s) matching pattern"
    
    # Find the latest file (by modification time)
    LATEST_PLAYER=$(ls -t ${SEASON}_*_${TYPE}_players_rapm.csv 2>/dev/null | head -1)
    
    if [ -n "$LATEST_PLAYER" ]; then
      echo "  ✓ Keeping latest file: $LATEST_PLAYER"
      
      # List files to be deleted
      OLD_FILES=$(ls ${SEASON}_*_${TYPE}_players_rapm.csv 2>/dev/null | grep -v "$LATEST_PLAYER")
      if [ -n "$OLD_FILES" ]; then
        echo "  × Files to be deleted:"
        echo "$OLD_FILES" | sed 's/^/    - /'
        # Delete all other files
        echo "$OLD_FILES" | xargs rm -f
        echo "  ✓ Deleted old player files"
      else
        echo "  ✓ No old files to delete"
      fi
    fi
  fi
  echo ""
fi

# Clean up lineup files
if [ -d "${BASE_DIR}/lineup" ]; then
  echo "Processing lineup files in: ${BASE_DIR}/lineup"
  cd "${BASE_DIR}/lineup" || exit 1
  
  # For each lineup size (2, 3, 4, 5)
  for SIZE in 2 3 4 5; do
    PATTERN="${SEASON}_*_${TYPE}_lineups_${SIZE}.csv"
    FILES=$(ls $PATTERN 2>/dev/null)
    
    if [ -z "$FILES" ]; then
      echo "  Size ${SIZE}: No files found"
      continue
    fi
    
    FILE_COUNT=$(echo "$FILES" | wc -l | tr -d ' ')
    echo "  Size ${SIZE}: Found ${FILE_COUNT} file(s)"
    
    # Find the latest file
    LATEST_LINEUP=$(ls -t $PATTERN 2>/dev/null | head -1)
    
    if [ -n "$LATEST_LINEUP" ]; then
      echo "    ✓ Keeping latest: $LATEST_LINEUP"
      
      # List files to be deleted
      OLD_FILES=$(ls $PATTERN 2>/dev/null | grep -v "$LATEST_LINEUP")
      if [ -n "$OLD_FILES" ]; then
        echo "    × Files to be deleted:"
        echo "$OLD_FILES" | sed 's/^/      - /'
        # Delete all other files for this size
        echo "$OLD_FILES" | xargs rm -f
      else
        echo "    ✓ No old files to delete"
      fi
    fi
  done
  echo ""
fi

echo "=========================================="
echo "Cleanup complete for ${SEASON} ${TYPE}!"
echo "=========================================="
echo ""
echo "Note: Only files for ${SEASON} ${TYPE} were affected."
echo "      Files from other seasons/types remain untouched."
