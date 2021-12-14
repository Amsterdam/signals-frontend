// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Gemeente Amsterdam
import { render, screen } from '@testing-library/react'
import { AssetSelectProvider } from 'signals/incident/components/form/MapSelectors/Asset/context'
import userEvent from '@testing-library/user-event'

import { withAppContext } from 'test/utils'
import type { AssetSelectValue } from '../types'

import Summary from '../Summary'

const contextValue: AssetSelectValue = {
  selection: {
    id: 'PL734',
    type: 'plastic',
    description: 'Plastic asset',
    location: {},
  },
  meta: {
    endpoint: '',
    featureTypes: [
      {
        label: 'Plastic',
        description: 'Plastic asset',
        icon: {
          iconSvg: 'svg',
        },
        idField: 'id_nummer',
        typeField: 'fractie_omschrijving',
        typeValue: 'Plastic',
      },
    ],
  },
  address: {
    postcode: '1000 AA',
    huisnummer: 100,
    woonplaats: 'Amsterdam',
    openbare_ruimte: 'West',
  },
  coordinates: { lat: 0, lng: 0 },
  edit: jest.fn(),
  close: jest.fn(),
  setMessage: jest.fn(),
  setLocation: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}

export const withContext = (Component: JSX.Element, context = contextValue) =>
  withAppContext(
    <AssetSelectProvider value={context}>{Component}</AssetSelectProvider>
  )

describe('signals/incident/components/form/AssetSelect/Summary', () => {
  afterEach(() => {
    jest.resetAllMocks()
  })

  it('should render ', () => {
    render(withContext(<Summary />))

    expect(screen.getByTestId('assetSelectSummary')).toBeInTheDocument()
    expect(
      screen.getByTestId('assetSelectSummaryDescription')
    ).toBeInTheDocument()
    expect(screen.getByTestId('assetSelectSummaryAddress')).toBeInTheDocument()
    expect(screen.getByText(/wijzigen/i)).toBeInTheDocument()
  })

  it('should call edit by mouse click', () => {
    render(withContext(<Summary />))
    expect(contextValue.edit).not.toHaveBeenCalled()

    const element = screen.getByText(/wijzigen/i)

    expect(contextValue.edit).not.toHaveBeenCalled()

    userEvent.click(element)

    expect(contextValue.edit).toHaveBeenCalled()
  })

  it('should call edit by return key', () => {
    render(withContext(<Summary />))
    expect(contextValue.edit).not.toHaveBeenCalled()

    const element = screen.getByText(/wijzigen/i)
    element.focus()

    userEvent.keyboard('a')

    expect(contextValue.edit).not.toHaveBeenCalled()

    userEvent.keyboard('{Enter}')

    expect(contextValue.edit).toHaveBeenCalled()
  })
})
