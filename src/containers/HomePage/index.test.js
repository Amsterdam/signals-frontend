/**
 * Test the HomePage
 */

import React from 'react';
import { shallow } from 'enzyme';
import { IntlProvider } from 'react-intl';

import { HomePage } from './index';

describe('<HomePage />', () => {
  it('should render in a language container', () => {
    const component = shallow(
      <IntlProvider locale="nl">
        <HomePage />
      </IntlProvider>
    ).dive();
    expect(component.find(<HomePage />)).toBeTruthy();
  });
});
