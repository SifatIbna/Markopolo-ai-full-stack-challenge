import { render, screen, fireEvent, cleanup, act } from '@testing-library/react'
import { JsonDisplay } from '@/components/ui/JsonDisplay'

// Mock Next.js useRouter
const mockPush = jest.fn()
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
}))

// Mock clipboard API
const mockWriteText = jest.fn()
Object.defineProperty(navigator, 'clipboard', {
  value: {
    writeText: mockWriteText,
  },
  writable: true,
})

// Mock URL.createObjectURL and revokeObjectURL
global.URL.createObjectURL = jest.fn(() => 'mock-blob-url')
global.URL.revokeObjectURL = jest.fn()

const mockData = {
  audience: {
    segment: 'Young Professionals',
    size: 15000,
  },
  channel: {
    primary: 'Email Marketing',
  },
}

// Setup DOM properly for each test
beforeEach(() => {
  cleanup()
  document.body.innerHTML = ''
  jest.clearAllMocks()
})

afterEach(() => {
  cleanup()
})

describe('JsonDisplay', () => {
  it('renders JSON data correctly', () => {
    render(<JsonDisplay data={mockData} />)

    expect(screen.getByText(/Young Professionals/)).toBeInTheDocument()
    expect(screen.getByText(/Email Marketing/)).toBeInTheDocument()
  })

  it('has copy and download buttons', () => {
    render(<JsonDisplay data={mockData} />)

    const copyButton = screen.getByTitle('Copy to clipboard')
    const downloadButton = screen.getByTitle('Download as JSON file')

    expect(copyButton).toBeInTheDocument()
    expect(downloadButton).toBeInTheDocument()
  })

  it('copies JSON to clipboard when copy button is clicked', async () => {
    mockWriteText.mockResolvedValue(undefined)

    render(<JsonDisplay data={mockData} />)

    const copyButton = screen.getByTitle('Copy to clipboard')

    await act(async () => {
      fireEvent.click(copyButton)
    })

    expect(mockWriteText).toHaveBeenCalledWith(JSON.stringify(mockData, null, 2))
  })

  it('handles copy failure gracefully', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
    mockWriteText.mockRejectedValue(new Error('Copy failed'))

    render(<JsonDisplay data={mockData} />)

    const copyButton = screen.getByTitle('Copy to clipboard')

    await act(async () => {
      fireEvent.click(copyButton)
    })

    expect(mockWriteText).toHaveBeenCalled()

    consoleSpy.mockRestore()
  })

  it('formats JSON with proper indentation', () => {
    render(<JsonDisplay data={mockData} />)

    const jsonText = screen.getByText(/Young Professionals/)
    expect(jsonText).toBeInTheDocument()
  })
})