// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 Gemeente Amsterdam
import { render } from '@testing-library/react'
import AssetList from 'signals/incident/components/form/MapSelectors/Asset/AssetList'
import type { FeatureType } from 'signals/incident/components/form/MapSelectors/types'

import AssetListPreview from './AssetListPreview'
import type { AssetListPreviewProps } from './AssetListPreview'

jest.mock('signals/incident/components/form/MapSelectors/Asset/AssetList', () =>
  jest.fn().mockImplementation(() => null)
)

describe('AssetListPreview', () => {
  it('should render AssetList with props', () => {
    const props: AssetListPreviewProps = {
      value: {
        id: 'id',
        type: 'type',
        description: 'description',
        location: {
          address: {
            postcode: '1234AB',
            huisnummer: 1,
            woonplaats: 'Hole in the ground',
            openbare_ruimte: '',
          },
          coordinates: {
            lat: 0.12,
            lng: 12.0,
          },
        },
        label: 'description - id',
      },
      featureTypes: [
        {
          typeField: 'type',
          typeValue: 'type',
          icon: {
            iconUrl: 'svg',
          },
        } as FeatureType,
      ],
      featureStatusTypes: [],
    }

    render(
      <AssetListPreview
        value={props.value}
        featureTypes={props.featureTypes}
        featureStatusTypes={[]}
      />
    )
    expect(AssetList).toHaveBeenCalledWith(
      expect.objectContaining({
        selection: props.value,
        featureTypes: props.featureTypes,
      }),
      {}
    )
  })
})
