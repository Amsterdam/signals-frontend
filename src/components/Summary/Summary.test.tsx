// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2022 Gemeente Amsterdam
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import * as reactRedux from 'react-redux'

import configuration from 'shared/services/configuration/configuration'
import { formatAddress } from 'shared/services/format-address'
import { contextValue as assetSelectContextValue } from 'signals/incident/components/form/MapSelectors/Asset//__tests__/withAssetSelectContext'
import { AssetSelectProvider } from 'signals/incident/components/form/MapSelectors/Asset/context'
import type { SummaryProps } from 'signals/incident/components/form/MapSelectors/Asset/types'
import type { Item } from 'signals/incident/components/form/MapSelectors/types'
import { showMap } from 'signals/incident/containers/IncidentContainer/actions'
import { history } from 'test/utils'
import { withAppContext } from 'test/utils'
import type { Address } from 'types/address'

import MockInstance = jest.MockInstance
import Summary from './Summary'

jest.mock('shared/services/configuration/configuration')
jest.mock('react-router-dom', () => ({
  __esModule: true,
  ...jest.requireActual('react-router-dom'),
}))

const selection: Item[] = [
  {
    id: 'PL734',
    type: 'plastic',
    description: 'Plastic asset',
    location: {},
    label: 'Plastic container - PL734',
  },
]
const featureType = {
  label: 'Plastic',
  description: 'Plastic asset',
  icon: {
    iconUrl: 'plasticIconUrl',
  },
  idField: 'id_nummer',
  typeField: 'fractie_omschrijving',
  typeValue: 'plastic',
}

export const address = {
  postcode: '1000 AA',
  huisnummer: 100,
  woonplaats: 'Amsterdam',
  openbare_ruimte: 'West',
}

export const summaryProps: SummaryProps = {
  selection,
  featureTypes: [featureType],
  address,
  coordinates: { lat: 0, lng: 0 },
}

export const withContext = (
  Component: JSX.Element,
  context = assetSelectContextValue
) =>
  withAppContext(
    <AssetSelectProvider value={context}>{Component}</AssetSelectProvider>
  )

const dispatch = jest.fn()

describe('signals/incident/components/form/AssetSelect/Summary', () => {
  beforeEach(() => {
    jest.spyOn(reactRedux, 'useDispatch').mockImplementation(() => dispatch)
    const dispatchEventSpy: MockInstance<any, any> = jest.spyOn(
      global.document,
      'dispatchEvent'
    )
    dispatch.mockReset()
    dispatchEventSpy.mockReset()
  })

  afterEach(() => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    configuration.__reset()
    jest.resetAllMocks()
  })

  it('renders interactive map correctly', () => {
    render(withContext(<Summary {...summaryProps} />))

    expect(screen.getByTestId('asset-select-summary')).toBeInTheDocument()
    expect(
      screen.getByTestId('asset-select-summary-description')
    ).toBeInTheDocument()
    expect(
      screen.getByTestId('asset-select-summary-address')
    ).toBeInTheDocument()
    expect(screen.getByText(/wijzigen/i)).toBeInTheDocument()
    expect(screen.queryByTestId('type-icon')).toBeInTheDocument()
    expect(screen.queryByTestId('map-base')).toBeInTheDocument()
  })

  it('does not render empty values', () => {
    const propsNoFeatureTypes = {
      ...summaryProps,
      featureTypes: [],
    }
    render(withContext(<Summary {...propsNoFeatureTypes} />))

    const idRe = new RegExp(`${selection[0].id}$`)
    const undefinedRe = new RegExp('undefined')

    expect(screen.getByText(idRe)).toBeInTheDocument()
    expect(screen.queryByTestId('type-icon')).not.toBeInTheDocument()
    expect(screen.queryByText(undefinedRe)).not.toBeInTheDocument()
  })

  it('renders without selection', () => {
    const propsNoSelection = {
      ...summaryProps,
      selection: undefined,
    }
    render(withContext(<Summary {...propsNoSelection} />))

    expect(
      screen.queryByTestId('asset-select-summary-description')
    ).not.toBeInTheDocument()
    expect(screen.getByText(formatAddress(address))).toBeInTheDocument()
  })

  it('should call edit by mouse click', () => {
    render(withContext(<Summary {...summaryProps} />))
    expect(dispatch).not.toHaveBeenCalledWith(showMap())

    const element = screen.getByText(/wijzigen/i)

    expect(dispatch).not.toHaveBeenCalledWith(showMap())

    userEvent.click(element)

    expect(dispatch).toHaveBeenCalledWith(showMap())
  })

  it('should call edit by return key', () => {
    render(withContext(<Summary {...summaryProps} />))
    expect(dispatch).not.toHaveBeenCalledWith(showMap())

    const element = screen.getByText(/wijzigen/i)
    element.focus()

    userEvent.keyboard('a')

    expect(dispatch).not.toHaveBeenCalledWith(showMap())

    userEvent.keyboard('{Enter}')

    expect(dispatch).toHaveBeenCalledWith(showMap())
  })

  it('renders summary address', () => {
    const address = summaryProps.address as Address
    const propsNoAddress = {
      ...summaryProps,
      address: undefined,
    }

    const { rerender } = render(withContext(<Summary {...summaryProps} />))
    expect(
      screen.queryByText('Locatie is gepind op de kaart')
    ).not.toBeInTheDocument()
    expect(screen.getByText(formatAddress(address))).toBeInTheDocument()

    rerender(withContext(<Summary {...propsNoAddress} />))

    expect(
      screen.getByText('Locatie is gepind op de kaart')
    ).toBeInTheDocument()
    expect(screen.queryByText(formatAddress(address))).not.toBeInTheDocument()
  })

  it('renders a Map component with the correct iconSrc prop', () => {
    render(withContext(<Summary {...summaryProps} />))
    expect(
      screen
        .getByTestId('map-base')
        .querySelector(`img[src='/assets/images/icon-select-marker.svg']`)
    ).toBeInTheDocument()
  })

  it("renders the mapEditButton at 'incident/vulaan'", () => {
    render(withContext(<Summary {...summaryProps} />))

    expect(screen.getByTestId('map-edit-button')).toBeInTheDocument()
  })

  it("does not render the mapEditButton at 'incident/summary'", async () => {
    history.push('/incident/summary')

    render(withContext(<Summary {...summaryProps} />))

    await waitFor(() => {
      expect(screen.queryByTestId('map-edit-button')).not.toBeInTheDocument()
    })
  })
})
