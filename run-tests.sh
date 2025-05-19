#!/bin/bash

# This script runs all tests for the PDF Splitter application

# Print section header
print_header() {
  echo ""
  echo "====================================="
  echo "  $1"
  echo "====================================="
  echo ""
}

# Check for test type argument
TEST_TYPE=${1:-"all"}  # Default to "all" if no argument provided

# Check if we're running in CI
is_ci=false
if [ -n "$CI" ] || [ -n "$GITHUB_ACTIONS" ]; then
  is_ci=true
fi

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Set default component_status
component_status=0

# Run Component Tests if requested
if [[ "$TEST_TYPE" == "all" || "$TEST_TYPE" == "component" ]]; then
  print_header "Running Component Tests"
  if $is_ci; then
    npx cypress run --component
  else
    npx cypress run --component
  fi
  component_status=$?
fi

# Run E2E Tests if requested
if [[ "$TEST_TYPE" == "all" || "$TEST_TYPE" == "e2e" ]]; then
  print_header "Running E2E Tests"
  if $is_ci; then
    npx start-server-and-test dev http://localhost:3000 "cypress run"
  else
    npx start-server-and-test dev http://localhost:3000 "cypress run"
  fi

e2e_status=$?

# Print summary
print_header "Test Summary"

# Only print component status if component tests were run
if [[ "$TEST_TYPE" == "all" || "$TEST_TYPE" == "component" ]]; then
  if [ $component_status -eq 0 ]; then
    echo -e "${GREEN}✓ Component tests passed${NC}"
  else
    echo -e "${RED}✗ Component tests failed${NC}"
  fi
fi
fi

if [[ "$TEST_TYPE" == "all" || "$TEST_TYPE" == "e2e" ]]; then
  if [ $e2e_status -eq 0 ]; then
    echo -e "${GREEN}✓ E2E tests passed${NC}"
  else
    echo -e "${RED}✗ E2E tests failed${NC}"
  fi
fi

# Return overall status based on which tests were run
if [[ "$TEST_TYPE" == "all" ]]; then
  # Both tests need to pass
  if [ $component_status -eq 0 ] && [ $e2e_status -eq 0 ]; then
    exit 0
  else
    exit 1
  fi
elif [[ "$TEST_TYPE" == "component" ]]; then
  # Only component tests need to pass
  exit $component_status
elif [[ "$TEST_TYPE" == "e2e" ]]; then
  # Only E2E tests need to pass
  exit $e2e_status
else
  # Unknown test type
  echo -e "${RED}Unknown test type: $TEST_TYPE${NC}"
  exit 1
fi
