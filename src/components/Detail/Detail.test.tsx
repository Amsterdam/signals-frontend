import { screen, render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { Detail } from './Detail'

describe('Detail', () => {
  it('should render the header and content', () => {
    const header = 'Test Header'
    const content = 'Test Content'
    render(<Detail header={header} content={content} />)

    expect(screen.getByText(header)).toBeInTheDocument()
    expect(screen.getByText(content)).toBeInTheDocument()
  })

  it('should toggle the detailed information when the header is clicked', () => {
    const header = 'Test Header'
    const content = 'Test Content'
    render(<Detail header={header} content={content} />)

    const headerElement = screen.getByText(header)
    const toggleButton = screen.getByRole('button')

    expect(toggleButton).toHaveAttribute('aria-expanded', 'false')
    expect(toggleButton).toHaveAttribute('title', 'Toon informatie')

    userEvent.click(headerElement)

    expect(toggleButton).toHaveAttribute('aria-expanded', 'true')
    expect(toggleButton).toHaveAttribute('title', 'Verberg informatie')

    userEvent.click(headerElement)

    expect(toggleButton).toHaveAttribute('aria-expanded', 'false')
    expect(toggleButton).toHaveAttribute('title', 'Toon informatie')
  })

  it('should render the children', () => {
    const header = 'Test Header'
    const content = 'Test Content'
    const children = <div>Test Children</div>
    render(
      <Detail header={header} content={content}>
        {children}
      </Detail>
    )

    expect(screen.getByText('Test Children')).toBeInTheDocument()
  })
})
