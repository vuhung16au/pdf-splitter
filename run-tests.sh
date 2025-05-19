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

# Check for browser argument
BROWSER=${2:-"chrome"}  # Default to "chrome" if no browser specified

# Check for target environment
TARGET=${3:-"localhost"}  # Default to "localhost" if no target specified

# Check for browser compatibility test flag
RUN_BROWSER_COMPAT=${4:-"false"}  # Default to not running browser compatibility tests

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
  
  # Check if we should run browser compatibility tests
  if [[ "$RUN_BROWSER_COMPAT" == "true" ]]; then
    print_header "Running Browser Compatibility Tests"
    
    # Define browsers to test
    browsers=("chrome" "firefox" "edge")
    compat_status=0
    
    for browser in "${browsers[@]}"; do
      echo -e "Testing in ${GREEN}$browser${NC}..."
      
      if [[ "$TARGET" == "production" ]]; then
        # Run against production without starting the server
        echo -e "Running browser compatibility tests against ${GREEN}production${NC}"
        npx cypress run --config baseUrl=https://pdf-splitter-eta.vercel.app/ --browser $browser --spec cypress/e2e/browser-compatibility.cy.ts
      else
        # Run against localhost
        if $is_ci; then
          npx start-server-and-test dev http://localhost:3000 "cypress run --browser $browser --spec cypress/e2e/browser-compatibility.cy.ts"
        else
          npx start-server-and-test dev http://localhost:3000 "cypress run --browser $browser --spec cypress/e2e/browser-compatibility.cy.ts"
        fi
      fi
      
      browser_status=$?
      
      if [ $browser_status -eq 0 ]; then
        echo -e "${GREEN}✓ Browser compatibility tests passed on $browser${NC}"
      else
        echo -e "${RED}✗ Browser compatibility tests failed on $browser${NC}"
        compat_status=1
      fi
    done
    
    # Run regular E2E tests with the specified browser
    echo -e "Running regular E2E tests in ${GREEN}$BROWSER${NC}..."
  fi
  
  # Run standard E2E tests with the specified browser
  if [[ "$TARGET" == "production" ]]; then
    # Run against production without starting the server
    echo -e "Running E2E tests against ${GREEN}production${NC}"
    npx cypress run --config baseUrl=https://pdf-splitter-eta.vercel.app/ --browser $BROWSER
  else
    # Run against localhost
    if $is_ci; then
      npx start-server-and-test dev http://localhost:3000 "cypress run --browser $BROWSER"
    else
      npx start-server-and-test dev http://localhost:3000 "cypress run --browser $BROWSER"
    fi
  fi

  e2e_status=$?
  
  # If browser compatibility tests were run, factor that into the status
  if [[ "$RUN_BROWSER_COMPAT" == "true" ]] && [ $compat_status -ne 0 ]; then
    e2e_status=1
  fi
fi

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

if [[ "$TEST_TYPE" == "all" || "$TEST_TYPE" == "e2e" ]]; then
  if [ $e2e_status -eq 0 ]; then
    echo -e "${GREEN}✓ E2E tests passed${NC}"
    echo -e "${GREEN}✓ Browser: $BROWSER${NC}"
  else
    echo -e "${RED}✗ E2E tests failed${NC}"
    echo -e "${RED}✗ Browser: $BROWSER${NC}"
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
