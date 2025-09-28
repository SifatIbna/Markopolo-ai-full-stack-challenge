import { render, screen } from '@testing-library/react'

// Simple test to verify setup works
describe('Test Setup', () => {
  it('should render a simple component', () => {
    const TestComponent = () => <div>Hello World</div>

    render(<TestComponent />)

    expect(screen.getByText('Hello World')).toBeInTheDocument()
  })

  it('should pass basic functionality test', () => {
    expect(1 + 1).toBe(2)
  })
})