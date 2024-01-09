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
import straatverlichtingKlokken from 'signals/incident/definitions/wizard-step-2-vulaan/straatverlichting-klokken'
import streetlightsJson from 'utils/__tests__/fixtures/streetlights.json'

import ClockLayer from './ClockLayer'
import type { Meta } from '../../types'
import { FeatureStatus } from '../../types'

const typedMeta = straatverlichtingKlokken.extra_klok_nummer
  .meta as unknown as Meta

const assetSelectProviderValue: AssetSelectValue = {
  ...contextValue,
  selection: [
    {
      id: '79522',
      type: '1',
      description: 'Klok',
      status: FeatureStatus.REPORTED,
      location: {},
      label: 'Klok - 79522',
    },
  ],
  meta: typedMeta,
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
