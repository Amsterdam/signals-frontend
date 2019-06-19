import React from 'react';
import { shallow } from 'enzyme';

import { isAuthenticated } from 'shared/services/auth/auth';
import { HeaderContainer, mapDispatchToProps } from './index';
import { LOGIN, LOGOUT } from '../App/constants';

jest.mock('shared/services/auth/auth');

describe('<HeaderContainer />', () => {
  let props;
  const event = {
    persist: jest.fn(),
    preventDefault: jest.fn(),
    stopPropagation: jest.fn(),
  };

  beforeEach(() => {
    props = {
      userName: 'user',
      onLogin: jest.fn(),
      onLogout: jest.fn()
    };
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should render correctly when authenticated', () => {
    isAuthenticated.mockImplementation((() => true));

    const wrapper = shallow(
      <HeaderContainer {...props} />
    );
    expect(wrapper).toMatchSnapshot();
  });

  describe('onLoginLogoutButtonClick', () => {
    it('should login when not authenticated', () => {
      isAuthenticated.mockImplementation((() => false));

      const wrapper = shallow(
        <HeaderContainer {...props} />
      );

      const domain = 'the-login-domain';
      expect(wrapper.instance().onLoginLogoutButtonClick(event, domain));
      expect(props.onLogin).toHaveBeenCalledWith(domain);
    });

    it('should logout when authenticated', () => {
      isAuthenticated.mockImplementation((() => true));

      const wrapper = shallow(
        <HeaderContainer {...props} />
      );
      expect(wrapper.instance().onLoginLogoutButtonClick(event));
      expect(props.onLogout).toHaveBeenCalled();
    });
  });

  describe('mapDispatchToProps', () => {
    const dispatch = jest.fn();

    it('should log in', () => {
      mapDispatchToProps(dispatch).onLogin('domain');
      expect(dispatch).toHaveBeenCalledWith({ type: LOGIN, payload: 'domain' });
    });

    it('should log out', () => {
      mapDispatchToProps(dispatch).onLogout();
      expect(dispatch).toHaveBeenCalledWith({ type: LOGOUT, payload: null });
    });
  });
});
