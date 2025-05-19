# Accessibility Testing

This document outlines the accessibility testing approach for the PDF Splitter application.

## Overview

The accessibility tests are designed to ensure that the application follows WCAG 2.1 guidelines and is usable by people with disabilities. We test for:

1. **WCAG 2.1 Compliance** - Using axe-core to automatically check for accessibility violations
2. **Keyboard Navigation** - Ensuring the application can be fully used with a keyboard
3. **Screen Reader Compatibility** - Testing that all important content is accessible to screen readers
4. **Color Contrast and Text Readability** - Ensuring text is readable for users with visual impairments
5. **Focus Management** - Testing that focus is handled properly throughout user flows

## Running the Tests

To run the accessibility tests, make sure your development server is running:

```bash
# In one terminal, start the development server
npm run dev

# In another terminal, run the accessibility tests
npm run test:a11y
```

## Test Structure

The accessibility tests are organized according to the four principles of WCAG 2.1:

1. **Perceivable** - Tests to ensure information and user interface components are presentable to users in ways they can perceive
   - Text alternatives for non-text content
   - Heading structure
   - Color contrast
   - Text resizing

2. **Operable** - Tests to ensure user interface components and navigation can be operated by all users
   - Keyboard accessibility
   - Focus management
   - Button operability
   - File upload interactions

3. **Understandable** - Tests to ensure information and operation of the interface is understandable
   - Clear interface layout
   - Consistent navigation
   - Error identification
   - Form labeling

4. **Robust** - Tests to ensure content is compatible with current and future user agents, including assistive technologies
   - Valid HTML structure
   - ARIA roles and attributes
   - Form control labeling

## Implemented Accessibility Features

Our PDF Splitter application implements the following accessibility features:

1. **Keyboard Navigation** - All interactive elements can be used with a keyboard
   - Tab order follows a logical sequence
   - Focus states are visible and clear
   - Enter/Space can activate controls

2. **Screen Reader Support**
   - Proper ARIA attributes (`aria-live`, `aria-label`, `role`, etc.)
   - Semantic HTML structure
   - Proper heading hierarchy
   - Status messages are announced appropriately

3. **Visual Considerations**
   - Sufficient color contrast for text and UI elements
   - No reliance on color alone for conveying information
   - Proper focus indicators
   - Text can be resized without breaking layout

4. **Additional Considerations**
   - Support for high contrast mode
   - Respects reduced motion preferences
   - Proper error identification and suggestions

## Fixing Accessibility Issues

When an accessibility test fails, the error message will indicate the specific WCAG guideline that is being violated. Common issues include:

1. **Missing alt text on images** - Add descriptive alt text to all images
2. **Insufficient color contrast** - Adjust colors to meet contrast requirements
3. **Missing labels on form elements** - Add labels to all form elements
4. **Improper heading structure** - Ensure headings follow a logical hierarchy
5. **Keyboard inaccessible elements** - Make sure all interactive elements can be accessed with a keyboard

## Addressing Test Failures

When accessibility tests fail, it's important to understand and prioritize the issues for remediation. Here's how to approach common test failures:

### Priority 1: Critical Accessibility Issues

1. **Missing or improper ARIA attributes** - These are essential for screen reader users
   - Add `role` attributes to custom interactive elements
   - Add `aria-label` attributes for elements without visible text
   - Implement `aria-live` regions for dynamic content

2. **Keyboard accessibility issues** - These prevent keyboard-only users from using the application
   - Add `tabindex="0"` to custom interactive elements
   - Ensure proper focus management
   - Implement keyboard event handlers for custom controls

### Priority 2: Important Usability Issues

1. **Color contrast issues** - These affect users with low vision
   - Adjust foreground/background colors to meet WCAG AA (4.5:1) ratio
   - Use a contrast checker tool to verify compliance

2. **Focus visibility issues** - These make the application difficult to use with a keyboard
   - Ensure all focusable elements have a visible focus indicator
   - Do not remove default focus outlines without providing an alternative

### Priority 3: Enhancement Issues

1. **Missing alternative text** - Provide descriptive alt text for all images
2. **Improved semantic structure** - Use appropriate HTML5 landmark regions and heading levels
3. **Better error handling** - Provide clear error messages with suggestions for resolution

Remember that accessibility is an ongoing process, not a one-time fix. Regularly run accessibility tests and address issues as they arise.

## Testing Tools

Our accessibility testing uses the following tools:

1. **cypress-axe** - Integration of axe-core with Cypress for automated accessibility testing
   - Checks for WCAG 2.1 compliance
   - Identifies common accessibility issues
   - Provides detailed violation reports

2. **Custom Cypress Commands**
   - `cy.tab()` - Tests keyboard navigation
   - `cy.checkA11y()` - Runs accessibility checks on specific elements or the entire page

3. **Manual Testing**
   - Screen reader compatibility (NVDA, VoiceOver, JAWS)
   - Keyboard-only navigation
   - High contrast mode
   - Zoom/text scaling tests

## Accessibility Standards

Our application aims to conform to WCAG 2.1 Level AA, which includes:

1. **Perceivable**
   - Text alternatives for non-text content
   - Captions and other alternatives for multimedia
   - Content that can be presented in different ways
   - Content that is easier to see and hear

2. **Operable**
   - Functionality available from a keyboard
   - Users have enough time to read and use content
   - Content that does not cause seizures or physical reactions
   - Users can easily navigate, find content, and determine where they are

3. **Understandable**
   - Text that is readable and understandable
   - Content that appears and operates in predictable ways
   - Users are helped to avoid and correct mistakes

4. **Robust**
   - Content that is compatible with current and future user tools

## Resources

- [WCAG 2.1 Guidelines](https://www.w3.org/TR/WCAG21/)
- [axe-core Documentation](https://github.com/dequelabs/axe-core)
- [cypress-axe Documentation](https://github.com/component-driven/cypress-axe)
