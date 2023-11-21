// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 Gemeente Amsterdam
import type { PropsWithChildren } from 'react'

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { DrawerOverlay } from './DrawerOverlay'
import type { Props } from './DrawerOverlay'
import { DrawerState } from './types'
import { mockIncidentsLong } from '../../signals/IncidentMap/components/__test__'
import { DetailPanel } from '../../signals/IncidentMap/components/DetailPanel/DetailPanel'

const defaultProps: PropsWithChildren<Props> = {
  onCloseDetailPanel: jest.fn(),
  onStateChange: jest.fn(),
  state: DrawerState.Open,
  children: <div>[ChildrenComponent]</div>,
  DetailPanel: DetailPanel,
}

const renderComponent = (props?: Partial<Props>) =>
  render(<DrawerOverlay {...defaultProps} {...props} />)

describe('DrawerOverlay', () => {
  it('should render panel with children', () => {
    renderComponent()

    expect(
      screen.getByRole('button', { name: 'Paneel sluiten' })
    ).toBeInTheDocument()
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
    renderComponent({ incident: mockIncidentsLong[0] })

    expect(
      screen.getByText(
        'Restafval container is kapot of vol. Of er is iets anders aan de hand. In elk geval er kan niks meer in de container.'
      )
    ).toBeInTheDocument()
    expect(screen.getByText('7 september 2022')).toBeInTheDocument()
  })
})
