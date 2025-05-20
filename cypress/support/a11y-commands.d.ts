// Extend Cypress types to include the custom commands

declare namespace Cypress {
  interface Chainable<Subject = any> {
    /**
     * Custom command to tab until a selector is focused
     * @param selector The selector to tab to
     * @param options Optional options: maxNumberOfTabs, timeout
     */
    tabUntil(selector: string, options?: { maxNumberOfTabs?: number; timeout?: number }): Chainable<JQuery<HTMLElement>>;

    /**
     * Custom command to check for accessible name
     */
    hasAccessibleName(): Chainable<JQuery<HTMLElement>>;

    /**
     * Custom command to check if element is keyboard accessible
     */
    isKeyboardAccessible(): Chainable<JQuery<HTMLElement>>;
  }
}
