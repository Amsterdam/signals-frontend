import '@testing-library/jest-dom';
import L from 'leaflet';
import 'core-js/stable';
import 'regenerator-runtime';
import 'url-polyfill';
import 'jest-localstorage-mock';

import { JSDOM } from 'jsdom';
import Enzyme from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import fetchMock from 'jest-fetch-mock';

import { baseConfig } from '../scripts/helpers/config';

fetchMock.enableMocks();

// React 16 Enzyme adapter
Enzyme.configure({ adapter: new Adapter() });

// Custom JSDOM
const { window } = new JSDOM('<!DOCTYPE html><p>Hello world</p>', { pretendToBeVisual: true, resources: 'usable' });
global.document = window.document;
global.navigator.geolocation = {};

global.window = window;
global.window.alert = msg => msg;
global.window.CONFIG = baseConfig;

// Monkey patch Leaflet
const originalInit = L.Map.prototype.initialize;
L.Map.prototype.initialize = function initialize(id, options) {
  const extendedOptions = L.extend(options || {}, {
    fadeAnimation: false,
    zoomAnimation: false,
    markerZoomAnimation: false,
    preferCanvas: true,
  });

  return originalInit.call(this, id, extendedOptions);
};
global.window.L = L;

if (process.env.CI) {
  // prevent pollution of the build log when running tests in CI
  global.console.warn = () => {};
}

global.URL.createObjectURL = jest.fn(() => 'https://url-from-data/image.jpg');
global.URL.revokeObjectURL = jest.fn();

const noop = () => {};
Object.defineProperty(global.window, 'scrollTo', { value: noop, writable: true });

