#!/bin/bash

# This script runs offline functionality tests for the PDF Splitter application

echo ""
echo "====================================="
echo "  Running Offline Functionality Tests"
echo "====================================="
echo ""

# Check for browser argument
BROWSER=${1:-"chrome"}  # Default to "chrome" if no browser specified

# Check for target environment
TARGET=${2:-"localhost"}  # Default to "localhost" if no target specified

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if we're running in CI
is_ci=false
if [ -n "$CI" ] || [ -n "$GITHUB_ACTIONS" ]; then
  is_ci=true
fi

# Run offline functionality tests with the specified browser
if [[ "$TARGET" == "production" ]]; then
  # Run against production without starting the server
  echo -e "Running offline functionality tests against ${GREEN}production${NC}"
  npx cypress run --config baseUrl=https://pdf-splitter-eta.vercel.app/ --browser $BROWSER --spec cypress/e2e/offline-functionality.cy.ts
else
  # Run against localhost
  if $is_ci; then
    npx start-server-and-test dev http://localhost:3000 "cypress run --browser $BROWSER --spec cypress/e2e/offline-functionality.cy.ts"
  else
    npx start-server-and-test dev http://localhost:3000 "cypress run --browser $BROWSER --spec cypress/e2e/offline-functionality.cy.ts"
  fi
fi

test_status=$?

if [ $test_status -eq 0 ]; then
  echo -e "${GREEN}✓ Offline functionality tests passed${NC}"
  exit 0
else
  echo -e "${RED}✗ Offline functionality tests failed${NC}"
  exit 1
fi
