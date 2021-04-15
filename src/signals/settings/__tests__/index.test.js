// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2019 - 2021 Gemeente Amsterdam
import React, { Suspense } from 'react';
import { render, waitFor, act } from '@testing-library/react';
import * as reactRouterDom from 'react-router-dom';
import * as reactRedux from 'react-redux';

import * as appSelectors from 'containers/App/selectors'; // { makeSelectUserCanAccess, makeSelectUserCan }
import * as auth from 'shared/services/auth/auth';

import { fetchRoles as fetchRolesAction, fetchPermissions as fetchPermissionsAction } from 'models/roles/actions';
import { withAppContext, history } from 'test/utils';
import SettingsModule from '..';
import { USER_URL, USERS_URL, ROLES_URL, ROLE_URL, DEPARTMENTS_URL, DEPARTMENT_URL, CATEGORIES_URL, CATEGORY_URL } from '../routes';

jest.mock('react-router-dom', () => ({
  __esModule: true,
  ...jest.requireActual('react-router-dom'),
}));

jest.mock('containers/App/selectors', () => ({
  __esModule: true,
  ...jest.requireActual('containers/App/selectors'),
}));

const dispatch = jest.fn();
jest.spyOn(reactRedux, 'useDispatch').mockImplementation(() => dispatch);

const withSuspense = () => withAppContext(<Suspense fallback={<div data-testid="loadingText">Loading...</div>}><SettingsModule /></Suspense>);

