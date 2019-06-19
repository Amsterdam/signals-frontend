import React from 'react';
import { shallow } from 'enzyme';

import Header from './index';

describe('<Header />', () => {
  describe('rendering', () => {
    it('should render correctly', () => {
      const wrapper = shallow(
        <Header />
      );
      expect(wrapper).toMatchSnapshot();
    });
  });

  it('should render correctly when logged in', () => {
    const wrapper = shallow(
      <Header isAuthenticated />
    );
    expect(wrapper).toMatchSnapshot();
  });

  describe('events', () => {
    it('should render correctly when logged in', () => {
      const onLoginLogoutButtonClick = jest.fn();

      const wrapper = shallow(
        <Header
          isAuthenticated
          onLoginLogoutButtonClick={onLoginLogoutButtonClick}
        />
      );

      wrapper.find('.header-component__logout').simulate('click');
      expect(onLoginLogoutButtonClick).toHaveBeenCalled();
    });
  });
});
