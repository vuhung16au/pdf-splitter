declare namespace Cypress {
  interface Chainable {
    /**
     * Custom command to trigger touch events
     * @param eventType - The type of touch event to trigger
     * @param options - Additional options for the touch event
     */
    touch(eventType: string, options?: { clientX?: number; clientY?: number }): Chainable<Element>

    /**
     * Custom command to perform swipe gestures
     * @param direction - The direction to swipe ('left', 'right', 'up', 'down')
     * @param distance - The distance to swipe in pixels
     */
    swipe(direction: 'left' | 'right' | 'up' | 'down', distance?: number): Chainable<Element>

    /**
     * Custom command to perform long press
     * @param duration - The duration of the press in milliseconds
     */
    longPress(duration?: number): Chainable<Element>

    /**
     * Custom command to perform pinch gesture
     * @param scale - The scale factor for the pinch
     */
    pinch(scale?: number): Chainable<Element>

    /**
     * Custom command to perform double tap
     */
    doubleTap(): Chainable<Element>

    /**
     * Custom command to upload files on mobile
     * @param file - The file to upload
     */
    mobileFileUpload(file: File | File[]): Chainable<Element>

    /**
     * Custom command to check if element has proper touch target size
     * @param minSize - The minimum size in pixels
     */
    hasTouchTargetSize(minSize?: number): Chainable<Element>

    /**
     * Custom command to check if element has proper spacing
     * @param minSpacing - The minimum spacing in pixels
     */
    hasProperSpacing(minSpacing?: number): Chainable<Element>
  }
} 