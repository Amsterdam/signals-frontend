// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 Gemeente Amsterdam
import type { FeatureCollection } from 'geojson'

import { render, screen } from '@testing-library/react'
import { Map } from '@amsterdam/react-maps'
import MAP_OPTIONS from 'shared/services/configuration/map-options'

import type { AssetSelectValue } from 'signals/incident/components/form/MapSelectors/Asset/types'

import streetlightsJson from 'utils/__tests__/fixtures/streetlights.json'
import straatverlichtingKlokken from 'signals/incident/definitions/wizard-step-2-vulaan/straatverlichting-klokken'
import { WfsDataProvider } from 'signals/incident/components/form/MapSelectors/Asset/Selector/WfsLayer/context'
import withAssetSelectContext, {
  contextValue,
} from 'signals/incident/components/form/MapSelectors/Asset/__tests__/withAssetSelectContext'
import ClockLayer from './ClockLayer'

const { meta } = straatverlichtingKlokken.extra_klok_nummer
const assetSelectProviderValue: AssetSelectValue = {
  ...contextValue,
  selection: {
    id: '79522',
    type: '1',
    description: 'Klok',
    isReported: true,
    location: {},
    label: 'Klok - 79522',
  },
  meta,
}

describe('ClockLayer', () => {
  const withClockMap = () =>
    withAssetSelectContext(
      <Map data-testid="map-test" options={MAP_OPTIONS}>
        <WfsDataProvider value={streetlightsJson as FeatureCollection}>
          <ClockLayer />
        </WfsDataProvider>
      </Map>,
      { ...assetSelectProviderValue }
    )

  it('should render the clock layer in the map', () => {
    render(withClockMap())
    expect(screen.getByTestId('map-test')).toBeInTheDocument()
  })
})
