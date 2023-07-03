import { render, screen } from '@testing-library/react'

import { StatusCode } from 'types/status-code'

import { Summary } from './Summary'

const standardText = {
  id: 10,
  title: 'Titel #7',
  text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
  active: true,
  state: StatusCode.Afgehandeld,
  meta: {},
}
describe('Summary', () => {
  it('renders the component with the correct props', () => {
    render(<Summary standardText={standardText} />)

    expect(screen.getByText(standardText.title)).toBeInTheDocument()
    expect(screen.getByText(standardText.text)).toBeInTheDocument()
  })

  it('renders the component with the correct status value', () => {
    render(<Summary standardText={standardText} />)

    expect(screen.getByText('Afgehandeld')).toBeInTheDocument()
  })
})
