// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 Gemeente Amsterdam
import type { FeatureCollection } from 'geojson'

import { render, screen } from '@testing-library/react'
import { Map } from '@amsterdam/react-maps'
import MAP_OPTIONS from 'shared/services/configuration/map-options'

import streetlightsJson from 'utils/__tests__/fixtures/streetlights.json'
import straatverlichtingKlokken from 'signals/incident/definitions/wizard-step-2-vulaan/straatverlichting-klokken'
import { WfsDataProvider } from 'signals/incident/components/form/MapSelectors/Asset/Selector/WfsLayer/context'
import type { AssetSelectValue } from 'signals/incident/components/form/MapSelectors/Asset/types'
import withAssetSelectContext, {
  contextValue,
} from 'signals/incident/components/form/MapSelectors/Asset/__tests__/withAssetSelectContext'
import { FeatureStatus } from '../../types'
import StreetlightLayer from './StreetlightLayer'

const { meta } = straatverlichtingKlokken.extra_straatverlichting_nummer
const assetSelectProviderValue: AssetSelectValue = {
  ...contextValue,
  selection: [{
    id: '031346',
    type: '4',
    description: 'Overig lichtpunt',
    status: FeatureStatus.REPORTED,
    location: {},
    label: 'Overig lichtpunt - 031346',
  }],
  meta,
}

describe('StreetlightLayer', () => {
  const withMapStreetlight = () =>
    withAssetSelectContext(
      <Map data-testid="map-test" options={MAP_OPTIONS}>
        <WfsDataProvider value={streetlightsJson as FeatureCollection}>
          <StreetlightLayer />
        </WfsDataProvider>
      </Map>,
      { ...assetSelectProviderValue }
    )

  it('should render the streetlight layer in the map', () => {
    render(withMapStreetlight())
    expect(screen.getByTestId('map-test')).toBeInTheDocument()
  })
})
