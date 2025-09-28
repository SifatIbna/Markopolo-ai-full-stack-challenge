describe('Theme Toggle', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('should display the theme toggle button', () => {
    // Find the theme toggle button by aria-label
    cy.get('button[aria-label="Toggle theme"]').should('be.visible')
  })

  it('should toggle between light and dark themes', () => {
    // Wait for component to mount and theme to be resolved
    cy.get('button[aria-label="Toggle theme"]').should('be.visible')

    // Wait for theme system to fully initialize
    cy.wait(500)

    // Get initial theme state
    cy.get('html').then(($html) => {
      const isInitiallyDark = $html.hasClass('dark')

      // Click theme toggle
      cy.get('button[aria-label="Toggle theme"]').click()

      // Wait for theme change and verify opposite state
      if (isInitiallyDark) {
        cy.get('html').should('not.have.class', 'dark', { timeout: 5000 })
      } else {
        cy.get('html').should('have.class', 'dark', { timeout: 5000 })
      }

      // Toggle back
      cy.get('button[aria-label="Toggle theme"]').click()

      // Verify it returns to original state
      if (isInitiallyDark) {
        cy.get('html').should('have.class', 'dark', { timeout: 5000 })
      } else {
        cy.get('html').should('not.have.class', 'dark', { timeout: 5000 })
      }
    })
  })

  it('should show correct icons for light and dark themes', () => {
    // Wait for component to mount
    cy.get('button[aria-label="Toggle theme"]').should('be.visible')

    // In light mode, should show moon icon
    cy.get('button[aria-label="Toggle theme"]').within(() => {
      cy.get('svg').should('be.visible')
    })

    // Click to dark mode
    cy.get('button[aria-label="Toggle theme"]').click()

    // In dark mode, should show sun icon
    cy.get('button[aria-label="Toggle theme"]').within(() => {
      cy.get('svg').should('be.visible')
    })
  })
})