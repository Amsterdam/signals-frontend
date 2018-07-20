import React from 'react';
import { shallow } from 'enzyme';

import { isAuthenticated } from 'shared/services/auth/auth';
import { HeaderContainer } from './index';
// import Event from ;

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

    const renderedComponent = shallow(
      <HeaderContainer {...props} />
    );
    expect(renderedComponent).toMatchSnapshot();
  });

  describe('onLoginLogoutButtonClick', () => {
    it('should login when not authenticated', () => {
      isAuthenticated.mockImplementation((() => false));

      const renderedComponent = shallow(
        <HeaderContainer {...props} />
      );

      const domain = 'the-login-domain';
      expect(renderedComponent.instance().onLoginLogoutButtonClick(event, domain));
      expect(props.onLogin).toHaveBeenCalledWith(domain);
    });

    it('should logout when authenticated', () => {
      isAuthenticated.mockImplementation((() => true));

      const renderedComponent = shallow(
        <HeaderContainer {...props} />
      );
      expect(renderedComponent.instance().onLoginLogoutButtonClick(event));
      expect(props.onLogout).toHaveBeenCalled();
    });
  });
});
