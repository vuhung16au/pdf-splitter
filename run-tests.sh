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

# Check for performance test flag
RUN_PERFORMANCE=${5:-"false"}  # Default to not running performance tests separately

# Check for accessibility test flag
RUN_A11Y=${6:-"false"}  # Default to not running accessibility tests separately

# Check for offline functionality test flag
RUN_OFFLINE=${7:-"false"}  # Default to not running offline functionality tests separately

# Check for security test flag
RUN_SECURITY=${8:-"false"}  # Default to not running security tests separately

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
  
  # Run performance tests if requested or if running all tests
  if [[ "$RUN_PERFORMANCE" == "true" || "$TEST_TYPE" == "all" ]]; then
    print_header "Running Performance Tests"
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
    
    # Include performance status in e2e status
    if [ $performance_status -ne 0 ]; then
      e2e_status=1
    fi
  fi

  e2e_status=$?
  
  # If browser compatibility tests were run, factor that into the status
  if [[ "$RUN_BROWSER_COMPAT" == "true" ]] && [ $compat_status -ne 0 ]; then
    e2e_status=1
  fi
fi

# Run Offline Functionality Tests if requested
if [[ "$TEST_TYPE" == "all" || "$TEST_TYPE" == "offline" || "$RUN_OFFLINE" == "true" ]]; then
  print_header "Running Offline Functionality Tests"
  
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
  
  offline_status=$?
  
  if [ $offline_status -eq 0 ]; then
    echo -e "${GREEN}✓ Offline functionality tests passed${NC}"
  else
    echo -e "${RED}✗ Offline functionality tests failed${NC}"
  fi
fi

# Run Accessibility Tests if requested
if [[ "$TEST_TYPE" == "all" || "$TEST_TYPE" == "a11y" || "$RUN_A11Y" == "true" ]]; then
  print_header "Running Accessibility Tests in Multiple Browsers"
  
  # Define browsers to test
  a11y_browsers=("chrome" "firefox" "edge")
  a11y_status=0
  
  for browser in "${a11y_browsers[@]}"; do
    echo -e "Testing accessibility in ${GREEN}$browser${NC}..."
    
    if [[ "$TARGET" == "production" ]]; then
      # Run against production without starting the server
      echo -e "Running accessibility tests against ${GREEN}production${NC}"
      npx cypress run --config baseUrl=https://pdf-splitter-eta.vercel.app/ --browser $browser --spec cypress/e2e/accessibility.cy.ts
    else
      # Run against localhost
      if $is_ci; then
        npx start-server-and-test dev http://localhost:3000 "cypress run --browser $browser --spec cypress/e2e/accessibility.cy.ts"
      else
        npx start-server-and-test dev http://localhost:3000 "cypress run --browser $browser --spec cypress/e2e/accessibility.cy.ts"
      fi
    fi
    
    browser_a11y_status=$?
    
    if [ $browser_a11y_status -eq 0 ]; then
      echo -e "${GREEN}✓ Accessibility tests passed on $browser${NC}"
    else
      echo -e "${RED}✗ Accessibility tests failed on $browser${NC}"
      a11y_status=1
    fi
  done
fi

