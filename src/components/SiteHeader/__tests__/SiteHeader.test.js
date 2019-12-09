import React from 'react';
import {
  render,
  fireEvent,
  cleanup,
} from '@testing-library/react';
import MatchMediaMock from 'match-media-mock';
import { act } from 'react-dom/test-utils';

import * as auth from 'shared/services/auth/auth';
import { history, withAppContext } from 'test/utils';

import SiteHeader, { breakpoint } from '../index';

const mmm = MatchMediaMock.create();

jest.mock('shared/services/auth/auth');

describe('components/SiteHeader', () => {
  beforeEach(() => {
    mmm.setConfig({ type: 'screen', width: breakpoint + 1 });

    // eslint-disable-next-line no-undef
    Object.defineProperty(window, 'matchMedia', {
      value: mmm,
    });
  });

  it('should render correctly when not authenticated', () => {
    jest.spyOn(auth, 'isAuthenticated').mockImplementation(() => false);

    history.push('/')

    const { container, rerender, queryByText } = render(
      withAppContext(
        <SiteHeader permissions={[]} />,
      ),
    );

    // menu items
    expect(queryByText('Melden')).toBeNull();

    // inline menu should not be visible
    expect(container.querySelectorAll('ul[aria-hidden="true"]')).toHaveLength(0);

    cleanup();

    // narrow window toggle
    mmm.setConfig({ type: 'screen', width: breakpoint - 1 });

    // eslint-disable-next-line no-undef
    Object.defineProperty(window, 'matchMedia', {
      value: mmm,
    });

    history.push('/manage');

    rerender(
      withAppContext(
        <SiteHeader permissions={[]} />,
      ),
    );

    expect(queryByText('Melden')).toBeNull();
  });

  it('should render correctly when authenticated', () => {
    jest.spyOn(auth, 'isAuthenticated').mockImplementation(() => true);

    history.push('/')

    const { container, queryByText } = render(
      withAppContext(
        <SiteHeader permissions={[]} />,
      ),
    );

    // menu items
    expect(queryByText('Melden')).not.toBeNull();

    // inline menu should be visible, with a dropdown for instellingen
    expect(container.querySelectorAll('ul[aria-hidden="true"]')).toHaveLength(1);

    cleanup();

    // narrow window toggle
    mmm.setConfig({ type: 'screen', width: breakpoint - 1 });

    history.push('/manage');

    render(
      withAppContext(
        <SiteHeader permissions={[]} />,
      ),
    );

    // toggle menu should be visible
    expect(document.querySelectorAll('ul[aria-hidden="true"]')).toHaveLength(2);
  });

  it('should render a title', () => {
    jest.spyOn(auth, 'isAuthenticated').mockImplementation(() => false);

    history.push('/');

    const { queryByText } = render(
      withAppContext(
        <SiteHeader permissions={[]} />,
      ),
    );

    const title = 'SIA';

    // don't show title in front office when not authenticated
    expect(queryByText(title)).toBeNull();

    cleanup();

    jest.spyOn(auth, 'isAuthenticated').mockImplementation(() => true);

    history.push('/');

    render(
      withAppContext(
        <SiteHeader permissions={[]} />,
      ),
    );

    // do show title in front office when authenticated
    expect(queryByText(title)).not.toBeNull();

    cleanup();

    jest.spyOn(auth, 'isAuthenticated').mockImplementation(() => false);

    history.push('/manage');

    render(
      withAppContext(
        <SiteHeader permissions={[]} />,
      ),
    );

    // don't show title in back office when not authenticated
    expect(queryByText(title)).toBeNull();

    cleanup();

    jest.spyOn(auth, 'isAuthenticated').mockImplementation(() => true);

    render(
      withAppContext(
        <SiteHeader permissions={[]} />,
      ),
    );

    // do show title in back office when authenticated
    expect(queryByText(title)).not.toBeNull();
  });

  it('should render a tall header', () => {
    jest.spyOn(auth, 'isAuthenticated').mockImplementation(() => false);

    history.push('/');

    const { container, rerender } = render(
      withAppContext(
        <SiteHeader permissions={[]} location={{ pathname: '/' }} />,
      ),
    );

    expect(container.querySelector('.siteHeader').classList.contains('isTall')).toEqual(true);

    cleanup();

    jest.spyOn(auth, 'isAuthenticated').mockImplementation(() => true);

    rerender(
      withAppContext(
        <SiteHeader permissions={[]} />,
      ),
    );

    expect(container.querySelector('.siteHeader').classList.contains('isShort')).toEqual(true);

    cleanup();

    history.push('/manage');

    jest.spyOn(auth, 'isAuthenticated').mockImplementation(() => false);

    rerender(
      withAppContext(
        <SiteHeader permissions={[]} />,
      ),
    );

    expect(container.querySelector('.siteHeader').classList.contains('isTall')).toEqual(true);

    cleanup();

    jest.spyOn(auth, 'isAuthenticated').mockImplementation(() => true);

    rerender(
      withAppContext(
        <SiteHeader permissions={[]} />,
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

  it('should handle logout callback', () => {
    history.push('/');

    jest.spyOn(auth, 'isAuthenticated').mockImplementation(() => true);

    const onLogOut = jest.fn();

    const { getByText } = render(
      withAppContext(
        <SiteHeader
          permissions={[]}
          onLogOut={onLogOut}
        />,
      ),
    );

    const logOutButton = getByText('Uitloggen');

    expect(onLogOut).not.toHaveBeenCalled();

    act(() => {
      fireEvent(
        logOutButton,
        new MouseEvent('click', {
          bubbles: true,
        }),
      );
    });

    expect(onLogOut).toHaveBeenCalled();
  });
});
