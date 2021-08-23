// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Gemeente Amsterdam
require('@testing-library/jest-dom')
require('@testing-library/jest-dom/extend-expect')

const L = require('leaflet')
require('core-js/stable')
require('regenerator-runtime')
require('url-polyfill')
require('jest-localstorage-mock')

const { configure } = require('@testing-library/react')
const { JSDOM } = require('jsdom')
const Enzyme = require('enzyme')
const Adapter = require('@wojtekmaj/enzyme-adapter-react-17')
const fetchMock = require('jest-fetch-mock')

const { baseConfig } = require('../scripts/helpers/config')

fetchMock.enableMocks()

configure({
  showOriginalStackTrace: true,
  asyncUtilTimeout: 10000,
})

// React Enzyme adapter
Enzyme.configure({ adapter: new Adapter() })

const globalAny = global
const { window } = new JSDOM('<!DOCTYPE html><p>Hello world</p>', {
  pretendToBeVisual: true,
  resources: 'usable',
})
globalAny.document = window.document
globalAny.navigator.geolocation = {}

globalAny.window = window
globalAny.window.alert = (msg) => msg
globalAny.window.CONFIG = baseConfig

// Monkey patch Leaflet
const originalInit = L.Map.prototype.initialize
L.Map.prototype.initialize = function initialize(id, options) {
  const extendedOptions = L.extend(options || {}, {
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
