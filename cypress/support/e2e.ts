import './commands';
import './a11y-commands';
import './performance-commands';
import './mobile-commands';
import './network-commands';
import 'cypress-axe';
import 'cypress-file-upload';

Cypress.on('uncaught:exception', (err, runnable) => {
    return false;
});