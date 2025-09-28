import { render, screen, fireEvent } from '@testing-library/react'
import { ThemeToggle } from '@/components/ui/ThemeToggle'

// Mock next-themes
const mockSetTheme = jest.fn()
const mockUseTheme = {
  theme: 'light' as string,
  setTheme: mockSetTheme,
  resolvedTheme: 'light' as string | undefined,
}

jest.mock('next-themes', () => ({
  useTheme: () => mockUseTheme,
}))

describe('ThemeToggle', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockUseTheme.theme = 'light'
    mockUseTheme.resolvedTheme = 'light'
  })

  it('renders moon icon in light mode', () => {
    mockUseTheme.resolvedTheme = 'light'

    render(<ThemeToggle />)

    const button = screen.getByRole('button')
    expect(button).toHaveAttribute('aria-label', 'Toggle theme')
  })

  it('renders sun icon in dark mode', () => {
    mockUseTheme.resolvedTheme = 'dark'

    render(<ThemeToggle />)

    const button = screen.getByRole('button')
    expect(button).toHaveAttribute('aria-label', 'Toggle theme')
  })

  it('calls setTheme when clicked in light mode', () => {
    mockUseTheme.resolvedTheme = 'light'

    render(<ThemeToggle />)

    const button = screen.getByRole('button')
    fireEvent.click(button)

    expect(mockSetTheme).toHaveBeenCalledWith('dark')
  })

  it('calls setTheme when clicked in dark mode', () => {
    mockUseTheme.resolvedTheme = 'dark'

    render(<ThemeToggle />)

    const button = screen.getByRole('button')
    fireEvent.click(button)

    expect(mockSetTheme).toHaveBeenCalledWith('light')
  })

  it('has correct styling classes', () => {
    render(<ThemeToggle />)

    const button = screen.getByRole('button')
    expect(button).toHaveClass(
      'w-9',
      'h-9',
      'rounded-lg',
      'border',
      'border-gray-300',
      'dark:border-gray-600',
      'hover:bg-gray-100',
      'dark:hover:bg-gray-700',
      'flex',
      'items-center',
      'justify-center',
      'transition-colors'
    )
  })

  it('is accessible', () => {
    render(<ThemeToggle />)

    const button = screen.getByRole('button')
    expect(button).toHaveAttribute('aria-label', 'Toggle theme')
  })

  it('handles undefined resolvedTheme gracefully', () => {
    mockUseTheme.resolvedTheme = undefined

    render(<ThemeToggle />)

    const button = screen.getByRole('button')
    fireEvent.click(button)

    // Should default to light and toggle to dark
    expect(mockSetTheme).toHaveBeenCalledWith('dark')
  })
})