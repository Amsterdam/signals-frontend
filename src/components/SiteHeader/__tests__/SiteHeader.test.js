import React from 'react';
import {
  render,
  fireEvent,
  cleanup,
  createEvent,
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

  it('should render correctly', () => {
    const { container, rerender, queryByText } = render(
      withAppContext(
        <SiteHeader permissions={[]} location={{ pathname: '/' }} />,
      ),
    );

    // render site title
    expect(queryByText('Meldingen')).not.toBeNull();

    // log in button
    expect(queryByText('Log in')).not.toBeNull();

    // menu items
    expect(queryByText('Melden')).not.toBeNull();

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
      withAppContext(
        <SiteHeader permissions={[]} location={{ pathname: '/' }} />,
      ),
    );

    // toggle menu should be visible
    expect(container.querySelectorAll('ul[aria-hidden="true"]')).toHaveLength(
      1,
    );
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
    const { container, queryByText } = render(
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

    // afhandelen menu item
    expect(queryByText('Afhandelen')).toBeTruthy();

    // search field
    expect(container.querySelector('input[type="text"]')).toBeTruthy();

    // log out button
    expect(queryByText('Uitloggen')).toBeTruthy();
  });

  it('should only accept numeric characters in the search field', () => {
    const { queryByTestId } = render(
      withAppContext(
        <SiteHeader
          isAuthenticated
          permissions={[]}
          location={{ pathname: '/' }}
        />,
      ),
    );

    const input = queryByTestId('searchBar').querySelector('input');

    // simulate the input of numeric keys
    const numericKeyCodes = [...Array(58).keys()].slice(48);
    numericKeyCodes.forEach((keyCode, value) => {
      fireEvent.change(input, { target: { value, keyCode } });
      expect(parseInt(input.value, 10)).toEqual(value);
    });

    // simulate the input of navigational keys
    const navKeyCodes = [
      8, // backspace
      37, // left
      39, // right
      46, // delete
    ];
    navKeyCodes.forEach((keyCode) => {
      const myEvent = createEvent.change(input, { target: { keyCode } });
      const preventDefaultSpy = jest.spyOn(myEvent, 'preventDefault');
      fireEvent(input, myEvent);

      expect(preventDefaultSpy).not.toHaveBeenCalled();
    });

    // simulate other keys
    const invalidKeyCodes = [1, 2, 3, 4, 58, 60, 90];
    invalidKeyCodes.forEach((keyCode) => {
      const myEvent = createEvent.keyDown(input, { target: { keyCode } });
      const preventDefaultSpy = jest.spyOn(myEvent, 'preventDefault');
      fireEvent(input, myEvent);

      expect(preventDefaultSpy).toHaveBeenCalled();
    });
  });

  it('should call searchSubmit handler', () => {
    const onSearchSubmit = jest.fn();

    const { queryByTestId, rerender } = render(
      withAppContext(
        <SiteHeader
          isAuthenticated
          permissions={[]}
          location={{ pathname: '/' }}
          onSearchSubmit={onSearchSubmit}
        />,
      ),
    );

    const formSubmitBtn = queryByTestId('searchBar').querySelector('button');
    fireEvent.click(formSubmitBtn);

    expect(onSearchSubmit).toHaveBeenCalled();

    onSearchSubmit.mockReset();

    rerender(
      withAppContext(
        <SiteHeader
          isAuthenticated
          permissions={[]}
          location={{ pathname: '/' }}
          onSearchSubmit={null}
        />,
      ),
    );

    fireEvent.click(formSubmitBtn);

    expect(onSearchSubmit).not.toHaveBeenCalled();
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
