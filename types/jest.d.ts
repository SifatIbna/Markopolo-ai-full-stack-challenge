import '@testing-library/jest-dom'

declare global {
  namespace jest {
    interface Matchers<R> {
      toBeInTheDocument(): R
      toHaveClass(...classNames: string[]): R
      toHaveAttribute(attribute: string, value?: string): R
      toHaveProperty(property: string, value?: any): R
      toBeGreaterThan(number: number): R
      toBeLessThan(number: number): R
      toBeLessThanOrEqual(number: number): R
      toBeGreaterThanOrEqual(number: number): R
      toBeDefined(): R
      toEqual(value: any): R
      toBe(value: any): R
      toHaveBeenCalled(): R
      toHaveBeenCalledWith(...args: any[]): R
    }
  }
}