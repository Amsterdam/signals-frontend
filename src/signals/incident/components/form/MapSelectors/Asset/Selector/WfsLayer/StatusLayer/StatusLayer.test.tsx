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

import caterpillarsJson from 'utils/__tests__/fixtures/caterpillars.json'
import { meta, selection } from 'utils/__tests__/fixtures/caterpillarsSelection'

import MAP_OPTIONS from 'shared/services/configuration/map-options'
import { WfsDataProvider } from 'signals/incident/components/form/MapSelectors/Asset/Selector/WfsLayer/context'
import withAssetSelectContext, {
  contextValue,
} from 'signals/incident/components/form/MapSelectors/Asset/__tests__/withAssetSelectContext'
import StatusLayer from './StatusLayer'

const assetSelectProviderValue: AssetSelectValue = {
  ...contextValue,
  selection: selection[0],
  meta,
}

const reportedFeatureType = meta.featureTypes.find(
  ({ typeValue }) => typeValue === 'reported'
)
const checkedFeatureType = meta.featureTypes.find(
  ({ typeValue }) => typeValue === 'checked'
)

const statusFeatures = caterpillarsJson.features.filter(
  (feature) =>
    Boolean(
      reportedFeatureType?.isReportedField &&
        feature.properties['AMS_Meldingstatus'] ===
          reportedFeatureType?.isReportedValue
    ) ||
    Boolean(
      checkedFeatureType?.isCheckedField &&
        checkedFeatureType.isCheckedValues?.includes(
          feature.properties['Registratie']
        )
    )
)

describe('StatusLayer', () => {
  const withMapCaterpillar = () =>
    withAssetSelectContext(
      <Map data-testid="map-test" options={MAP_OPTIONS}>
        <WfsDataProvider value={caterpillarsJson as FeatureCollection}>
          {statusFeatures?.length > 0 &&
            reportedFeatureType &&
            checkedFeatureType && (
              <StatusLayer
                statusFeatures={statusFeatures as unknown as Feature[]}
                reportedFeatureType={reportedFeatureType as FeatureType}
                checkedFeatureType={checkedFeatureType as FeatureType}
              />
            )}
        </WfsDataProvider>
      </Map>,
      { ...assetSelectProviderValue }
    )

  it('should render reported and checked features in the map', () => {
    render(withMapCaterpillar())
    const reportedFeatureId = statusFeatures[0].properties['OBJECTID']
    const reportedDescription = `${reportedFeatureType?.description} - ${reportedFeatureId}`
    expect(screen.getByAltText(reportedDescription)).toBeInTheDocument()

    const checkedFeatureId = statusFeatures[2].properties['OBJECTID']
    const checkedDescription = `${checkedFeatureType?.description} - ${checkedFeatureId}`
    expect(screen.getByAltText(checkedDescription)).toBeInTheDocument()
  })
})
