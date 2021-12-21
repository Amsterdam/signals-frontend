import ReactDOM from 'react-dom'
import type { ReactNode, ReactPortal } from 'react'

import { withAppContext } from 'test/utils'
import { controls } from 'signals/incident/definitions/wizard-step-2-vulaan/afval'

import type { AssetSelectValue } from '../types'
import { AssetSelectProvider } from '../context'

ReactDOM.createPortal = (node) => node as ReactPortal

const { endpoint, featureTypes } = controls.extra_container.meta

export const contextValue: AssetSelectValue = {
  coordinates: { lat: 25.3546456, lng: 3.45645645 },
  close: jest.fn(),
  edit: jest.fn(),
  meta: { endpoint, featureTypes },
  removeItem: jest.fn(),
  selection: {
    location: {
      coordinates: { lat: 0, lng: 0 },
    },
    description: 'Plastic asset',
    id: 'PL734',
    type: 'plastic',
  },
  setItem: jest.fn(),
  fetchLocation: jest.fn(),
  setLocation: jest.fn(),
  setMessage: jest.fn(),
}

const withAssetSelectContext = (Component: ReactNode, context = contextValue) =>
  withAppContext(
    <AssetSelectProvider value={context}>
      <div id="app">{Component}</div>
    </AssetSelectProvider>
  )

export default withAssetSelectContext
