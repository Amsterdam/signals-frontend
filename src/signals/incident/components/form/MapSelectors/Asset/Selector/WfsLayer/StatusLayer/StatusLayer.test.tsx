// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 Gemeente Amsterdam
import type { FeatureCollection } from 'geojson'

import { render, screen } from '@testing-library/react'
import { Map } from '@amsterdam/react-maps'

import type { Feature } from 'signals/incident/components/form/MapSelectors/types'
import type { AssetSelectValue } from 'signals/incident/components/form/MapSelectors/Asset/types'

import caterpillarsJson from 'utils/__tests__/fixtures/caterpillars.json'
import { selection } from 'utils/__tests__/fixtures/caterpillarsSelection'

import MAP_OPTIONS from 'shared/services/configuration/map-options'
import { WfsDataProvider } from 'signals/incident/components/form/MapSelectors/Asset/Selector/WfsLayer/context'
import withAssetSelectContext, {
  contextValue,
} from 'signals/incident/components/form/MapSelectors/Asset/__tests__/withAssetSelectContext'
import type { Meta } from 'signals/incident/components/form/MapSelectors/types'
import { controls } from 'signals/incident/definitions/wizard-step-2-vulaan/openbaarGroenEnWater'
import StatusLayer from './StatusLayer'
import { getFeatureStatusType } from './utils'

const typedMeta = controls.extra_eikenprocessierups.meta as unknown as Meta
const assetSelectProviderValue: AssetSelectValue = {
  ...contextValue,
  selection: selection[0],
  meta: typedMeta,
}

const featureStatusTypes = typedMeta.featureStatusTypes || []

const statusFeatures = caterpillarsJson.features.filter(
  (feature) =>
    getFeatureStatusType(feature as Feature, featureStatusTypes) !== undefined
)

describe('StatusLayer', () => {
  const withMapCaterpillar = () =>
    withAssetSelectContext(
      <Map data-testid="map-test" options={MAP_OPTIONS}>
        <WfsDataProvider value={caterpillarsJson as FeatureCollection}>
          <StatusLayer
            statusFeatures={statusFeatures as Feature[]}
            featureStatusTypes={featureStatusTypes}
          />
        </WfsDataProvider>
      </Map>,
      { ...assetSelectProviderValue }
    )

  it('should render reported and checked features in the map', () => {
    render(withMapCaterpillar())
    const reportedFeatureId = statusFeatures[0].properties['OBJECTID']
    const reportedFeatureType = featureStatusTypes.find(
      ({ typeValue }) => typeValue === 'reported'
    )
    const reportedDescription = `${reportedFeatureType?.description} - ${reportedFeatureId}`
    expect(screen.getByAltText(reportedDescription)).toBeInTheDocument()

    const checkedFeatureId = statusFeatures[2].properties['OBJECTID']
    const checkedFeatureType = featureStatusTypes.find(
      ({ typeValue }) => typeValue === 'checked'
    )
    const checkedDescription = `${checkedFeatureType?.description} - ${checkedFeatureId}`
    expect(screen.getByAltText(checkedDescription)).toBeInTheDocument()
  })

  it('To render Asset layer icons in the correct location with respect to the status icons, featureTypes should have the proper iconSize', () => {
    const iconSize = typedMeta.featureTypes[0].icon?.options?.iconSize
    expect(iconSize).toEqual([40, 40])
  })
})
