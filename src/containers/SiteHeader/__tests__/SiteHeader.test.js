import React from 'react';
import { shallow } from 'enzyme';
import { fireEvent, render } from '@testing-library/react';
import { withAppContext } from 'test/utils';

import { isAuthenticated } from 'shared/services/auth/auth';
import { SiteHeaderContainer, mapDispatchToProps } from '../index';
import { LOGIN, LOGOUT } from '../../App/constants';

jest.mock('shared/services/auth/auth');

describe('containers/SiteHeaderContainer', () => {
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
      onLogout: jest.fn(),
      permissions: [],
    };
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('onLoginLogoutButtonClick', () => {
    it('should login when not authenticated', () => {
      isAuthenticated.mockImplementation(() => false);

      const wrapper = shallow(<SiteHeaderContainer {...props} />);

      const domain = 'the-login-domain';
      expect(wrapper.instance().onLoginLogoutButtonClick(event, domain));
      expect(props.onLogin).toHaveBeenCalledWith(domain);
    });

    it('should logout when authenticated', () => {
      isAuthenticated.mockImplementation(() => true);

      const wrapper = shallow(<SiteHeaderContainer {...props} />);
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

  describe('onSearchSubmit', () => {
    it('should dispatch actions', () => {
      isAuthenticated.mockImplementation(() => true);

      const onSetSearchQuery = jest.fn();
      const onRequestIncidents = jest.fn();

      const { container } = render(withAppContext(
        <SiteHeaderContainer onLogin={() => {}} onSetSearchQuery={onSetSearchQuery} onRequestIncidents={onRequestIncidents} permissions={[]} />
      ));

      const searchFormInput = container.querySelector('input[type="text"]');
      const searchFormButton = container.querySelector('button[type="submit"]');

      fireEvent.click(searchFormButton);
      expect(onSetSearchQuery).not.toHaveBeenCalled();
      expect(onRequestIncidents).not.toHaveBeenCalled();

      fireEvent.change(searchFormInput, { target: { value: '3453' } });
      fireEvent.click(searchFormButton);

      expect(onSetSearchQuery).toHaveBeenCalled();
      expect(onRequestIncidents).toHaveBeenCalled();
    });
  });
});
