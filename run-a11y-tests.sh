#!/bin/bash

# This script runs accessibility tests in multiple browsers
# Usage: ./run-a11y-tests.sh

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

# Define browsers to test
browsers=("chrome" "firefox" "edge")
overall_status=0

print_header "Running Accessibility Tests in Multiple Browsers"

# Start the Next.js server
echo "Starting Next.js development server..."
npx next dev &
server_pid=$!

# Wait for server to be ready
echo "Waiting for server to be ready..."
sleep 5

for browser in "${browsers[@]}"; do
  print_header "Running in ${browser}"
  echo -e "Testing accessibility in ${GREEN}$browser${NC}..."
  
  # Run accessibility tests with the current browser
  npx cypress run --browser $browser --spec cypress/e2e/accessibility.cy.ts
  browser_status=$?
  
  if [ $browser_status -eq 0 ]; then
    echo -e "${GREEN}✓ Accessibility tests passed on $browser${NC}"
  else
    echo -e "${RED}✗ Accessibility tests failed on $browser${NC}"
    overall_status=1
  fi
done

# Kill the Next.js server
kill $server_pid

# Print summary
print_header "Test Summary"

if [ $overall_status -eq 0 ]; then
  echo -e "${GREEN}✓ All accessibility tests passed in all browsers${NC}"
else
  echo -e "${RED}✗ Some accessibility tests failed${NC}"
fi

exit $overall_status
