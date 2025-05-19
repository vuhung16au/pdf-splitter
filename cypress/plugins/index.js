/// <reference types="cypress" />

/**
 * @type {Cypress.PluginConfig}
 */
module.exports = (on, config) => {
  // This function is called when a project is opened or re-opened (e.g. due to
  // the project's config changing)
  
  // Support for Edge browser
  on('before:browser:launch', (browser = {}, launchOptions) => {
    if (browser.name === 'edge') {
      // Edge specific configuration
      launchOptions.args.push('--disable-features=IsolateOrigins,site-per-process');
    }
    
    return launchOptions;
  });
  
  return config;
};
