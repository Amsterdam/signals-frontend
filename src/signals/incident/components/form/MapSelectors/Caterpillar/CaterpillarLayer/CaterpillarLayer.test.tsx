// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 - 2022 Gemeente Amsterdam
import { render, screen } from '@testing-library/react'
import { Map } from '@amsterdam/react-maps'

import type { FeatureCollection } from 'geojson'
import type { AssetSelectValue } from 'signals/incident/components/form/MapSelectors/Asset/types'
import type { Geometrie } from 'types/incident'

import caterpillarsJson from 'utils/__tests__/fixtures/caterpillars.json'
import { selection } from 'utils/__tests__/fixtures/caterpillarsSelection'
import { controls } from 'signals/incident/definitions/wizard-step-2-vulaan/eikenprocessierups'

import MAP_OPTIONS from 'shared/services/configuration/map-options'
import userEvent from '@testing-library/user-event'
import type { Meta } from 'signals/incident/components/form/MapSelectors/types'

import { WfsDataProvider } from 'signals/incident/components/form/MapSelectors/Asset/Selector/WfsLayer/context'
import { featureToCoordinates } from 'shared/services/map-location'

import { FeatureStatus } from 'signals/incident/components/form/MapSelectors/types'
import withAssetSelectContext, {
  contextValue,
} from '../../Asset/__tests__/withAssetSelectContext'
import CaterpillarLayer from '.'

const typedMeta = controls.extra_eikenprocessierups.meta as unknown as Meta
const assetSelectProviderValue: AssetSelectValue = {
  ...contextValue,
  selection: selection[0],
  meta: typedMeta,
}

describe('CaterpillarLayer', () => {
  const setItem = jest.fn()
  const removeItem = jest.fn()

  const withMapCaterpillar = (contextOverride = {}) =>
    withAssetSelectContext(
      <Map data-testid="map-test" options={MAP_OPTIONS}>
        <WfsDataProvider value={caterpillarsJson as FeatureCollection}>
          <CaterpillarLayer />
        </WfsDataProvider>
      </Map>,
      { ...assetSelectProviderValue, setItem, removeItem, ...contextOverride }
    )

  afterEach(() => {
    setItem.mockReset()
    removeItem.mockReset()
  })

  it('should render the caterpillar layer in the map', () => {
    render(withMapCaterpillar())
    expect(
      screen.getByAltText('Eikenboom, is geselecteerd (308777)')
    ).toBeInTheDocument()
    expect(
      screen.getByAltText('Eikenboom is reeds gemeld (308778)')
    ).toBeInTheDocument()
    expect(
      screen.getByAltText('Vrij van eikenprocessierups (308780)')
    ).toBeInTheDocument()

    expect(screen.getByTestId('map-test')).toBeInTheDocument()
  })

  it('should handle selecting a tree', async () => {
    const featureId = 308778
    const feature = caterpillarsJson.features.find(({ id }) => id === featureId)
    const coordinates = featureToCoordinates(feature?.geometry as Geometrie)

    const { rerender } = render(withMapCaterpillar())

    const tree = screen.getByAltText(`Eikenboom is reeds gemeld (${featureId})`)

    userEvent.click(tree)

    expect(setItem).toHaveBeenCalledWith(
      {
        id: featureId,
        status: FeatureStatus.REPORTED,
        description: 'Eikenboom',
        type: 'Eikenboom',
        GlobalID: feature?.properties.GlobalID,
        coordinates,
        label: `Eikenboom - ${featureId}`,
      },
      { coordinates }
    )

    expect(
      screen.queryByAltText(
        `Eikenboom is reeds gemeld, is geselecteerd (${featureId})`
      )
    ).not.toBeInTheDocument()

    rerender(
      withMapCaterpillar({
        selection: selection.find(({ id }) => id === featureId),
      })
    )

    expect(
      screen.getByAltText(
        `Eikenboom is reeds gemeld, is geselecteerd (${featureId})`
      )
    ).toBeInTheDocument()
  })

  it('should handle deselecting a tree', () => {
    const featureId = 308778
    const selected = selection.find(({ id }) => id === featureId)

    render(
      withMapCaterpillar({
        selection: selected,
      })
    )

    const tree = screen.getByAltText(
      `Eikenboom is reeds gemeld, is geselecteerd (${308778})`
    )

    userEvent.click(tree)

    expect(removeItem).toHaveBeenCalled()
    expect(setItem).not.toHaveBeenCalled()
  })
})
