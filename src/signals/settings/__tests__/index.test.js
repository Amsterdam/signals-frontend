import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import * as reactRouterDom from 'react-router-dom';
import * as reactRedux from 'react-redux';

import * as appSelectors from 'containers/App/selectors'; // { makeSelectUserCanAccess, makeSelectUserCan }
import * as auth from 'shared/services/auth/auth';

import { fetchRoles as fetchRolesAction, fetchPermissions as fetchPermissionsAction } from 'models/roles/actions';
import { fetchDepartments as fetchDepartmentsAction } from 'models/departments/actions';
import { withAppContext, history } from 'test/utils';
import SettingsModule from '..';
import { USER_URL, USERS_URL, ROLES_URL } from '../routes';

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

    render(withAppContext(<SettingsModule />));

    expect(dispatch).toHaveBeenCalledWith(fetchRolesAction());
    expect(dispatch).toHaveBeenCalledWith(fetchPermissionsAction());
    expect(dispatch).toHaveBeenCalledWith(fetchDepartmentsAction());
  });

  it('should NOT initiate fetches on mount when session has not been authenticated', () => {
    jest.spyOn(auth, 'isAuthenticated').mockImplementation(() => false);

    expect(dispatch).not.toHaveBeenCalled();

    render(withAppContext(<SettingsModule />));

    expect(dispatch).not.toHaveBeenCalled();
  });

  it('should render login page', () => {
    jest.spyOn(auth, 'isAuthenticated').mockImplementation(() => false);

    const { queryByTestId, getByTestId, rerender } = render(withAppContext(<SettingsModule />));

    expect(getByTestId('loginPage')).toBeInTheDocument();

    jest.spyOn(auth, 'isAuthenticated').mockImplementation(() => true);

    rerender(withAppContext(<SettingsModule />));

    expect(queryByTestId('loginPage')).toBeNull();
  });

  it('should redirect to manage overview page', async () => {
    jest.spyOn(appSelectors, 'makeSelectUserCanAccess').mockImplementation(() => () => false);
    jest.spyOn(auth, 'isAuthenticated').mockImplementation(() => true);

    render(withAppContext(<SettingsModule />));

    expect(reactRouterDom.useLocation.mock.results.pop().value.pathname).toEqual('/manage/incidents');
  });

  it('should provide pages with a location that has a referrer', async () => {
    jest.spyOn(auth, 'isAuthenticated').mockImplementation(() => true);

    render(withAppContext(<SettingsModule />));

    act(() => history.push(`${USER_URL}/1`));

    act(() => history.push(`${USER_URL}/2`));

    const lastUseLocationResult = reactRouterDom.useLocation.mock.results.pop();

    await waitFor(() => expect(lastUseLocationResult.value.pathname).toEqual(`${USER_URL}/2`));
    await waitFor(() => expect(lastUseLocationResult.value.referrer).toEqual(`${USER_URL}/1`));
  });

  it('should allow routing to users pages', async () => {
    jest.spyOn(auth, 'isAuthenticated').mockImplementation(() => true);
    jest.spyOn(appSelectors, 'makeSelectUserCanAccess').mockImplementation(() => section => section !== 'groups');

    render(withAppContext(<SettingsModule />));

    // load users overview page
    act(() => history.push(USERS_URL));

    await waitFor(() => expect(reactRouterDom.useLocation.mock.results.pop().value.pathname).toEqual(USERS_URL));

    // load roles overview page (should not be allowed)
    act(() => history.push(ROLES_URL));

    await waitFor(() => expect(reactRouterDom.useLocation.mock.results.pop().value.pathname).not.toEqual(ROLES_URL));
  });

  it('should allow routing to groups pages', async () => {
    jest.spyOn(auth, 'isAuthenticated').mockImplementation(() => true);
    jest.spyOn(appSelectors, 'makeSelectUserCanAccess').mockImplementation(() => section => section !== 'users');

    render(withAppContext(<SettingsModule />));

    // load roles overview page
    act(() => history.push(ROLES_URL));

    await waitFor(() => expect(reactRouterDom.useLocation.mock.results.pop().value.pathname).toEqual(ROLES_URL));

    // load users overview page (should not be allowed)
    act(() => history.push(USERS_URL));

    await waitFor(() => expect(reactRouterDom.useLocation.mock.results.pop().value.pathname).not.toEqual(USERS_URL));
  });
});
