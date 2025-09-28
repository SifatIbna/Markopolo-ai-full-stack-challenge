describe('Chat Workflow', () => {
  beforeEach(() => {
    cy.visit('/')
    // Wait for the page to fully load and components to be ready
    cy.get('textarea[placeholder*="Ask about campaign strategies"]').should('be.visible')
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
    // Check data sources panel
    cy.contains('Data Sources').should('be.visible')

    // Check default data sources
    cy.contains('Google Ads').should('be.visible')
    cy.contains('Facebook Pixel').should('be.visible')
    cy.contains('Shopify Store').should('be.visible')

    // All should show "Not connected" initially
    cy.contains('Not connected').should('be.visible')
  })

  it('should display initial welcome message', () => {
    // Check for welcome message in chat
    cy.contains('Hello! I\'m your AI marketing assistant').should('be.visible')
  })

  it('should allow toggling data source connections', () => {
    // Find data source panel and click on any toggle button within it
    cy.contains('Data Sources').parent().within(() => {
      cy.get('button').first().click()
    })

    // Should show "Connected" after clicking
    cy.contains('Connected').should('be.visible')
  })

  it('should send a message and get response', () => {
    const testMessage = 'Tell me about email marketing'

    // Wait for input to be enabled and type message
    cy.get('textarea[placeholder*="Ask about campaign strategies"]').should('be.enabled').type(testMessage)

    // Send the message using a more specific selector for the send button
    cy.get('textarea[placeholder*="Ask about campaign strategies"]').parent().within(() => {
      cy.get('button:has(svg)').click()
    })

    // Check if user message appears
    cy.contains(testMessage).should('be.visible')

    // Should show setup required message since no data sources/channels are connected
    cy.contains('Setup Required', { timeout: 3000 }).should('be.visible')

    // Check if input is cleared (wait for it to be enabled again first)
    cy.get('textarea[placeholder*="Ask about campaign strategies"]').should('be.enabled').should('have.value', '')
  })

  it('should require data sources and channels for recommendations', () => {
    // Send a message without connecting anything
    cy.get('textarea[placeholder*="Ask about campaign strategies"]').should('be.enabled').type('Give me campaign ideas')

    // Send the message using a more specific selector
    cy.get('textarea[placeholder*="Ask about campaign strategies"]').parent().within(() => {
      cy.get('button:has(svg)').click()
    })

    // Should get setup required message
    cy.contains('Setup Required', { timeout: 3000 }).should('be.visible')
    cy.contains('Connect at least one data source').should('be.visible')
  })
})