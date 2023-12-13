// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 - 2023 Gemeente Amsterdam
import type { ReactNode, ReactPortal } from 'react'

import ReactDOM from 'react-dom'

import { controls } from 'signals/incident/definitions/wizard-step-2-vulaan/afval-container'
import { withAppContext } from 'test/utils'

import { AssetSelectProvider } from '../context'
import type { AssetSelectValue } from '../types'

ReactDOM.createPortal = (node) => node as ReactPortal

const { endpoint, featureTypes } = controls.extra_container.meta

export const contextValue: AssetSelectValue = {
  coordinates: { lat: 25.3546456, lng: 3.45645645 },
  meta: {
    endpoint,
    featureTypes,
    featureStatusTypes: [],
    language: {
      objectTypeSingular: 'container',
      objectTypePlural: 'containers',
    },
  },
  removeItem: jest.fn(),
  selection: [
    {
      location: {
        coordinates: { lat: 0, lng: 0 },
      },
      description: 'Plastic asset',
      id: 'PL734',
      type: 'plastic',
      label: 'Plastic container - PL734',
    },
  ],
  address: {
    openbare_ruimte: 'Nieuwezijds Voorburgwal',
    huisnummer: '147',
    postcode: '1012RJ',
    woonplaats: 'Amsterdam',
  },
  selectableFeatures: undefined,
  setItem: jest.fn(),
  fetchLocation: jest.fn(),
  setLocation: jest.fn(),
  setMessage: jest.fn(),
  setSelectableFeatures: jest.fn(),
}

const withAssetSelectContext = (Component: ReactNode, context = contextValue) =>
  withAppContext(
    <AssetSelectProvider value={context}>
      <div id="app">{Component}</div>
    </AssetSelectProvider>
  )

export default withAssetSelectContext
