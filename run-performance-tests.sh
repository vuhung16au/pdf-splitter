#!/bin/bash

# This script runs performance tests for the PDF Splitter application

# Print section header
print_header() {
  echo ""
  echo "====================================="
  echo "  $1"
  echo "====================================="
  echo ""
}

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check for browser argument
BROWSER=${1:-"chrome"}  # Default to "chrome" if no browser specified

# Check for target environment
TARGET=${2:-"localhost"}  # Default to "localhost" if no target specified

# Check if we're running in CI
is_ci=false
if [ -n "$CI" ] || [ -n "$GITHUB_ACTIONS" ]; then
  is_ci=true
fi

# Print header
print_header "Running PDF Splitter Performance Tests"
echo -e "Browser: ${GREEN}$BROWSER${NC}"
echo -e "Target: ${GREEN}$TARGET${NC}"

# Run Performance Tests
if [[ "$TARGET" == "production" ]]; then
  # Run against production without starting the server
  echo -e "Running performance tests against ${GREEN}production${NC}"
  npx cypress run --config baseUrl=https://pdf-splitter-eta.vercel.app/ --browser $BROWSER --spec cypress/e2e/performance.cy.ts
else
  # Run against localhost
  if $is_ci; then
    npx start-server-and-test dev http://localhost:3000 "cypress run --browser $BROWSER --spec cypress/e2e/performance.cy.ts"
  else
    npx start-server-and-test dev http://localhost:3000 "cypress run --browser $BROWSER --spec cypress/e2e/performance.cy.ts"
  fi
fi

performance_status=$?

# Print summary
print_header "Performance Test Summary"
if [ $performance_status -eq 0 ]; then
  echo -e "${GREEN}✓ Performance tests passed${NC}"
else
  echo -e "${RED}✗ Performance tests failed${NC}"
fi

# Set executable permissions for this file
chmod +x "$(dirname "$0")/run-performance-tests.sh"

exit $performance_status
