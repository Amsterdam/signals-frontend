import React from 'react';
import { shallow } from 'enzyme';
import { Route } from 'react-router-dom';

import HeaderContainer from 'containers/HeaderContainer';
import Footer from 'components/Footer';
import { App } from './index';

describe('<App />', () => {
  const props = {
    requestCategories: jest.fn()
  };

  it('should render the header', () => {
    const wrapper = shallow(
      <App {...props} />
    );
    expect(wrapper.find(HeaderContainer).length).toBe(1);
  });

  it('should render some routes', () => {
    const wrapper = shallow(
      <App {...props} />
    );
    expect(wrapper.find(Route).length).not.toBe(0);
  });

  it('should render the footer', () => {
    const wrapper = shallow(
      <App {...props} />
    );
    expect(wrapper.find(Footer).length).toBe(1);
  });
});
