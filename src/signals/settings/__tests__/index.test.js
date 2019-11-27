import React from 'react';
import { render } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import * as auth from 'shared/services/auth/auth';
import * as reactRouterDom from 'react-router-dom';

import { withAppContext, history } from 'test/utils';
import SettingsModule from '..';
import { USER_URL } from '../routes';

jest.mock('react-router-dom', () => ({
  __esModule: true,
  ...jest.requireActual('react-router-dom'),
}));

describe('signals/settings', () => {
  beforeEach(() => {
    jest.spyOn(reactRouterDom, 'useLocation');
  });

  afterEach(() => {
    history.entries = [];
    reactRouterDom.useLocation.mockRestore();
  });

  it('should render login page', async () => {
    jest.spyOn(auth, 'isAuthenticated').mockImplementationOnce(() => false);

    const { queryByTestId, getByTestId, rerender } = await render(
      withAppContext(<SettingsModule />)
    );

    expect(getByTestId('loginPage')).toBeInTheDocument();

    jest.spyOn(auth, 'isAuthenticated').mockImplementationOnce(() => true);

    rerender(withAppContext(<SettingsModule />));

    expect(queryByTestId('loginPage')).toBeNull();
  });

  it('should render a 404', async () => {
    jest.spyOn(auth, 'isAuthenticated').mockImplementation(() => true);

    const { getByTestId } = await render(withAppContext(<SettingsModule />));

    expect(getByTestId('notFoundPage')).toBeInTheDocument();
  });

  it.only('should provide pages with a location that has a referrer', async () => {
    jest.spyOn(auth, 'isAuthenticated').mockImplementation(() => true);

    await render(withAppContext(<SettingsModule />));

    await act(async () => history.push(`${USER_URL}/1`));

    await act(async () => history.push(`${USER_URL}/2`));

    const lastUseLocationResult = reactRouterDom.useLocation.mock.results.pop();

    expect(lastUseLocationResult.value.pathname).toEqual(`${USER_URL}/2`);
    expect(lastUseLocationResult.value.referrer).toEqual(`${USER_URL}/1`);
  });
});
