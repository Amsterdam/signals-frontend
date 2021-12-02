// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Gemeente Amsterdam
import { fireEvent, render, screen } from '@testing-library/react'
import { AssetSelectProvider } from 'signals/incident/components/form/MapSelectors/Asset/context'

import { withAppContext } from 'test/utils'
import type { AssetSelectValue } from '../../types'

import Summary from '../Summary'

const contextValue: AssetSelectValue = {
  selection: [
    {
      id: 'PL734',
      type: 'plastic',
      description: 'Plastic asset',
    },
  ],
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
  location: [1, 1],
  update: jest.fn(),
  edit: jest.fn(),
  close: jest.fn(),
  setMessage: jest.fn(),
  setLocation: jest.fn(),
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
    expect(screen.getByTestId('assetList')).toBeInTheDocument()
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
