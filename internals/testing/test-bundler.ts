// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Gemeente Amsterdam
import '@testing-library/jest-dom'
import '@testing-library/jest-dom/extend-expect'

import L from 'leaflet'
import 'core-js/stable'
import 'regenerator-runtime'
import 'url-polyfill'
import 'jest-localstorage-mock'
import 'jest-styled-components'

import { JSDOM } from 'jsdom'
import Enzyme from 'enzyme'
import Adapter from '@wojtekmaj/enzyme-adapter-react-17'
import fetchMock from 'jest-fetch-mock'

import { baseConfig } from '../scripts/helpers/config'

fetchMock.enableMocks()

// React Enzyme adapter
Enzyme.configure({ adapter: new Adapter() })

const globalAny = global as any
const { window } = new JSDOM('<!DOCTYPE html><p>Hello world</p>', {
  pretendToBeVisual: true,
  resources: 'usable',
})
globalAny.document = window.document
globalAny.navigator.geolocation = {}

globalAny.window = window
globalAny.window.alert = (msg: string) => msg
globalAny.window.CONFIG = baseConfig

// Monkey patch Leaflet
const originalInit = (L.Map as any).prototype.initialize
;(L.Map as any).prototype.initialize = function initialize(
  id: any,
  options: any
) {
  const extendedOptions = (L as any).extend(options || {}, {
    fadeAnimation: false,
    zoomAnimation: false,
    markerZoomAnimation: false,
    preferCanvas: true,
  })

  return originalInit.call(this, id, extendedOptions)
}
globalAny.window.L = L

if (process.env.CI) {
  // prevent pollution of the build log when running tests in CI
  globalAny.console.warn = () => {}
}

globalAny.URL.createObjectURL = jest.fn(() => 'https://url-from-data/image.jpg')
globalAny.URL.revokeObjectURL = jest.fn()

const noop = () => {}
Object.defineProperty(globalAny.window, 'scrollTo', {
  value: noop,
  writable: true,
})

globalAny.document.createRange = () => ({
  setStart: () => {},
  setEnd: () => {},
  commonAncestorContainer: {
    nodeName: 'BODY',
    ownerDocument: document,
  },
})
