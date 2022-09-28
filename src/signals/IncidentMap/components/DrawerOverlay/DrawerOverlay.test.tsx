import type { PropsWithChildren } from 'react'

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { mockIncidents } from '../__test__'
import { DrawerOverlay } from './DrawerOverlay'
import type { Props } from './DrawerOverlay'
import type { ControlledContentProps } from './types'
import { DrawerState } from './types'

const mockControlledComponent = (props: ControlledContentProps) => (
  <span {...props}>[Address Search Input]</span>
)

const defaultProps: PropsWithChildren<Props> = {
  ControlledContent: mockControlledComponent,
  onCloseDetailPanel: jest.fn(),
  onStateChange: jest.fn(),
  state: DrawerState.Open,
  children: <div>[ChildrenComponent]</div>,
}

const renderComponent = (props?: Partial<Props>) =>
  render(<DrawerOverlay {...defaultProps} {...props} />)

describe('DrawerOverlay', () => {
  it('should render panel with children', () => {
    renderComponent()

    expect(
      screen.getByRole('button', { name: 'Paneel sluiten' })
    ).toBeInTheDocument()
    expect(screen.getByText('[Address Search Input]')).toBeInTheDocument()
    expect(screen.getByText('[ChildrenComponent]')).toBeInTheDocument()
  })

  it('should toggle panel on button click', () => {
    renderComponent()

    const closeButton = screen.getByRole('button', { name: 'Paneel sluiten' })

    expect(closeButton).toBeInTheDocument()

    userEvent.click(closeButton)

    expect(defaultProps.onStateChange).toHaveBeenCalledWith('CLOSED')
  })

  it('should render detail panel', () => {
    renderComponent({ incident: mockIncidents[0] })

    expect(
      screen.getByText(
        'Restafval container is kapot of vol. Of er is iets anders aan de hand. In elk geval er kan niks meer in de container.'
      )
    ).toBeInTheDocument()
    expect(screen.getByText('07-09-2022 12:09')).toBeInTheDocument()
  })
})
