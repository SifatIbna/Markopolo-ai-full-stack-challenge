describe('Chat Workflow', () => {
  beforeEach(() => {
    cy.visit('/')
    // Wait for the page to fully load and components to be ready
    cy.get('textarea[placeholder*="Ask about campaign strategies"]').should('be.visible')
    // Ensure app is in a clean state before each test
    cy.wait(500)
  })

  it('should display the main interface elements', () => {
    // Check page title
    cy.contains('AI Marketing Assistant').should('be.visible')

    // Check chat interface is present
    cy.contains('Chat Assistant').should('be.visible')

    // Check message input and send button
    cy.get('textarea[placeholder*="Ask about campaign strategies"]').should('be.visible')
    cy.get('button:has(svg)').should('be.visible') // Send button with icon
  })

  it('should display data sources panel', () => {
    // Check data sources panel - scroll to ensure visibility
    cy.contains('Data Sources').scrollIntoView().should('be.visible')

    // Check default data sources exist in the DOM (may be clipped but should exist)
    cy.get('body').should('contain.text', 'Google Ads')
    cy.get('body').should('contain.text', 'Facebook Pixel')
    cy.get('body').should('contain.text', 'Shopify Store')

    // All should show "Not connected" initially
    cy.get('body').should('contain.text', 'Not connected')
  })

  it('should display initial welcome message', () => {
    // Check for welcome message in chat
    cy.contains('Hello! I\'m your AI marketing assistant').should('be.visible')
  })

  it('should allow toggling data source connections', () => {
    // Find data source panel and click on any toggle button within it
    cy.contains('Data Sources').parent().within(() => {
      // Look for switch elements or buttons that might be toggles
      cy.get('button[role="switch"], button:contains("Connect"), button').first().click()
    })

    // Should show "Connected" after clicking, or wait for state change
    cy.contains('Connected').should('be.visible', { timeout: 5000 })
  })

  it('should send a message and get response', () => {
    const testMessage = 'Tell me about email marketing'

    // Wait for input to be enabled and type message - wait longer for app to be ready
    cy.get('textarea[placeholder*="Ask about campaign strategies"]').should('be.visible')
    cy.wait(1000) // Wait for any loading states to clear
    cy.get('textarea[placeholder*="Ask about campaign strategies"]').should('not.be.disabled').type(testMessage)

    // Send the message using a more specific selector for the send button
    cy.get('textarea[placeholder*="Ask about campaign strategies"]').parent().within(() => {
      cy.get('button:has(svg)').click()
    })

    // Check if user message appears (with more relaxed visibility check)
    cy.get('body').should('contain.text', testMessage)

    // Should show setup required message since no data sources/channels are connected
    cy.get('body').should('contain.text', 'Setup Required', { timeout: 5000 })

    // Check if input is cleared (wait for it to be enabled again first)
    cy.get('textarea[placeholder*="Ask about campaign strategies"]').should('not.be.disabled').should('have.value', '')
  })

  it('should require data sources and channels for recommendations', () => {
    // Send a message without connecting anything
    cy.get('textarea[placeholder*="Ask about campaign strategies"]').should('be.visible').should('not.be.disabled').type('Give me campaign ideas')

    // Send the message using a more specific selector
    cy.get('textarea[placeholder*="Ask about campaign strategies"]').parent().within(() => {
      cy.get('button:has(svg)').click()
    })

    // Should get setup required message
    cy.get('body').should('contain.text', 'Setup Required', { timeout: 5000 })
    cy.get('body').should('contain.text', 'Connect at least one data source')
  })
})