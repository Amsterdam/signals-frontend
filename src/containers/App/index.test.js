import React from 'react';
import { shallow } from 'enzyme';
import { Route } from 'react-router-dom';

import HeaderContainer from 'containers/HeaderContainer';
import Footer from 'components/Footer';
import { App, mapDispatchToProps } from './index';
import { REQUEST_CATEGORIES } from './constants';

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

  describe('mapDispatchToProps', () => {
    const dispatch = jest.fn();

    it('onRequestIncident', () => {
      // For the `mapDispatchToProps`, call it directly but pass in
      // a mock function and check the arguments passed in are as expected
      mapDispatchToProps(dispatch).requestCategories();
      expect(dispatch).toHaveBeenCalledWith({ type: REQUEST_CATEGORIES });
    });
  });
});
