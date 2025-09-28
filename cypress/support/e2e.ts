// Import commands.js using ES2015 syntax:
import './commands'

// Handle uncaught exceptions from React and hydration issues
Cypress.on('uncaught:exception', (err) => {
  // Don't fail tests on hydration mismatches during development
  if (err.message.includes('Hydration failed')) {
    return false
  }

  // Don't fail tests on React minified errors (often hydration related)
  if (err.message.includes('Minified React error #418')) {
    return false
  }

  // Don't fail tests on React text content mismatches
  if (err.message.includes('Text content does not match server-rendered HTML')) {
    return false
  }

  // Don't fail tests on React hydration errors
  if (err.message.includes('The server could not finish this Suspense boundary')) {
    return false
  }

  return true
})

// Alternatively you can use CommonJS syntax:
// require('./commands')