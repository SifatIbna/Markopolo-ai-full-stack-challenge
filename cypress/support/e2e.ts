// Import commands.js using ES2015 syntax:
import './commands'

// Handle uncaught exceptions from hydration mismatches
Cypress.on('uncaught:exception', (err, runnable) => {
  // Don't fail tests on hydration mismatches during development
  if (err.message.includes('Hydration failed')) {
    return false
  }
  return true
})

// Alternatively you can use CommonJS syntax:
// require('./commands')