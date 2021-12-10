// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 Gemeente Amsterdam
import type { FeatureCollection } from 'geojson'

import { render, screen } from '@testing-library/react'
import { Map } from '@amsterdam/react-maps'
import MAP_OPTIONS from 'shared/services/configuration/map-options'

import streetlightsJson from 'utils/__tests__/fixtures/streetlights.json'
import { wegenVerkeerStraatmeubilair } from 'signals/incident/definitions/wizard-step-2-vulaan/wegen-verkeer-straatmeubilair'
import { WfsDataProvider } from 'signals/incident/components/form/MapSelectors/Asset/Selector/WfsLayer/context'
import { AssetSelectValue } from 'signals/incident/components/form/MapSelectors/Asset/types'
import {
  contextValue,
  withAssetSelectContext,
} from 'signals/incident/components/form/MapSelectors/Asset/__tests__/context.test'
import StreetlightLayer from '../StreetlightLayer'

const { meta } = wegenVerkeerStraatmeubilair.extra_straatverlichting_nummer
const assetSelectProviderValue: AssetSelectValue = {
  ...contextValue,
  selection: [
    {
      id: '031346',
      type: '4',
      description: 'Overig lichtpunt',
      isReported: true,
    },
    {
      id: '27235',
      type: '4',
      description: 'Overig lichtpunt',
      isReported: false,
    },
  ],
  meta,
}

describe('StreetlightLayer', () => {
  const updateSpy = jest.fn()
  const withMapStreetlight = () =>
    withAssetSelectContext(
      <Map data-testid="map-test" options={MAP_OPTIONS}>
        <WfsDataProvider value={streetlightsJson as FeatureCollection}>
          <StreetlightLayer />
        </WfsDataProvider>
      </Map>,
      { ...assetSelectProviderValue, update: updateSpy }
    )

  it('should render the streetlight layer in the map', () => {
    render(withMapStreetlight())
    expect(screen.getByTestId('map-test')).toBeInTheDocument()
  })
})
