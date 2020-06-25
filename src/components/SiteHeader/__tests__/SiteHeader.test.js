import React from 'react';
import { render, fireEvent, act } from '@testing-library/react';
import MatchMediaMock from 'match-media-mock';
import 'jest-styled-components';

import * as auth from 'shared/services/auth/auth';
import { history, withAppContext } from 'test/utils';
import configuration from 'shared/services/configuration/configuration';

import SiteHeader, { menuBreakpoint } from '../index';

const mmm = MatchMediaMock.create();

jest.mock('shared/services/auth/auth');
jest.mock('shared/services/configuration/configuration');

describe('components/SiteHeader', () => {
  beforeEach(() => {
    mmm.setConfig({ type: 'screen', width: menuBreakpoint + 1 });

    // eslint-disable-next-line no-undef
    Object.defineProperty(window, 'matchMedia', {
      value: mmm,
    });
  });

  afterEach(() => {
    configuration.__reset();
  });

  it('should render correctly when not authenticated', () => {
    jest.spyOn(auth, 'isAuthenticated').mockImplementation(() => false);

    act(() => {
      history.push('/');
    });

    const { container, rerender, queryByText, unmount } = render(withAppContext(<SiteHeader />));

    // menu items
    expect(queryByText('Melden')).not.toBeInTheDocument();
    expect(queryByText('Help')).not.toBeInTheDocument();

    // inline menu should not be visible
    expect(container.querySelectorAll('ul[aria-hidden="true"]')).toHaveLength(0);

    unmount();

    // narrow window toggle
    mmm.setConfig({ type: 'screen', width: menuBreakpoint - 1 });

    act(() => {
      history.push('/manage');
    });

    rerender(withAppContext(<SiteHeader />));

    expect(queryByText('Melden')).toBeNull();

    expect(container.querySelector('#header')).toHaveStyleRule('z-index: 2');
  });

  it('should render correctly when authenticated', () => {
    jest.spyOn(auth, 'isAuthenticated').mockImplementation(() => true);

    act(() => {
      history.push('/');
    });

    const { container, queryByText, unmount } = render(
      withAppContext(<SiteHeader showItems={{ settings: true, users: true, groups: true }} />)
    );

    // menu items
    expect(queryByText('Melden')).toBeInTheDocument();
    expect(queryByText('Help')).toBeInTheDocument();

    // inline menu should be visible, with a dropdown for instellingen
    expect(container.querySelectorAll('ul[aria-hidden="true"]')).toHaveLength(1);

    expect(container.querySelector('#header')).toHaveStyleRule('z-index: 2');

    unmount();

    // narrow window toggle
    mmm.setConfig({ type: 'screen', width: menuBreakpoint - 1 });

    act(() => {
      history.push('/manage');
    });

    render(withAppContext(<SiteHeader showItems={{ settings: true, users: true, groups: true }} />));

    // toggle menu should be visible
    expect(document.querySelectorAll('ul[aria-hidden="true"]')).toHaveLength(2);
  });

  it('should render the Amsterdam logo by default', () => {
    jest.spyOn(auth, 'isAuthenticated').mockImplementation(() => false);

    const { container, rerender, unmount } = render(
      withAppContext(<SiteHeader permissions={[]} location={{ pathname: '/' }} />)
    );

    expect(container.querySelector('h1 img')).not.toBeInTheDocument();

    configuration.logo.url = 'logoUrl';

    unmount();

    rerender(withAppContext(<SiteHeader permissions={[]} location={{ pathname: '/' }} />));

    expect(container.querySelector('h1 img[src="logoUrl"]')).toBeInTheDocument();
  });

  it('should render the correct homeLink', () => {
    jest.spyOn(auth, 'isAuthenticated').mockImplementation(() => false);

    const { container, rerender, unmount } = render(
      withAppContext(<SiteHeader permissions={[]} location={{ pathname: '/' }} />)
    );

    expect(container.querySelector('h1 a[href="https://www.amsterdam.nl"]')).toBeInTheDocument();

    jest.spyOn(auth, 'isAuthenticated').mockImplementation(() => true);

    unmount();

    rerender(withAppContext(<SiteHeader permissions={[]} location={{ pathname: '/' }} />));

    expect(container.querySelector('h1 a[href="/"]')).toBeInTheDocument();

    unmount();

    rerender(withAppContext(<SiteHeader permissions={[]} location={{ pathname: '/manage/incidents' }} />));

    expect(container.querySelector('h1 a[href="/"]')).toBeInTheDocument();
  });

  it('should render a title', () => {
    jest.spyOn(auth, 'isAuthenticated').mockImplementation(() => false);

    act(() => {
      history.push('/');
    });

    const { queryByText, rerender, unmount } = render(withAppContext(<SiteHeader />));

    const title = 'SIA';

    // don't show title in front office when not authenticated
    expect(queryByText(title)).toBeNull();

    unmount();

    jest.spyOn(auth, 'isAuthenticated').mockImplementation(() => true);

    act(() => {
      history.push('/');
    });

    rerender(withAppContext(<SiteHeader />));

    // do show title in front office when authenticated
    expect(queryByText(title)).not.toBeNull();

    unmount();

    jest.spyOn(auth, 'isAuthenticated').mockImplementation(() => false);

    act(() => {
      history.push('/manage');
    });

    rerender(withAppContext(<SiteHeader />));

    // don't show title in back office when not authenticated
    expect(queryByText(title)).toBeNull();

    unmount();

    jest.spyOn(auth, 'isAuthenticated').mockImplementation(() => true);

    rerender(withAppContext(<SiteHeader />));

    // do show title in back office when authenticated
    expect(queryByText(title)).not.toBeNull();
  });

  it('should render a tall header', () => {
    jest.spyOn(auth, 'isAuthenticated').mockImplementation(() => false);

    act(() => {
      history.push('/');
    });

    const { container, rerender, unmount } = render(withAppContext(<SiteHeader location={{ pathname: '/' }} />));

    expect(container.querySelector('.siteHeader').classList.contains('isTall')).toEqual(true);

    unmount();

    jest.spyOn(auth, 'isAuthenticated').mockImplementation(() => true);

    rerender(withAppContext(<SiteHeader />));

    expect(container.querySelector('.siteHeader').classList.contains('isShort')).toEqual(true);

    unmount();

    act(() => {
      history.push('/manage');
    });

    jest.spyOn(auth, 'isAuthenticated').mockImplementation(() => false);

    rerender(withAppContext(<SiteHeader />));

    expect(container.querySelector('.siteHeader').classList.contains('isTall')).toEqual(true);

    unmount();

    jest.spyOn(auth, 'isAuthenticated').mockImplementation(() => true);

    rerender(withAppContext(<SiteHeader />));

    expect(container.querySelector('.siteHeader').classList.contains('isShort')).toEqual(true);
  });

  it('should show buttons based on permissions', () => {
    const { queryByText } = render(
      withAppContext(<SiteHeader showItems={{ defaultTexts: true }} location={{ pathname: '/incident/beschrijf' }} />)
    );

    expect(queryByText('Standaard teksten')).not.toBeNull();
  });

  it('should render correctly when logged in', () => {
    jest.spyOn(auth, 'isAuthenticated').mockImplementation(() => true);

    const { container, queryByText } = render(withAppContext(<SiteHeader location={{ pathname: '/' }} />));

    // afhandelen menu item
    expect(queryByText('Afhandelen')).toBeInTheDocument();

    // search field
    expect(container.querySelector('input')).toBeInTheDocument();

    // log out button
    expect(queryByText('Uitloggen')).toBeInTheDocument();
  });

  it('should handle logout callback', () => {
    act(() => {
      history.push('/');
    });

    jest.spyOn(auth, 'isAuthenticated').mockImplementation(() => true);

    const onLogOut = jest.fn();

    const { getByText } = render(withAppContext(<SiteHeader onLogOut={onLogOut} />));

    const logOutButton = getByText('Uitloggen');

    expect(onLogOut).not.toHaveBeenCalled();

    act(() => {
      fireEvent(
        logOutButton,
        new MouseEvent('click', {
          bubbles: true,
        })
      );
    });

    expect(onLogOut).toHaveBeenCalled();
  });

  it('should show items', () => {
    const { rerender, queryByText, unmount } = render(
      withAppContext(<SiteHeader showItems={{ settings: false, users: true, groups: true }} />)
    );

    expect(queryByText('Instellingen')).not.toBeInTheDocument();
    expect(queryByText('Gebruikers')).not.toBeInTheDocument();
    expect(queryByText('Rollen')).not.toBeInTheDocument();

    unmount();

    rerender(withAppContext(<SiteHeader showItems={{ settings: true, users: false, groups: false }} />));

    expect(queryByText('Instellingen')).not.toBeInTheDocument();
    expect(queryByText('Gebruikers')).not.toBeInTheDocument();
    expect(queryByText('Rollen')).not.toBeInTheDocument();

    unmount();

    rerender(withAppContext(<SiteHeader showItems={{ settings: true, users: true, groups: false }} />));

    expect(queryByText('Instellingen')).toBeInTheDocument();
    expect(queryByText('Gebruikers')).toBeInTheDocument();
    expect(queryByText('Rollen')).not.toBeInTheDocument();

    unmount();

    rerender(withAppContext(<SiteHeader showItems={{ settings: true, users: false, groups: true }} />));

    expect(queryByText('Instellingen')).toBeInTheDocument();
    expect(queryByText('Gebruikers')).not.toBeInTheDocument();
    expect(queryByText('Rollen')).toBeInTheDocument();

    unmount();

    rerender(withAppContext(<SiteHeader showItems={{ settings: true, users: true, groups: true }} />));

    expect(queryByText('Instellingen')).toBeInTheDocument();
    expect(queryByText('Gebruikers')).toBeInTheDocument();
    expect(queryByText('Rollen')).toBeInTheDocument();
  });
});
