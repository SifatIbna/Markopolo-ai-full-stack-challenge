import '@testing-library/jest-dom'

declare global {
  namespace jest {
    interface Matchers<R> {
      toBeInTheDocument(): R
      toHaveClass(...classNames: string[]): R
      toHaveAttribute(attribute: string, value?: string): R
      toHaveProperty(property: string, value?: unknown): R
      toBeGreaterThan(number: number): R
      toBeLessThan(number: number): R
      toBeLessThanOrEqual(number: number): R
      toBeGreaterThanOrEqual(number: number): R
      toBeDefined(): R
      toEqual(value: unknown): R
      toBe(value: unknown): R
      toHaveBeenCalled(): R
      toHaveBeenCalledWith(...args: unknown[]): R
    }
  }
}