describe('signals/settings', () => {
  beforeEach(() => {
    dispatch.mockReset();

    jest.spyOn(reactRouterDom, 'useLocation');
    jest.spyOn(appSelectors, 'makeSelectUserCan').mockImplementation(() => () => true);
    jest.spyOn(appSelectors, 'makeSelectUserCanAccess').mockImplementation(() => () => true);
  });

  afterEach(() => {
    history.entries = [];
    reactRouterDom.useLocation.mockRestore();
  });

  it('should initiate fetches on mount', () => {
    jest.spyOn(auth, 'isAuthenticated').mockImplementation(() => true);

    expect(dispatch).not.toHaveBeenCalled();

    render(withSuspense());

    expect(dispatch).toHaveBeenCalledWith(fetchRolesAction());
    expect(dispatch).toHaveBeenCalledWith(fetchPermissionsAction());
  });

  it('should NOT initiate fetches on mount when session has not been authenticated', () => {
    jest.spyOn(auth, 'isAuthenticated').mockImplementation(() => false);

    expect(dispatch).not.toHaveBeenCalled();

    render(withSuspense());

    expect(dispatch).not.toHaveBeenCalled();
  });

  it('should render login page', () => {
    jest.spyOn(auth, 'isAuthenticated').mockImplementation(() => false);

    const { queryByTestId, getByTestId, rerender } = render(withSuspense());

    expect(getByTestId('loginPage')).toBeInTheDocument();

    jest.spyOn(auth, 'isAuthenticated').mockImplementation(() => true);

    rerender(withSuspense());

    expect(queryByTestId('loginPage')).toBeNull();
  });

  it('should redirect to manage overview page', async () => {
    jest.spyOn(appSelectors, 'makeSelectUserCanAccess').mockImplementation(() => () => false);
    jest.spyOn(auth, 'isAuthenticated').mockImplementation(() => true);

    render(withSuspense());

    expect(reactRouterDom.useLocation.mock.results.pop().value.pathname).toEqual('/manage/incidents');
  });

  it('should allow routing to departments page', async () => {
    jest.spyOn(auth, 'isAuthenticated').mockImplementation(() => true);
    jest.spyOn(appSelectors, 'makeSelectUserCanAccess').mockImplementation(() => section => section === 'departments');

    render(withSuspense());

    act(() => history.push(DEPARTMENTS_URL));

    await waitFor(() => expect(reactRouterDom.useLocation.mock.results.pop().value.pathname).toEqual(DEPARTMENTS_URL));
  });

  it('should allow routing to users pages', async () => {
    jest.spyOn(auth, 'isAuthenticated').mockImplementation(() => true);
    jest.spyOn(appSelectors, 'makeSelectUserCanAccess').mockImplementation(() => section => section === 'departments');

    render(withSuspense());

    act(() => history.push(DEPARTMENTS_URL));

    await waitFor(() => expect(reactRouterDom.useLocation.mock.results.pop().value.pathname).toEqual(DEPARTMENTS_URL));
  });

  it('should allow routing to department page', async () => {
    jest.spyOn(auth, 'isAuthenticated').mockImplementation(() => true);
    jest.spyOn(appSelectors, 'makeSelectUserCanAccess').mockImplementation(() => section => section === 'departmentForm' || section === 'departments');

    render(withSuspense());

    const url = `${DEPARTMENT_URL}/1`;

    act(() => history.push(url));

    await waitFor(() => expect(reactRouterDom.useLocation.mock.results.pop().value.pathname).toEqual(url));
  });

  it('should allow routing to categories page', async () => {
    jest.spyOn(auth, 'isAuthenticated').mockImplementation(() => true);
    jest.spyOn(appSelectors, 'makeSelectUserCanAccess').mockImplementation(() => section => section === 'categories');

    render(withSuspense());

    act(() => history.push(CATEGORIES_URL));

    await waitFor(() => expect(reactRouterDom.useLocation.mock.results.pop().value.pathname).toEqual(CATEGORIES_URL));
  });

  it('should allow routing to individual category page', async () => {
    jest.spyOn(auth, 'isAuthenticated').mockImplementation(() => true);
    jest.spyOn(appSelectors, 'makeSelectUserCanAccess').mockImplementation(() => section => section === 'categories' || section === 'categoryForm');

    render(withSuspense());

    const url = `${CATEGORY_URL}/1`;

    act(() => history.push(url));

    await waitFor(() => expect(reactRouterDom.useLocation.mock.results.pop().value.pathname).toEqual(url));
  });

  it('should allow routing to users page', async () => {
    jest.spyOn(auth, 'isAuthenticated').mockImplementation(() => true);
    jest.spyOn(appSelectors, 'makeSelectUserCanAccess').mockImplementation(() => section => section === 'users');

    render(withSuspense());

    await waitFor(() => expect(reactRouterDom.useLocation.mock.results.pop().value.pathname).not.toEqual(USERS_URL));

    // load users overview page
    act(() => history.push(USERS_URL));

    await waitFor(() => expect(reactRouterDom.useLocation.mock.results.pop().value.pathname).toEqual(USERS_URL));
  });

  it('should allow routing to individual user page', async () => {
    jest.spyOn(auth, 'isAuthenticated').mockImplementation(() => true);
    jest.spyOn(appSelectors, 'makeSelectUserCanAccess').mockImplementation(() => section => section === 'users' || section === 'userForm');

    render(withSuspense());

    const url = `${USER_URL}/1`;

    act(() => history.push(url));

    await waitFor(() => expect(reactRouterDom.useLocation.mock.results.pop().value.pathname).toEqual(url));
  });

  it('should allow routing to groups pages', async () => {
    jest.spyOn(auth, 'isAuthenticated').mockImplementation(() => true);
    jest.spyOn(appSelectors, 'makeSelectUserCanAccess').mockImplementation(() => section => section !== 'users');

    render(withSuspense());

    // load roles overview page
    act(() => history.push(ROLES_URL));

    await waitFor(() => expect(reactRouterDom.useLocation.mock.results.pop().value.pathname).toEqual(ROLES_URL));

    // load users overview page (should not be allowed)
    act(() => history.push(USERS_URL));

    await waitFor(() => expect(reactRouterDom.useLocation.mock.results.pop().value.pathname).not.toEqual(USERS_URL));
  });

  it('should allow routing to group form', async () => {
    jest.spyOn(auth, 'isAuthenticated').mockImplementation(() => true);
    jest.spyOn(appSelectors, 'makeSelectUserCanAccess').mockImplementation(() => section => section === 'groups' || section === 'settings');
    jest.spyOn(appSelectors, 'makeSelectUserCan').mockImplementation(() => section => section === 'add_group');

    render(withSuspense());

    act(() => history.push(ROLE_URL));

    await waitFor(() => expect(reactRouterDom.useLocation.mock.results.pop().value.pathname).toEqual(ROLE_URL));
  });
});
