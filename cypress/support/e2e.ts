import './commands';
import './a11y-commands';
import 'cypress-axe';

Cypress.on('uncaught:exception', (err, runnable) => {
    return false;
});