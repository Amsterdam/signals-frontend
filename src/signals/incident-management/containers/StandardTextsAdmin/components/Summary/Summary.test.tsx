import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { StatusCode } from 'types/status-code'

import type { Props } from './Summary'
import { Summary } from './Summary'

const defaultProps: Props = {
  standardText: {
    id: 10,
    title: 'Titel #7',
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    active: true,
    state: StatusCode.Afgehandeld,
    meta: {},
    categories: [1],
  },
  onClick: jest.fn(),
}

describe('Summary', () => {
  it('renders the component with the correct props', () => {
    render(<Summary {...defaultProps} />)

    expect(
      screen.getByText(defaultProps.standardText.title)
    ).toBeInTheDocument()
    expect(screen.getByText(defaultProps.standardText.text)).toBeInTheDocument()
  })

  it('renders the component with the correct status value', () => {
    render(<Summary {...defaultProps} />)

    expect(screen.getByText('Afgehandeld')).toBeInTheDocument()
  })

  it('renders API highlights using emphasis', () => {
    render(
      <Summary
        {...defaultProps}
        standardText={{
          ...defaultProps.standardText,
          meta: {
            highlight: {
              title: ['Titel <em>#7</em>'],
              text: ['Lorem <em>ipsum</em>', '<em>dolor</em> sit amet'],
            },
          },
        }}
      />
    )

    expect(screen.getByText('#7').tagName).toBe('EM')
    expect(screen.getByText('ipsum').tagName).toBe('EM')
    expect(screen.getByText('dolor').tagName).toBe('EM')
  })

  it('does not interpret HTML in standard texts', () => {
    const payload =
      '<img src=x onerror=alert(localStorage.getItem("accessToken"))>'
    const { container } = render(
      <Summary
        {...defaultProps}
        standardText={{
          ...defaultProps.standardText,
          title: payload,
          text: payload,
          meta: {},
        }}
      />
    )

    expect(container.querySelector('img')).not.toBeInTheDocument()
    expect(container).toHaveTextContent(payload)
  })

  it('only interprets em tags in API highlights', () => {
    const payload = '<img src=x onerror=alert(1)>'
    const { container } = render(
      <Summary
        {...defaultProps}
        standardText={{
          ...defaultProps.standardText,
          meta: {
            highlight: {
              title: [`<em>match</em>${payload}`],
              text: [`<em>${payload}</em>`],
            },
          },
        }}
      />
    )

    expect(screen.getByText('match').tagName).toBe('EM')
    expect(container.querySelector('img')).not.toBeInTheDocument()
    expect(container).toHaveTextContent(payload)
  })

  it('calls onClick with standardText.id when clicking ', () => {
    render(<Summary {...defaultProps} />)

    userEvent.click(screen.getByTestId('summary-standard-text'))
    expect(defaultProps.onClick).toHaveBeenCalledWith(10)
  })

  it('calls onClick with standardText.id when hitting enter', () => {
    render(<Summary {...defaultProps} />)

    fireEvent.keyDown(screen.getByTestId('summary-standard-text'), {
      key: 'Enter',
      code: 13,
      keyCode: 13,
    })

    expect(defaultProps.onClick).toHaveBeenCalledWith(10)
  })

  it('calls onClick with standardText.id when hitting space', () => {
    render(<Summary {...defaultProps} />)

    fireEvent.keyDown(screen.getByTestId('summary-standard-text'), {
      key: 'Space',
      code: 32,
      keyCode: 32,
    })

    expect(defaultProps.onClick).toHaveBeenCalledWith(10)
  })
})
