/// <reference types="cypress" />

// Custom commands for your tests can be defined here
// Example:
// Cypress.Commands.add('login', (email, password) => { ... })

export {}

declare global {
  namespace Cypress {
    interface Chainable {
      // Add custom command types here if needed
    }
  }
}