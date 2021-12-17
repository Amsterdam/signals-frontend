// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 Gemeente Amsterdam
import type { FeatureCollection } from 'geojson'

import { render, screen } from '@testing-library/react'
import { Map } from '@amsterdam/react-maps'
import MAP_OPTIONS from 'shared/services/configuration/map-options'

import streetlightsJson from 'utils/__tests__/fixtures/streetlights.json'
import { wegenVerkeerStraatmeubilair } from 'signals/incident/definitions/wizard-step-2-vulaan/wegen-verkeer-straatmeubilair'
import { WfsDataProvider } from 'signals/incident/components/form/MapSelectors/Asset/Selector/WfsLayer/context'
import type { AssetSelectValue } from 'signals/incident/components/form/MapSelectors/Asset/types'
import {
  contextValue,
  withAssetSelectContext,
} from 'signals/incident/components/form/MapSelectors/Asset/__tests__/context.test'
import ClockLayer from '../ClockLayer'

const { meta } = wegenVerkeerStraatmeubilair.extra_klok_nummer
const assetSelectProviderValue: AssetSelectValue = {
  ...contextValue,
  meta,
}

describe('ClockLayer', () => {
  const updateSpy = jest.fn()
  const withMapStreetlight = () =>
    withAssetSelectContext(
      <Map data-testid="map-test" options={MAP_OPTIONS}>
        <WfsDataProvider value={streetlightsJson as FeatureCollection}>
          <ClockLayer />
        </WfsDataProvider>
      </Map>,
      { ...assetSelectProviderValue, update: updateSpy }
    )

  it('should render the streetlight layer in the map', () => {
    render(withMapStreetlight())
    expect(screen.getByTestId('map-test')).toBeInTheDocument()
  })
})
