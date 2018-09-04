import React from 'react';
import { shallow } from 'enzyme';
import { Route } from 'react-router-dom';

import App from '../index';

describe('<App />', () => {
  it('should render some routes', () => {
    const wrapper = shallow(
      <App />
    );
    expect(wrapper.find(Route).length).not.toBe(0);
  });
});
