import React from 'react';
import { shallow } from 'enzyme';
import { render, fireEvent } from '@testing-library/react';

import Header from './index';
import { withAppContext } from '../../test/utils';

describe('<Header />', () => {
  describe('rendering', () => {
    it('should render correctly', () => {
      const wrapper = shallow(
        <Header permissions={[]} />
      );
      expect(wrapper).toMatchSnapshot();
    });
  });

  it('should render correctly when logged in', () => {
    const wrapper = shallow(
      <Header isAuthenticated permissions={[]} />
    );
    expect(wrapper).toMatchSnapshot();
  });

  describe('events', () => {
    it('should render correctly when logged in', () => {
      const onLoginLogoutButtonClick = jest.fn();

      const { container } = render(withAppContext(
        <Header
          permissions={[]}
          isAuthenticated
          onLoginLogoutButtonClick={onLoginLogoutButtonClick}
        />
      ));

      const logoutButton = container.querySelector('.header-component__logout');

      expect(logoutButton).not.toBeNull();

      fireEvent.click(logoutButton);

      expect(onLoginLogoutButtonClick).toHaveBeenCalled();
    });
  });
});
