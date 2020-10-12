import '@testing-library/jest-dom/extend-expect';
import L from 'leaflet';
import 'core-js/stable';
import 'regenerator-runtime';
import 'url-polyfill';
import 'jest-localstorage-mock';

import { JSDOM } from 'jsdom';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { enableFetchMocks } from 'jest-fetch-mock';
import { baseConfig } from '../scripts/helpers/config';

enableFetchMocks();

const globalAny: any = global;
globalAny.window.alert = (msg: string) => msg;
globalAny.process.env.API_ROOT = 'https://hart-en-ziel-api-root/';

const { window } = new JSDOM('<!DOCTYPE html><p>Hello world</p>', { pretendToBeVisual: true, resources: 'usable' });
globalAny.window = window;
globalAny.document = window._document;

if (process.env.CI) {
  // prevent pollution of the build log when running tests in CI
  globalAny.console.warn = () => {};
}

globalAny.document.createRange = () => ({
  setStart: () => {},
  setEnd: () => {},
  commonAncestorContainer: {
    nodeName: 'BODY',
    ownerDocument: document,
  },
});

const consoleWarningsFilter = [
  /Could not find icon/,
  /Warning: Can't perform a React state update on an unmounted component/,
  /Warning: An update to/,
];

// eslint-disable-next-line no-console
const originalConsoleError = console.error;

// eslint-disable-next-line no-console
console.error = (...args) => {
  if (consoleWarningsFilter.find(warning => warning.test(args[0]))) {
    return;
  }

  originalConsoleError(...args);
};

// React 16 Enzyme adapter
Enzyme.configure({ adapter: new Adapter() });

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
globalAny.window.L = L;

globalAny.window.CONFIG = baseConfig;

if (process.env.CI) {
  // prevent pollution of the build log when running tests in CI
  globalAny.console.warn = () => {};
}

globalAny.URL.createObjectURL = jest.fn(() => 'https://url-from-data/image.jpg');
globalAny.URL.revokeObjectURL = jest.fn();

const noop = () => {};
Object.defineProperty(globalAny.window, 'scrollTo', { value: noop, writable: true });
