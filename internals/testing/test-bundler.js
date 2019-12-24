import '@testing-library/jest-dom/extend-expect';
import L from 'leaflet-headless';
import 'core-js/stable';
import 'regenerator-runtime';
import 'url-polyfill';
import 'raf/polyfill';
import 'jest-localstorage-mock';

import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

// React 16 Enzyme adapter
Enzyme.configure({ adapter: new Adapter() });

global.window.L = L;
global.window.alert = msg => msg;

if (process.env.CI) {
  // prevent pollution of the build log when running tests in CI
  global.console.warn = () => {};
}

/**
 * Element.closest() polyfill
 *
 * Both Jest and JSDOM don't offer support for Element.closest()
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Element/closest}
 * @see {@link https://github.com/jsdom/jsdom/issues/1555}
 */
window.Element.prototype.closest = function closest(selector) {
  let el = this;
  while (el) {
    if (el.matches(selector)) {
      return el;
    }
    el = el.parentElement;
  }

  return el;
};
