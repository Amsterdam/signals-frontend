// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Gemeente Amsterdam
import { render, screen } from '@testing-library/react'
import { AssetSelectProvider } from 'signals/incident/components/form/MapSelectors/Asset/context'
import userEvent from '@testing-library/user-event'

import type { Address } from 'types/address'

import configuration from 'shared/services/configuration/configuration'
import { formatAddress } from 'shared/services/format-address'
import { withAppContext } from 'test/utils'

import type { MapStaticProps } from 'components/MapStatic/MapStatic'
import type { AssetSelectValue } from '../types'

import Summary from '../Summary'

jest.mock('shared/services/configuration/configuration')

jest.mock('components/MapStatic', () => ({ iconSrc }: MapStaticProps) => (
  <span data-testid="mapStatic">
    <img src={iconSrc} alt="" />
  </span>
))

const selection = {
  id: 'PL734',
  type: 'plastic',
  description: 'Plastic asset',
  location: {},
  label: 'Plastic container - PL734',
}
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

const contextValue: AssetSelectValue = {
  selection,
  meta: {
    endpoint: '',
    featureTypes: [featureType],
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
  fetchLocation: jest.fn(),
  setLocation: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}

export const withContext = (Component: JSX.Element, context = contextValue) =>
  withAppContext(
    <AssetSelectProvider value={context}>{Component}</AssetSelectProvider>
  )

describe('signals/incident/components/form/AssetSelect/Summary', () => {
  beforeEach(() => {
    configuration.featureFlags.useStaticMapServer = true
  })

  afterEach(() => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    configuration.__reset()
    jest.resetAllMocks()
  })

  it('should render interactive map with useStaticMapServer disabled', () => {
    configuration.featureFlags.useStaticMapServer = false
    render(withContext(<Summary />))

    expect(screen.getByTestId('assetSelectSummary')).toBeInTheDocument()
    expect(
      screen.getByTestId('assetSelectSummaryDescription')
    ).toBeInTheDocument()
    expect(screen.getByTestId('assetSelectSummaryAddress')).toBeInTheDocument()
    expect(screen.getByText(/wijzigen/i)).toBeInTheDocument()
    expect(screen.queryByTestId('mapStatic')).not.toBeInTheDocument()
    expect(screen.queryByTestId('map-base')).toBeInTheDocument()
  })

  it('should render static map with useStaticMapServer enabled', () => {
    render(withContext(<Summary />))

    expect(screen.getByTestId('assetSelectSummary')).toBeInTheDocument()
    expect(
      screen.getByTestId('assetSelectSummaryDescription')
    ).toBeInTheDocument()
    expect(screen.getByTestId('assetSelectSummaryAddress')).toBeInTheDocument()
    expect(screen.getByText(/wijzigen/i)).toBeInTheDocument()
    expect(screen.getByTestId('mapStatic')).toBeInTheDocument()
    expect(screen.queryByTestId('map-base')).not.toBeInTheDocument()
  })

  it('does not render empty values', () => {
    render(
      withContext(<Summary />, {
        ...contextValue,
        meta: {
          ...contextValue.meta,
          featureTypes: [],
        },
      })
    )

    const idRe = new RegExp(`${selection.id}$`)
    const undefinedRe = new RegExp('undefined')

    expect(screen.getByText(idRe)).toBeInTheDocument()
    expect(screen.queryByText(undefinedRe)).not.toBeInTheDocument()
  })

  it('renders without selection', () => {
    render(withContext(<Summary />, { ...contextValue, selection: undefined }))

    expect(
      screen.queryByTestId('assetSelectSummaryDescription')
    ).not.toBeInTheDocument()
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

  it('renders summary address', () => {
    const address = contextValue.address as Address

    const { rerender } = render(withContext(<Summary />))
    expect(
      screen.queryByText('Locatie is gepind op de kaart')
    ).not.toBeInTheDocument()
    expect(screen.getByText(formatAddress(address))).toBeInTheDocument()

    rerender(withContext(<Summary />, { ...contextValue, address: undefined }))
    expect(
      screen.getByText('Locatie is gepind op de kaart')
    ).toBeInTheDocument()

    rerender(
      withContext(<Summary />, {
        ...contextValue,
        address: undefined,
        coordinates: undefined,
      })
    )
    expect(
      screen.queryByText('Locatie is gepind op de kaart')
    ).not.toBeInTheDocument()
    expect(screen.queryByText(formatAddress(address))).not.toBeInTheDocument()
  })

  it('renders a MapStatic component witht the correct iconSrc prop', () => {
    render(withContext(<Summary />))

    const mapStatic = screen.getByTestId('mapStatic')

    expect(
      mapStatic.querySelector(`img[src="${featureType.icon.iconUrl}"]`)
    ).toBeInTheDocument()
  })
})
