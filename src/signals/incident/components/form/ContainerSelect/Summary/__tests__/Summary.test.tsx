// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Gemeente Amsterdam
import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import { ContainerSelectProvider } from 'signals/incident/components/form/ContainerSelect/context'
import type { LatLngExpression } from 'leaflet'
import { withAppContext } from 'test/utils'
import type { ContainerSelectValue } from '../../types'

import Summary from '../Summary'

const contextValue: ContainerSelectValue = {
  selection: [
    {
      id: 'PL734',
      type: 'plastic',
      description: 'Plastic container',
    },
  ],
  meta: {
    endpoint: '',
    featureTypes: [
      {
        label: 'Plastic',
        description: 'Plastic container',
        icon: {
          iconSvg: 'svg',
        },
        idField: 'id_nummer',
        typeField: 'fractie_omschrijving',
        typeValue: 'Plastic',
      },
    ],
  },
  location: [1, 1] as LatLngExpression,
  update: jest.fn(),
  edit: jest.fn(),
  close: jest.fn(),
  setMessage: jest.fn(),
}

export const withContext = (Component: JSX.Element, context = contextValue) =>
  withAppContext(
    <ContainerSelectProvider value={context}>
      {Component}
    </ContainerSelectProvider>
  )

describe('signals/incident/components/form/ContainerSelect/Summary', () => {
  afterEach(() => {
    jest.resetAllMocks()
  })

  it('should render ', () => {
    render(withContext(<Summary />))

    expect(screen.getByTestId('containerSelectSummary')).toBeInTheDocument()
    expect(screen.getByTestId('containerList')).toBeInTheDocument()
    expect(screen.getByText(/wijzigen/i)).toBeInTheDocument()
  })

  it('should call edit', () => {
    render(withContext(<Summary />))
    expect(contextValue.edit).not.toHaveBeenCalled()

    const element = screen.getByText(/wijzigen/i)
    fireEvent.click(element)
    expect(contextValue.edit).toHaveBeenCalled()
  })
})
