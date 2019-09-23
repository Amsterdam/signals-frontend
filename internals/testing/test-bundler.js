// needed for regenerator-runtime
// (ES7 generator support is required by redux-saga)
import '@babel/polyfill';

import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

// React 16 Enzyme adapter
Enzyme.configure({ adapter: new Adapter() });

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
