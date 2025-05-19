import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:3000",
    specPattern: "cypress/e2e/**/*.cy.{js,jsx,ts,tsx}",
    supportFile: "cypress/support/e2e.ts",
    viewportWidth: 1280,
    viewportHeight: 720,
    chromeWebSecurity: false
  },
  component: {
    devServer: {
      framework: 'next',
      bundler: 'webpack',
    },
    supportFile: "cypress/support/component.ts",
    specPattern: "cypress/component/**/*.cy.{js,jsx,ts,tsx}"
  }
})
