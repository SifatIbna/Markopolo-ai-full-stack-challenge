/// <reference types="cypress" />

// Custom commands for your tests can be defined here
// Example:
// Cypress.Commands.add('login', (email, password) => { ... })

export {}

declare global {
  interface Window {
    Cypress?: typeof Cypress;
  }
}