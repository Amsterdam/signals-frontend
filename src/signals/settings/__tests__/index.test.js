import React from 'react';
import { mount } from 'enzyme';
import { render, waitFor } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import * as auth from 'shared/services/auth/auth';
import * as reactRouterDom from 'react-router-dom';

import { withAppContext, history } from 'test/utils';
import SettingsModule, { SettingsModule as Module } from '..';
import { USERS_URL, ROLES_URL } from '../routes';

jest.mock('react-router-dom', () => ({
  __esModule: true,
  ...jest.requireActual('react-router-dom'),
}));

const actionProps = {
  onFetchDepartments: jest.fn(),
  onFetchPermissions: jest.fn(),
  fetchCategoriesAction: jest.fn(),
  onFetchRoles: jest.fn(),
  userCan: jest.fn(() => true),
  userCanAccess: jest.fn(() => true),
};

describe('signals/settings', () => {
  beforeEach(() => {
    jest.spyOn(reactRouterDom, 'useLocation');
  });

  afterEach(() => {
    history.entries = [];
    reactRouterDom.useLocation.mockRestore();
  });

  it('should have props from structured selector', () => {
    const tree = mount(withAppContext(<SettingsModule />));

    const props = tree.find(Module).props();

    expect(props.userCan).not.toBeUndefined();
    expect(props.userCanAccess).not.toBeUndefined();
  });

  it('should have props from action creator', () => {
    const tree = mount(withAppContext(<SettingsModule />));

    const containerProps = tree.find(Module).props();

    expect(containerProps.onFetchDepartments).toBeDefined();
    expect(typeof containerProps.onFetchDepartments).toEqual('function');

    expect(containerProps.onFetchPermissions).toBeDefined();
    expect(typeof containerProps.onFetchPermissions).toEqual('function');

    expect(containerProps.onFetchRoles).toBeDefined();
    expect(typeof containerProps.onFetchRoles).toEqual('function');
  });

  it('should initiate fetches on mount', () => {
    jest.spyOn(auth, 'isAuthenticated').mockImplementation(() => true);

    const onFetchDepartments = jest.fn();
    const onFetchPermissions = jest.fn();
    const onFetchRoles = jest.fn();

    render(
      withAppContext(
        <Module
          {...actionProps}
          onFetchDepartments={onFetchDepartments}
          onFetchPermissions={onFetchPermissions}
          onFetchRoles={onFetchRoles}
        />
      )
    );

    expect(onFetchDepartments).toHaveBeenCalled();
    expect(onFetchPermissions).toHaveBeenCalled();
    expect(onFetchRoles).toHaveBeenCalled();
  });

  it('should NOT initiate fetches on mount when session has not been authenticated', () => {
    jest.spyOn(auth, 'isAuthenticated').mockImplementation(() => false);

    const onFetchDepartments = jest.fn();
    const onFetchPermissions = jest.fn();
    const onFetchRoles = jest.fn();

    render(
      withAppContext(
        <Module
          {...actionProps}
          onFetchDepartments={onFetchDepartments}
          onFetchPermissions={onFetchPermissions}
          onFetchRoles={onFetchRoles}
        />
      )
    );

    expect(onFetchDepartments).not.toHaveBeenCalled();
    expect(onFetchPermissions).not.toHaveBeenCalled();
    expect(onFetchRoles).not.toHaveBeenCalled();
  });

  it('should render login page', () => {
    jest.spyOn(auth, 'isAuthenticated').mockImplementation(() => false);

    const { queryByTestId, getByTestId, rerender } = render(
      withAppContext(<Module {...actionProps} />)
    );

    expect(getByTestId('loginPage')).toBeInTheDocument();

    jest.spyOn(auth, 'isAuthenticated').mockImplementation(() => true);

    rerender(withAppContext(<Module {...actionProps} />));

    expect(queryByTestId('loginPage')).toBeNull();
  });

  it('should redirect to manage overview page', async () => {
    jest.spyOn(auth, 'isAuthenticated').mockImplementation(() => true);

    render(withAppContext(<Module {...actionProps} userCanAccess={() => false} />));

    expect(
      reactRouterDom.useLocation.mock.results.pop().value.pathname
    ).toEqual('/manage/incidents');
  });

  it('should provide pages with a location that has a referrer', async () => {
    jest.spyOn(auth, 'isAuthenticated').mockImplementation(() => true);

    render(withAppContext(<Module {...actionProps} />));

    act(() => history.push(`${USER_URL}/1`));

    act(() => history.push(`${USER_URL}/2`));

    const lastUseLocationResult = reactRouterDom.useLocation.mock.results.pop();

    await waitFor(() => expect(lastUseLocationResult.value.pathname).toEqual(`${USER_URL}/2`));
    await waitFor(() => expect(lastUseLocationResult.value.referrer).toEqual(`${USER_URL}/1`));
  });

  it('should allow routing to users pages', async () => {
    jest.spyOn(auth, 'isAuthenticated').mockImplementation(() => true);

    await act(async () =>
      render(
        withAppContext(
          <Module
            {...actionProps}
            userCanAccess={section => section !== 'groups'}
          />
        )
      )
    );

    // load users overview page
    await act(async () => history.push(USERS_URL));

    await waitFor(() =>
      expect(
        reactRouterDom.useLocation.mock.results.pop().value.pathname
      ).toEqual(USERS_URL)
    );

    // load roles overview page (should not be allowed)
    await act(async () => history.push(ROLES_URL));

    await waitFor(() =>
      expect(
        reactRouterDom.useLocation.mock.results.pop().value.pathname
      ).not.toEqual(ROLES_URL)
    );
  });

  it('should allow routing to groups pages', async () => {
    jest.spyOn(auth, 'isAuthenticated').mockImplementation(() => true);

    await act(async () =>
      render(
        withAppContext(
          <Module
            {...actionProps}
            userCanAccess={section => section !== 'users'}
          />
        )
      )
    );

    // load roles overview page
    await act(async () => history.push(ROLES_URL));

    await waitFor(() =>
      expect(
        reactRouterDom.useLocation.mock.results.pop().value.pathname
      ).toEqual(ROLES_URL)
    );

    // load users overview page (should not be allowed)
    await act(async () => history.push(USERS_URL));

    await waitFor(() =>
      expect(
        reactRouterDom.useLocation.mock.results.pop().value.pathname
      ).not.toEqual(USERS_URL)
    );
  });
});
