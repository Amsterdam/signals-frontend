import React from 'react';
import {
  render,
  fireEvent,
  cleanup,
} from '@testing-library/react';
import MatchMediaMock from 'match-media-mock';

import SiteHeader, { breakpoint } from '../index';
import { withAppContext } from '../../../test/utils';

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

  it('should render correctly when not authenticated', () => {
    const { container, rerender, queryByText } = render(
      withAppContext(
        <SiteHeader permissions={[]} location={{ pathname: '/' }} />,
      ),
    );

    // menu items
    expect(queryByText('Melden')).not.toBeInTheDocument();
    expect(queryByText('Help')).not.toBeInTheDocument();

    // inline menu should not be visible
    expect(container.querySelectorAll('ul[aria-hidden="true"]')).toHaveLength(0);

    // narrow window toggle
    mmm.setConfig({ type: 'screen', width: breakpoint - 1 });

    // eslint-disable-next-line no-undef
    Object.defineProperty(window, 'matchMedia', {
      value: mmm,
    });

    rerender(
      withAppContext(
        <SiteHeader permissions={[]} location={{ pathname: '/manage' }} />,
      ),
    );

    expect(queryByText('Melden')).toBeNull();
  });

  it('should render correctly when authenticated', () => {
    const { container, rerender, queryByText } = render(
      withAppContext(
        <SiteHeader permissions={[]} location={{ pathname: '/' }} isAuthenticated />,
      ),
    );

    // menu items
    expect(queryByText('Melden')).toBeInTheDocument();
    expect(queryByText('Help')).toBeInTheDocument();

    // inline menu should be visible
    expect(container.querySelectorAll('ul[aria-hidden="true"]')).toHaveLength(0);

    // narrow window toggle
    mmm.setConfig({ type: 'screen', width: breakpoint - 1 });

    // eslint-disable-next-line no-undef
    Object.defineProperty(window, 'matchMedia', {
      value: mmm,
    });

    rerender(
      withAppContext(
        <SiteHeader permissions={[]} location={{ pathname: '/manage' }} isAuthenticated />,
      ),
    );

    // toggle menu should be visible
    expect(container.querySelectorAll('ul[aria-hidden="true"]')).toHaveLength(1);
  });

  it('should render a title', () => {
    const { rerender, queryByText } = render(
      withAppContext(
        <SiteHeader permissions={[]} location={{ pathname: '/' }} />,
      ),
    );

    const title = 'SIA';

    // don't show title in front office when not authenticated
    expect(queryByText(title)).toBeNull();

    rerender(
      withAppContext(
        <SiteHeader permissions={[]} location={{ pathname: '/' }} isAuthenticated />,
      ),
    );

    // do show title in front office when authenticated
    expect(queryByText(title)).not.toBeNull();

    rerender(
      withAppContext(
        <SiteHeader permissions={[]} location={{ pathname: '/manage' }} />,
      ),
    );

    // don't show title in back office when not authenticated
    expect(queryByText(title)).toBeNull();

    rerender(
      withAppContext(
        <SiteHeader permissions={[]} location={{ pathname: '/manage' }} isAuthenticated />,
      ),
    );

    // do show title in back office when authenticated
    expect(queryByText(title)).not.toBeNull();
  });

  it('should render a tall header', () => {
    const { container, rerender } = render(
      withAppContext(
        <SiteHeader permissions={[]} location={{ pathname: '/' }} />,
      ),
    );

    expect(container.querySelector('.siteHeader').classList.contains('isTall')).toEqual(true);

    rerender(
      withAppContext(
        <SiteHeader permissions={[]} location={{ pathname: '/' }} isAuthenticated />,
      ),
    );

    expect(container.querySelector('.siteHeader').classList.contains('isShort')).toEqual(true);

    rerender(
      withAppContext(
        <SiteHeader permissions={[]} location={{ pathname: '/manage' }} />,
      ),
    );

    expect(container.querySelector('.siteHeader').classList.contains('isTall')).toEqual(true);

    rerender(
      withAppContext(
        <SiteHeader permissions={[]} location={{ pathname: '/manage' }} isAuthenticated />,
      ),
    );

    expect(container.querySelector('.siteHeader').classList.contains('isShort')).toEqual(true);
  });

  it('should show buttons based on permissions', () => {
    const { queryByText } = render(
      withAppContext(
        <SiteHeader
          permissions={['signals.sia_statusmessagetemplate_write']}
          isAuthenticated
          location={{ pathname: '/incident/beschrijf' }}
        />,
      ),
    );

    expect(queryByText('Standaard teksten')).not.toBeNull();
  });

  it('should render correctly when logged in', () => {
    const { container, queryByText } = render(
      withAppContext(
        <SiteHeader
          isAuthenticated
          permissions={[]}
          location={{ pathname: '/' }}
        />,
      ),
    );

    // afhandelen menu item
    expect(queryByText('Afhandelen')).toBeTruthy();

    // search field
    expect(container.querySelector('input[type="text"]')).toBeTruthy();

    // log out button
    expect(queryByText('Uitloggen')).toBeTruthy();
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

    expect(onLoginLogoutButtonClick).not.toHaveBeenCalled();

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
