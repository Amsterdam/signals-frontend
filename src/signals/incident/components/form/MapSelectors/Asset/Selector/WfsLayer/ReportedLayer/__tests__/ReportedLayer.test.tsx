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
import withAssetSelectContext, {
  contextValue,
} from 'signals/incident/components/form/MapSelectors/Asset/__tests__/withAssetSelectContext'
import * as verlichtingIcons from 'signals/incident/definitions/wizard-step-2-vulaan/verlichting-icons'
import ReportedLayer from '../ReportedLayer'

const { meta } = wegenVerkeerStraatmeubilair.extra_straatverlichting_nummer
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
    iconSvg: verlichtingIcons.reported,
    selectedIconSvg: verlichtingIcons.reported,
  },
  idField: 'objectnummer',
  typeField: 'objecttype',
  typeValue: 'reported',
}

const reportedFeatures = streetlightsJson.features.filter(
  (feature) => feature.properties?.meldingstatus === 1
)

describe('ReportedLayer', () => {
  const withMapStreetlights = () =>
    withAssetSelectContext(
      <Map data-testid="map-test" options={MAP_OPTIONS}>
        <WfsDataProvider value={streetlightsJson as FeatureCollection}>
          {reportedFeatures?.length > 0 && reportedFeatureType && (
            <ReportedLayer
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              reportedFeatures={reportedFeatures}
              reportedFeatureType={reportedFeatureType}
            />
          )}
        </WfsDataProvider>
      </Map>,
      { ...assetSelectProviderValue }
    )

  it('should render the reported layer in the map', () => {
    render(withMapStreetlights())
    const featureId =
      (reportedFeatures && reportedFeatures[0].properties['objectnummer']) || ''
    const description = `${reportedFeatureType?.description} - ${featureId}`
    expect(screen.getByAltText(description)).toBeInTheDocument()
  })
})
