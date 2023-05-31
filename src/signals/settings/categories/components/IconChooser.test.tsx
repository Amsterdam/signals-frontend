import { render, screen } from '@testing-library/react'

import type { Props } from './IconChooser'
import { IconChooser } from './IconChooser'
import { withAppContext } from '../../../../test/utils'

const myMockRef: { current: HTMLInputElement | null } = { current: null }

const defaultProps: Props = {
  name: 'icon',
  value: '',
  onChange: jest.fn(),
  iconButtonText: 'Icoon toevoegen',
  inputRef: myMockRef,
}
describe('IconChooser', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })
  it('should render the IconChooser', async () => {
    render(withAppContext(<IconChooser {...defaultProps} />))

    expect(screen.queryByAltText('icon added')).not.toBeInTheDocument()
    expect(
      screen.queryByText('Let op! Er wordt geen back-up van het icoon gemaakt.')
    ).not.toBeInTheDocument()
    expect(screen.getByText('Icoon toevoegen')).toBeInTheDocument()
  })
  it('should show the delete icon if an icon is uploaded', async () => {
    const mockedProps: Props = {
      ...defaultProps,
      value: '../assets/images/afval/bread.svg',
      iconButtonText: 'Icoon wijzigen',
    }

    render(withAppContext(<IconChooser {...mockedProps} />))

    expect(screen.getByTestId('delete-icon-button')).toBeInTheDocument()
    expect(screen.getByAltText('icon added')).toBeInTheDocument()
    expect(
      screen.getByText('Let op! Er wordt geen back-up van het icoon gemaakt.')
    ).toBeInTheDocument()
  })
})
