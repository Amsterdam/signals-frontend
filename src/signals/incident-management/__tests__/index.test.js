import React, { Suspense } from 'react';
import { createMemoryHistory } from 'history';
import { withAppContext } from 'test/utils';
import { render } from '@testing-library/react';

import { isAuthenticated } from 'shared/services/auth/auth';
import configuration from 'shared/services/configuration/configuration';
import * as appSelectors from 'containers/App/selectors';

import * as actions from '../actions';
import IncidentManagementModule from '..';

const history = createMemoryHistory();

jest.mock('shared/services/configuration/configuration');
jest.mock('shared/services/auth/auth');
jest.mock('containers/App/selectors');
jest.mock('../actions');

const withSuspense = () => withAppContext(<Suspense fallback={<div>Loading...</div>}><IncidentManagementModule /></Suspense>);

describe('signals/incident-management', () => {
  beforeEach(() => {
    jest.spyOn(actions, 'getDistricts').mockImplementation(payload => ({ type: 'FOO', payload }));
    jest.spyOn(actions, 'getFilters').mockImplementation(payload => ({ type: 'BAR', payload }));
    jest.spyOn(actions, 'searchIncidents').mockImplementation(payload => ({ type: 'BAZ', payload }));
    jest.spyOn(actions, 'requestIncidents').mockImplementation(payload => ({ type: 'QUX', payload }));
  });

  afterEach(() => {
    jest.resetAllMocks();
    configuration.__reset();
  });

  it('should redirect to login page', async () => {
    isAuthenticated.mockImplementation(() => false);

    const { findByTestId, rerender } = render(withSuspense());

    const loginPage = await findByTestId('loginPage');

    expect(loginPage).toBeInTheDocument();

    isAuthenticated.mockImplementation(() => true);

    rerender(withSuspense());

    const incidentManagementOverviewPage = await findByTestId('incidentManagementOverviewPage');

    expect(incidentManagementOverviewPage).toBeInTheDocument();
  });

  describe('fetching', () => {
    it('should not request districts on mount by default', () => {
      isAuthenticated.mockImplementation(() => false);

      render(withSuspense());

      expect(actions.getDistricts).not.toHaveBeenCalled();

      isAuthenticated.mockImplementation(() => true);

      render(withSuspense());

      expect(actions.getDistricts).not.toHaveBeenCalled();
    });

    it('should request districts on mount with feature flag enabled', () => {
      configuration.fetchDistrictsFromBackend = true;

      isAuthenticated.mockImplementation(() => false);

      render(withSuspense());

      expect(actions.getDistricts).not.toHaveBeenCalled();

      isAuthenticated.mockImplementation(() => true);

      render(withSuspense());

      expect(actions.getDistricts).toHaveBeenCalledTimes(1);
    });

    it('should request filters on mount', () => {
      isAuthenticated.mockImplementation(() => false);

      render(withSuspense());

      expect(actions.getFilters).not.toHaveBeenCalled();

      isAuthenticated.mockImplementation(() => true);

      render(withSuspense());

      expect(actions.getFilters).toHaveBeenCalledTimes(1);
    });

    it('should request incidents on mount', () => {
      isAuthenticated.mockImplementation(() => false);

      render(withSuspense());

      expect(actions.requestIncidents).not.toHaveBeenCalled();

      isAuthenticated.mockImplementation(() => true);

      render(withSuspense());

      expect(actions.requestIncidents).toHaveBeenCalledTimes(1);
    });

    it('should search incidents on mount', () => {
      isAuthenticated.mockImplementation(() => false);

      render(withSuspense());

      expect(actions.searchIncidents).not.toHaveBeenCalled();

      isAuthenticated.mockImplementation(() => true);

      render(withSuspense());

      expect(actions.searchIncidents).not.toHaveBeenCalled();

      const searchQuery = 'stoeptegels';
      jest.spyOn(appSelectors, 'makeSelectSearchQuery').mockImplementation(() => searchQuery);

      render(withSuspense());

      expect(actions.searchIncidents).toHaveBeenCalledWith(searchQuery);
    });
  });

  describe('routing', () => {
    const loginText = 'Om deze pagina te zien dient u ingelogd te zijn.';

    it('can navigate to incident list', () => {
      history.push('/manage/incidents');

      isAuthenticated.mockImplementation(() => false);

      const { rerender, queryByText } = render(withSuspense());

      expect(queryByText(loginText)).not.toBeNull();

      isAuthenticated.mockImplementation(() => true);

      rerender(withSuspense());

      expect(queryByText(loginText)).toBeNull();
    });

    it('can navigate to incident detail', () => {
      history.push('/manage/incident/1101');

      isAuthenticated.mockImplementation(() => false);

      const { rerender, queryByText } = render(withSuspense());

      expect(queryByText(loginText)).not.toBeNull();

      isAuthenticated.mockImplementation(() => true);

      rerender(withSuspense());

      expect(queryByText(loginText)).toBeNull();
    });

    it('can navigate to incident split', () => {
      history.push('/manage/incident/1101/split');

      isAuthenticated.mockImplementation(() => false);

      const { rerender, queryByText } = render(withSuspense());

      expect(queryByText(loginText)).not.toBeNull();

      isAuthenticated.mockImplementation(() => true);

      rerender(withSuspense());

      expect(queryByText(loginText)).toBeNull();
    });

    it('will use overview page as routing fallback', () => {
      isAuthenticated.mockImplementation(() => true);

      history.push('/manage/this-url-definitely-does-not-exist');

      const { getByTestId } = render(withSuspense());

      expect(getByTestId('incidentManagementOverviewPage')).toBeInTheDocument();
    });
  });
});
