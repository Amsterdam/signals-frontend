// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 Gemeente Amsterdam
import type { FeatureCollection } from 'geojson'

import { render, screen } from '@testing-library/react'
import { Map } from '@amsterdam/react-maps'

import streetlightsJson from 'utils/__tests__/fixtures/streetlights.json'
import MAP_OPTIONS from 'shared/services/configuration/map-options'
import type { AssetSelectValue } from 'signals/incident/components/form/MapSelectors/Asset/types'
import { wegenVerkeerStraatmeubilair } from 'signals/incident/definitions/wizard-step-2-vulaan/wegen-verkeer-straatmeubilair'
import { WfsDataProvider } from 'signals/incident/components/form/MapSelectors/Asset/Selector/WfsLayer/context'
import {
  contextValue,
  withAssetSelectContext,
} from 'signals/incident/components/form/MapSelectors/Asset/__tests__/context.test'
import ReportedLayer from '../ReportedLayer'

const { meta } = wegenVerkeerStraatmeubilair.extra_straatverlichting_nummer
const assetSelectProviderValue: AssetSelectValue = {
  ...contextValue,
  selection: [],
  meta,
}

describe('ReportedLayer', () => {
  const updateSpy = jest.fn()
  const withMapStreetlights = () =>
    withAssetSelectContext(
      <Map data-testid="map-test" options={MAP_OPTIONS}>
        <WfsDataProvider value={streetlightsJson as FeatureCollection}>
          <ReportedLayer featureTypes={meta.featureTypes} desktopView />;
        </WfsDataProvider>
      </Map>,
      { ...assetSelectProviderValue, update: updateSpy }
    )

  it('should render the reported layer in the map', () => {
    render(withMapStreetlights())
    const reportedFeature = streetlightsJson.features.find(
      (feature) => feature.properties.meldingstatus === 1
    )
    const reportedFeatureType = meta.featureTypes.find(
      (featureType) => featureType.typeValue === 'reported'
    )
    const featureId = reportedFeature?.properties['objectnummer']

    const description = `${reportedFeatureType?.description} - ${featureId}`
    expect(screen.getByAltText(description)).toBeInTheDocument()
  })
})
