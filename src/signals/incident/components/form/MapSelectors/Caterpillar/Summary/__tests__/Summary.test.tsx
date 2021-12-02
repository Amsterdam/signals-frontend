// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Gemeente Amsterdam
import { fireEvent, render, screen } from '@testing-library/react'
import type { LatLngExpression } from 'leaflet'
import { withAppContext } from 'test/utils'
import { SelectProvider } from '../../context/context'
import type { SelectValue } from '../../types'

import Summary from '../Summary'

const contextValue: SelectValue = {
  selection: [
    {
      id: 'REE01013',
      type: 'Eikenboom',
      description: 'Eikenboom',
    },
  ],
  meta: {
    icons: [],
    extraProperties: [],
    name: 'Name',
    endpoint: '',
    featureTypes: [
      {
        label: 'Eikenboom',
        description: 'Eikenboom',
        idField: 'id_nummer',
        typeValue: 'Eikenboom',
        iconId: 'iconId',
        iconIsReportedId: 'iconIsReportedId',
        isReportedField: 'isReportedField',
        isReportedValue: 'isReportedValue',
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
  withAppContext(<SelectProvider value={context}>{Component}</SelectProvider>)

describe('signals/incident/components/form/MapSelector/Caterpillar/Summary', () => {
  afterEach(() => {
    jest.resetAllMocks()
  })

  it('should render ', () => {
    render(withContext(<Summary />))

    expect(screen.getByTestId('caterpillarSelectSummary')).toBeInTheDocument()
    expect(screen.getByTestId('selectionList')).toBeInTheDocument()
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
