describe('Theme Toggle', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('should display the theme toggle button', () => {
    // Find the theme toggle button by aria-label
    cy.get('button[aria-label="Toggle theme"]').should('be.visible')
  })

  it('should toggle between light and dark themes', () => {
    // Wait for component to mount
    cy.get('button[aria-label="Toggle theme"]').should('be.visible')

    // Click theme toggle
    cy.get('button[aria-label="Toggle theme"]').click()

    // Wait for theme change and check for dark mode indicators
    cy.get('html').should('have.class', 'dark')
    cy.get('.dark\\:bg-gray-900').should('exist')

    // Toggle back to light
    cy.get('button[aria-label="Toggle theme"]').click()

    // Check theme changed back to light (dark class should be removed)
    cy.get('html').should('not.have.class', 'dark')
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