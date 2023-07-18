import { render, screen } from '@testing-library/react'
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

  it('calls onClick with standardText.id ', () => {
    render(<Summary {...defaultProps} />)

    userEvent.click(screen.getByTestId('summary-standard-text'))
    expect(defaultProps.onClick).toHaveBeenCalledWith(10)
  })
})
