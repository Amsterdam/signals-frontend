import React from 'react';
import { render, fireEvent, cleanup } from '@testing-library/react';
import MatchMediaMock from 'match-media-mock';

import SiteHeader, { breakpoint } from './index';
import { withAppContext } from '../../test/utils';

const mmm = MatchMediaMock.create();

describe('components/SiteHeader', () => {
  afterEach(cleanup);

  beforeEach(() => {
    mmm.setConfig({ type: 'screen', width: breakpoint + 1 });

    // eslint-disable-next-line no-undef
    Object.defineProperty(window, 'matchMedia', {
      value: mmm,
    });
  });

  it('should render correctly', () => {
    const { container, rerender, queryByText } = render(
      withAppContext(<SiteHeader permissions={[]} location={{ pathname: '/' }} />),
    );

    // render site title
    expect(queryByText('Meldingen')).not.toBeNull();

    // log in button
    expect(queryByText('Log in')).not.toBeNull();

    // menu items
    expect(queryByText('Nieuwe melding')).not.toBeNull();

    // inline menu should be visible
    expect(container.querySelectorAll('ul[aria-hidden="true"]')).toHaveLength(
      0,
    );

    // narrow window toggle
    mmm.setConfig({ type: 'screen', width: breakpoint - 1 });

    // eslint-disable-next-line no-undef
    Object.defineProperty(window, 'matchMedia', {
      value: mmm,
    });

    rerender(
      withAppContext(<SiteHeader permissions={[]} location={{ pathname: '/' }} />),
    );

    // toggle menu should be visible
    expect(container.querySelectorAll('ul[aria-hidden="true"]')).toHaveLength(
      1,
    );
  });

  it('should not show login button on homepage', () => {
    //  dont' show login button on homepage
    const { rerender, queryByText } = render(
      withAppContext(
        <SiteHeader
          permissions={[]}
          isAuthenticated={false}
          location={{ pathname: '/incident/beschrijf' }}
        />,
      ),
    );

    expect(queryByText('Log in')).toBeNull();

    rerender(
      withAppContext(
        <SiteHeader
          permissions={[]}
          isAuthenticated={false}
          location={{ pathname: '/manage/incidents' }}
        />,
      ),
    );

    expect(queryByText('Log in')).not.toBeNull();
  });

  it('should render correctly when logged in', () => {
    const { queryByText } = render(
      withAppContext(
        <SiteHeader
          isAuthenticated
          permissions={[]}
          location={{ pathname: '/' }}
        />,
      ),
    );

    // log in button
    expect(queryByText('Log in')).toBeNull();

    // log out button
    expect(queryByText('Uitloggen')).not.toBeNull();
  });

  it('should handle login/logout callback', () => {
    const onLoginLogoutButtonClick = jest.fn();

    const { rerender, getByText } = render(
      withAppContext(
        <SiteHeader
          permissions={[]}
          onLoginLogoutButtonClick={onLoginLogoutButtonClick}
          location={{ pathname: '/' }}
        />,
      ),
    );

    const loginButton = getByText('Log in');

    fireEvent(
      loginButton,
      new MouseEvent('click', {
        bubbles: true,
      }),
    );

    expect(onLoginLogoutButtonClick).toHaveBeenCalled();

    onLoginLogoutButtonClick.mockReset();

    rerender(
      withAppContext(
        <SiteHeader
          permissions={[]}
          isAuthenticated
          onLoginLogoutButtonClick={onLoginLogoutButtonClick}
          location={{ pathname: '/' }}
        />,
      ),
    );

    const logoutButton = getByText('Uitloggen');

    fireEvent(
      logoutButton,
      new MouseEvent('click', {
        bubbles: true,
      }),
    );

    expect(onLoginLogoutButtonClick).toHaveBeenCalled();
  });
});