# Run Security Tests if requested
if [[ "$TEST_TYPE" == "all" || "$TEST_TYPE" == "security" || "$RUN_SECURITY" == "true" ]]; then
  print_header "Running Security Tests"
  
  security_status=0
  
  # Run dependency vulnerability scan
  echo "Running dependency vulnerability scan..."
  npm audit --audit-level=high
  if [ $? -ne 0 ]; then
    echo -e "${RED}✗ High severity vulnerabilities found in dependencies${NC}"
    security_status=1
  else
    echo -e "${GREEN}✓ No high severity vulnerabilities found in dependencies${NC}"
  fi
  
  # Run CSP verification tests
  echo "Running Content Security Policy tests..."
  if [[ "$TARGET" == "production" ]]; then
    # Run against production without starting the server
    echo -e "Running CSP tests against ${GREEN}production${NC}"
    npx cypress run --config baseUrl=https://pdf-splitter-eta.vercel.app/ --browser $BROWSER --spec cypress/e2e/security/csp.cy.ts
  else
    # Run against localhost
    if $is_ci; then
      npx start-server-and-test dev http://localhost:3000 "cypress run --browser $BROWSER --spec cypress/e2e/security/csp.cy.ts"
    else
      npx start-server-and-test dev http://localhost:3000 "cypress run --browser $BROWSER --spec cypress/e2e/security/csp.cy.ts"
    fi
  fi
  
  csp_status=$?
  if [ $csp_status -ne 0 ]; then
    echo -e "${RED}✗ CSP tests failed${NC}"
    security_status=1
  else
    echo -e "${GREEN}✓ CSP tests passed${NC}"
  fi
  
  # Run XSS protection tests
  echo "Running XSS protection tests..."
  if [[ "$TARGET" == "production" ]]; then
    # Run against production without starting the server
    echo -e "Running XSS tests against ${GREEN}production${NC}"
    npx cypress run --config baseUrl=https://pdf-splitter-eta.vercel.app/ --browser $BROWSER --spec cypress/e2e/security/xss.cy.ts
  else
    # Run against localhost
    if $is_ci; then
      npx start-server-and-test dev http://localhost:3000 "cypress run --browser $BROWSER --spec cypress/e2e/security/xss.cy.ts"
    else
      npx start-server-and-test dev http://localhost:3000 "cypress run --browser $BROWSER --spec cypress/e2e/security/xss.cy.ts"
    fi
  fi
  
  xss_status=$?
  if [ $xss_status -ne 0 ]; then
    echo -e "${RED}✗ XSS protection tests failed${NC}"
    security_status=1
  else
    echo -e "${GREEN}✓ XSS protection tests passed${NC}"
  fi
  
  # Run file upload security tests
  echo "Running file upload security tests..."
  if [[ "$TARGET" == "production" ]]; then
    # Run against production without starting the server
    echo -e "Running file security tests against ${GREEN}production${NC}"
    npx cypress run --config baseUrl=https://pdf-splitter-eta.vercel.app/ --browser $BROWSER --spec cypress/e2e/security/file-upload.cy.ts
  else
    # Run against localhost
    if $is_ci; then
      npx start-server-and-test dev http://localhost:3000 "cypress run --browser $BROWSER --spec cypress/e2e/security/file-upload.cy.ts"
    else
      npx start-server-and-test dev http://localhost:3000 "cypress run --browser $BROWSER --spec cypress/e2e/security/file-upload.cy.ts"
    fi
  fi
  
  file_security_status=$?
  if [ $file_security_status -ne 0 ]; then
    echo -e "${RED}✗ File upload security tests failed${NC}"
    security_status=1
  else
    echo -e "${GREEN}✓ File upload security tests passed${NC}"
  fi
  
  if [ $security_status -eq 0 ]; then
    echo -e "${GREEN}✓ All security tests passed${NC}"
  else
    echo -e "${RED}✗ Some security tests failed${NC}"
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
  
  # Report performance test status if they were run
  if [[ "$RUN_PERFORMANCE" == "true" || "$TEST_TYPE" == "all" ]]; then
    if [ ${performance_status:-0} -eq 0 ]; then
      echo -e "${GREEN}✓ Performance tests passed${NC}"
    else
      echo -e "${RED}✗ Performance tests failed${NC}"
    fi
  fi
fi

# Report accessibility test status if they were run
if [[ "$TEST_TYPE" == "all" || "$TEST_TYPE" == "a11y" || "$RUN_A11Y" == "true" ]]; then
  if [ ${a11y_status:-0} -eq 0 ]; then
    echo -e "${GREEN}✓ Accessibility tests passed in all browsers${NC}"
  else
    echo -e "${RED}✗ Some accessibility tests failed${NC}"
  fi
fi

# Report offline functionality test status if they were run
if [[ "$TEST_TYPE" == "all" || "$TEST_TYPE" == "offline" || "$RUN_OFFLINE" == "true" ]]; then
  if [ ${offline_status:-0} -eq 0 ]; then
    echo -e "${GREEN}✓ Offline functionality tests passed${NC}"
  else
    echo -e "${RED}✗ Offline functionality tests failed${NC}"
  fi
fi

# Report security test status if they were run
if [[ "$TEST_TYPE" == "all" || "$TEST_TYPE" == "security" || "$RUN_SECURITY" == "true" ]]; then
  if [ ${security_status:-0} -eq 0 ]; then
    echo -e "${GREEN}✓ Security tests passed${NC}"
  else
    echo -e "${RED}✗ Some security tests failed${NC}"
  fi
fi

# Return overall status based on which tests were run
if [[ "$TEST_TYPE" == "all" ]]; then
  # All tests need to pass
  if [ ${component_status:-0} -eq 0 ] && [ ${e2e_status:-0} -eq 0 ] && [ ${a11y_status:-0} -eq 0 ] && [ ${offline_status:-0} -eq 0 ]; then
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
elif [[ "$TEST_TYPE" == "a11y" ]]; then
  # Only accessibility tests need to pass
  exit ${a11y_status:-0}
elif [[ "$TEST_TYPE" == "offline" ]]; then
  # Only offline functionality tests need to pass
  exit ${offline_status:-0}
else
  # Unknown test type
  echo -e "${RED}Unknown test type: $TEST_TYPE${NC}"
  exit 1
fi
