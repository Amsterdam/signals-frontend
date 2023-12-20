// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam
import { act, renderHook } from '@testing-library/react-hooks'
import * as reactRedux from 'react-redux'

import reverseGeocoderService from 'shared/services/reverse-geocoder'

import { useSelectionProps } from './useSelectionProps'
import { FeatureStatus } from '../../../types'
import type { AssetListProps } from '../AssetList'
jest.mock('shared/services/reverse-geocoder')

const mockLatLng = { lat: 10, lng: 20 }
const mockAddress = {
  postcode: '1000 AA',
  huisnummer: '100',
  woonplaats: 'Amsterdam',
  openbare_ruimte: 'West',
}
const geocodedResponse = {
  id: 'foo',
  value: 'bar',
  data: {
    location: mockLatLng,
    address: mockAddress,
  },
}

describe('useSelectionProps', () => {
  const featureTypes = [
    {
      label: 'Restafval',
      description: 'Restafval container',
      icon: {
        options: {},
        iconUrl: '',
      },
      idField: 'id',
      typeField: 'fractie_omschrijving',
      typeValue: 'Rest',
    },
  ]

  const featureStatusTypes = [
    {
      label: 'Is gemeld',
      description: 'Object is reeds gemeld',
      icon: {
        options: {},
        iconUrl: '',
      },
      idField: 'OBJECTID',
      typeValue: FeatureStatus.REPORTED,
      typeField: '',
      statusField: 'AMS_Meldingstatus',
      statusValues: [1],
    },
  ]
  const props: AssetListProps = {
    remove: jest.fn(),
    featureTypes: featureTypes,
    featureStatusTypes,
    selection: [
      {
        description: 'Description',
        id: '234',
        type: 'Rest',
        location: {},
        label: 'Rest container - 234',
        coordinates: { lat: 1, lng: 2 },
      },
    ],
    selectableFeatures: [
      {
        type: 'Feature',
        id: '123',
        coordinates: { lat: 2, lng: 1 },
        status: FeatureStatus.REPORTED,
        label: 'Rest container - 123',
        description: 'Rest',
      },
    ],
  }

  beforeEach(() => {
    jest
      .spyOn(reactRedux, 'useSelector')
      .mockReturnValue({ makeSelectMaxAssetWarning: false })
  })

  it('should give a result', async () => {
    jest.mocked(reverseGeocoderService).mockImplementation(async () => {
      return geocodedResponse
    })

    const result = renderHook(() =>
      useSelectionProps({
        featureTypes: props.featureTypes,
        featureStatusTypes: props.featureStatusTypes,
        feature: props?.selectableFeatures?.[0] as any,
        selection: [],
      })
    )

    act(() => {
      result.result.current?.onClick()
    })

    expect(result.result.current?.id).toBe('123')

    expect(reverseGeocoderService).toHaveBeenCalledWith({ lat: 2, lng: 1 })
  })

  it('should not give a result', () => {
    const result = renderHook(() =>
      useSelectionProps({
        featureTypes: props.featureTypes,
        featureStatusTypes: props.featureStatusTypes,
        feature: props?.selectableFeatures?.[0] as any,
        selection: [
          {
            description: 'Description',
            id: '123',
            type: 'Rest',
            location: {},
            label: 'Rest container - 234',
            coordinates: { lat: 1, lng: 2 },
          },
        ],
      })
    )

    expect(result.result.current).toBeFalsy()
  })
})
