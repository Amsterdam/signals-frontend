// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 Gemeente Amsterdam
import type { FeatureCollection } from 'geojson'

import { render, screen } from '@testing-library/react'
import { Map } from '@amsterdam/react-maps'

import type {
  Feature,
  FeatureType,
} from 'signals/incident/components/form/MapSelectors/types'
import type { AssetSelectValue } from 'signals/incident/components/form/MapSelectors/Asset/types'

import streetlightsJson from 'utils/__tests__/fixtures/streetlights.json'
import MAP_OPTIONS from 'shared/services/configuration/map-options'
import straatverlichtingKlokken from 'signals/incident/definitions/wizard-step-2-vulaan/straatverlichting-klokken'
import { WfsDataProvider } from 'signals/incident/components/form/MapSelectors/Asset/Selector/WfsLayer/context'
import withAssetSelectContext, {
  contextValue,
} from 'signals/incident/components/form/MapSelectors/Asset/__tests__/withAssetSelectContext'
import reportedIconUrl from 'shared/images/icon-reported-marker.svg?url'
import StatusLayer from './StatusLayer'

const { meta } = straatverlichtingKlokken.extra_straatverlichting_nummer
const assetSelectProviderValue: AssetSelectValue = {
  ...contextValue,
  selection: undefined,
  meta,
}

const reportedFeatureType = {
  label: 'Is gemeld',
  description: 'Is gemeld',
  icon: {
    options: {},
    iconUrl: reportedIconUrl,
  },
  idField: 'objectnummer',
  typeField: 'objecttype',
  typeValue: 'reported',
  statusField: 'meldingstatus',
  statusValues: [1]
}

const checkedFeatureType = {
  label: 'Storing status',
  description: 'Storing status',
  icon: {
    options: {},
    iconUrl: reportedIconUrl,
  },
  idField: 'objectnummer',
  typeField: 'objecttype',
  typeValue: 'checked',
  statusField: 'storingstatus',
  statusValues: [1]
}

const statusFeatures = streetlightsJson.features.filter(
  (feature) => feature.properties?.meldingstatus === 1 || feature.properties?.storingstatus === 1
)

describe('StatusLayer', () => {
  const withMapStreetlights = () =>
    withAssetSelectContext(
      <Map data-testid="map-test" options={MAP_OPTIONS}>
        <WfsDataProvider value={streetlightsJson as FeatureCollection}>
          {statusFeatures?.length > 0 && reportedFeatureType && checkedFeatureType && (
            <StatusLayer
              statusFeatures={statusFeatures as Feature[]}
              reportedFeatureType={reportedFeatureType as FeatureType}
              checkedFeatureType={checkedFeatureType as FeatureType}
            />
          )}
        </WfsDataProvider>
      </Map>,
      { ...assetSelectProviderValue }
    )

  it('should render the status layer in the map', () => {
    render(withMapStreetlights())
    const featureId =
      (statusFeatures && statusFeatures[0].properties['objectnummer']) || ''
    const description = `${reportedFeatureType?.description} - ${featureId}`
    expect(screen.getByAltText(description)).toBeInTheDocument()
  })
})
