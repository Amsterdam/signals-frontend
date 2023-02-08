// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 - 2022 Gemeente Amsterdam

import { Map } from '@amsterdam/react-maps'
import { render, screen } from '@testing-library/react'
import type { FeatureCollection } from 'geojson'

import MAP_OPTIONS from 'shared/services/configuration/map-options'
import withAssetSelectContext, {
  contextValue,
} from 'signals/incident/components/form/MapSelectors/Asset/__tests__/withAssetSelectContext'
import { WfsDataProvider } from 'signals/incident/components/form/MapSelectors/Asset/Selector/WfsLayer/context'
import type { AssetSelectValue } from 'signals/incident/components/form/MapSelectors/Asset/types'
import type { Feature } from 'signals/incident/components/form/MapSelectors/types'
import type { Meta } from 'signals/incident/components/form/MapSelectors/types'
import { FeatureStatus } from 'signals/incident/components/form/MapSelectors/types'
import { controls } from 'signals/incident/definitions/wizard-step-2-vulaan/eikenprocessierups'
import caterpillarsJson from 'utils/__tests__/fixtures/caterpillars.json'
import { selection } from 'utils/__tests__/fixtures/caterpillarsSelection'

import StatusLayer from './StatusLayer'
import { getFeatureStatusType } from './utils'

const typedMeta = controls.extra_eikenprocessierups.meta as unknown as Meta
const assetSelectProviderValue: AssetSelectValue = {
  ...contextValue,
  selection: selection,
  meta: typedMeta,
}

const featureStatusTypes = typedMeta.featureStatusTypes || []

const statusFeatures = caterpillarsJson.features.filter(
  (feature) => getFeatureStatusType(feature, featureStatusTypes) !== undefined
)

describe('StatusLayer', () => {
  const reportedFeatureId = statusFeatures[0].properties['OBJECTID']
  const reportedFeatureType = featureStatusTypes.find(
    ({ typeValue }) => typeValue === FeatureStatus.REPORTED
  )
  const reportedDescription = `${reportedFeatureType?.description} - ${reportedFeatureId}`

  const checkedFeatureId = statusFeatures[2].properties['OBJECTID']
  const checkedFeatureType = featureStatusTypes.find(
    ({ typeValue }) => typeValue === FeatureStatus.CHECKED
  )
  const checkedDescription = `${checkedFeatureType?.description} - ${checkedFeatureId}`

  describe('it renders correctly', () => {
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

      expect(screen.getByAltText(reportedDescription)).toBeInTheDocument()
      expect(screen.getByAltText(checkedDescription)).toBeInTheDocument()
    })

    it('To render Asset layer icons in the correct location with respect to the status icons, featureTypes should have the proper iconSize', () => {
      const iconSize = typedMeta.featureTypes[0].icon?.options?.iconSize
      expect(iconSize).toEqual([40, 40])
    })
  })

  describe('no featureStatusType', () => {
    const mapWithoutFeatureStatusTypes = () =>
      withAssetSelectContext(
        <Map data-testid="map-test" options={MAP_OPTIONS}>
          <WfsDataProvider value={caterpillarsJson as FeatureCollection}>
            <StatusLayer
              statusFeatures={statusFeatures as Feature[]}
              featureStatusTypes={[]}
            />
          </WfsDataProvider>
        </Map>,
        { ...assetSelectProviderValue }
      )

    it('does not render a status layer', () => {
      render(mapWithoutFeatureStatusTypes())
      expect(screen.queryByAltText(reportedDescription)).not.toBeInTheDocument()
      expect(screen.queryByAltText(checkedDescription)).not.toBeInTheDocument()
    })
  })
})
