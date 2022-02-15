// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Gemeente Amsterdam
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import configuration from 'shared/services/configuration/configuration'
import { formatAddress } from 'shared/services/format-address'

import { contextValue as assetSelectContextValue } from 'signals/incident/components/form/MapSelectors/Asset//__tests__/withAssetSelectContext'
import { withAppContext } from 'test/utils'
import { AssetSelectProvider } from 'signals/incident/components/form/MapSelectors/Asset/context'
import type { Address } from 'types/address'
import type { MapStaticProps } from 'components/MapStatic/MapStatic'
import type { SummaryProps } from 'signals/incident/components/form/MapSelectors/Asset/types'

import Summary from './Summary'

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

export const address = {
  postcode: '1000 AA',
  huisnummer: 100,
  woonplaats: 'Amsterdam',
  openbare_ruimte: 'West',
}

export const summaryProps: SummaryProps = {
  edit: jest.fn(),
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
    render(withContext(<Summary {...summaryProps} />))

    expect(screen.getByTestId('assetSelectSummary')).toBeInTheDocument()
    expect(
      screen.getByTestId('assetSelectSummaryDescription')
    ).toBeInTheDocument()
    expect(screen.getByTestId('assetSelectSummaryAddress')).toBeInTheDocument()
    expect(screen.getByText(/wijzigen/i)).toBeInTheDocument()
    expect(screen.queryByTestId('typeIcon')).toBeInTheDocument()
    expect(screen.queryByTestId('mapStatic')).not.toBeInTheDocument()
    expect(screen.queryByTestId('map-base')).toBeInTheDocument()
  })

  it('should render static map with useStaticMapServer enabled', () => {
    render(withContext(<Summary {...summaryProps} />))

    expect(screen.getByTestId('assetSelectSummary')).toBeInTheDocument()
    expect(
      screen.getByTestId('assetSelectSummaryDescription')
    ).toBeInTheDocument()
    expect(screen.getByTestId('assetSelectSummaryAddress')).toBeInTheDocument()
    expect(screen.getByText(/wijzigen/i)).toBeInTheDocument()
    expect(screen.queryByTestId('typeIcon')).toBeInTheDocument()
    expect(screen.getByTestId('mapStatic')).toBeInTheDocument()
    expect(screen.queryByTestId('map-base')).not.toBeInTheDocument()
  })

  it('does not render empty values', () => {
    const propsNoFeatureTypes = {
      ...summaryProps,
      featureTypes: [],
    }
    render(withContext(<Summary {...propsNoFeatureTypes} />))

    const idRe = new RegExp(`${selection.id}$`)
    const undefinedRe = new RegExp('undefined')

    expect(screen.getByText(idRe)).toBeInTheDocument()
    expect(screen.queryByTestId('typeIcon')).not.toBeInTheDocument()
    expect(screen.queryByText(undefinedRe)).not.toBeInTheDocument()
  })

  it('renders without selection', () => {
    const propsNoSelection = {
      ...summaryProps,
      selection: undefined,
    }
    render(withContext(<Summary {...propsNoSelection} />))

    expect(
      screen.queryByTestId('assetSelectSummaryDescription')
    ).not.toBeInTheDocument()
    expect(screen.getByText(formatAddress(address))).toBeInTheDocument()
  })

  it('should call edit by mouse click', () => {
    render(withContext(<Summary {...summaryProps} />))
    expect(summaryProps.edit).not.toHaveBeenCalled()

    const element = screen.getByText(/wijzigen/i)

    expect(summaryProps.edit).not.toHaveBeenCalled()

    userEvent.click(element)

    expect(summaryProps.edit).toHaveBeenCalled()
  })

  it('should call edit by return key', () => {
    render(withContext(<Summary {...summaryProps} />))
    expect(summaryProps.edit).not.toHaveBeenCalled()

    const element = screen.getByText(/wijzigen/i)
    element.focus()

    userEvent.keyboard('a')

    expect(summaryProps.edit).not.toHaveBeenCalled()

    userEvent.keyboard('{Enter}')

    expect(summaryProps.edit).toHaveBeenCalled()
  })

  it("does not show 'wijzigen' link when edit is undefined", () => {
    const propsNoEdit = {
      ...summaryProps,
      edit: undefined,
    }
    render(withContext(<Summary {...propsNoEdit} />))
    expect(screen.queryByText(/wijzigen/i)).not.toBeInTheDocument()
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

  it('renders a MapStatic component with the correct iconSrc prop', () => {
    render(withContext(<Summary {...summaryProps} />))

    const mapStatic = screen.getByTestId('mapStatic')

    expect(
      mapStatic.querySelector(`img[src="${featureType.icon.iconUrl}"]`)
    ).toBeInTheDocument()
  })
})
