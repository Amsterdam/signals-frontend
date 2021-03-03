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

const withSuspense = () =>
  withAppContext(
    <Suspense fallback={<div>Loading...</div>}>
      <IncidentManagementModule />
    </Suspense>
  );

describe('signals/incident-management', () => {
  beforeEach(() => {
    jest.spyOn(actions, 'getDistricts').mockImplementation(payload => ({ type: 'FOO', payload }));
    jest.spyOn(actions, 'getFilters').mockImplementation(payload => ({ type: 'BAR', payload }));
    jest.spyOn(actions, 'searchIncidents').mockImplementation(payload => ({ type: 'BAZ', payload }));
    jest.spyOn(actions, 'requestIncidents').mockImplementation(payload => ({ type: 'QUX', payload }));
    jest.spyOn(appSelectors, 'makeSelectUserCan').mockImplementation(() => () => true);
    fetch.mockResponses([JSON.stringify({}), { status: 200 }]);
  });

  afterEach(() => {
    jest.resetAllMocks();
    configuration.__reset();
    fetch.resetMocks();
  });

  describe('not authenticated', () => {
    it('should redirect to the login page', async () => {
      isAuthenticated.mockImplementation(() => false);
      const { findByTestId } = render(withSuspense());
      const loginPage = await findByTestId('loginPage');

      expect(loginPage).toBeInTheDocument();
    });

    it('should not fetch anything', async () => {
      isAuthenticated.mockImplementation(() => false);
      const { findByTestId } = render(withSuspense());
      await findByTestId('loginPage');

      expect(actions.getDistricts).not.toHaveBeenCalled();
      expect(actions.getFilters).not.toHaveBeenCalled();
      expect(actions.requestIncidents).not.toHaveBeenCalled();
      expect(actions.searchIncidents).not.toHaveBeenCalled();
      expect(fetch).not.toHaveBeenCalled();
    });
  });

  describe('login page', () => {
    it('should redirect when not authenticated', async () => {
      isAuthenticated.mockImplementation(() => false);
      const { findByTestId } = render(withSuspense());
      const loginPage = await findByTestId('loginPage');

      expect(loginPage).toBeInTheDocument();
    });

    it('should not redirect when authenticated', async () => {
      isAuthenticated.mockImplementation(() => true);
      const { findByTestId } = render(withSuspense());
      const incidentManagementOverviewPage = await findByTestId('incidentManagementOverviewPage');

      expect(incidentManagementOverviewPage).toBeInTheDocument();
    });
  });

  describe('fetching', () => {
    describe('districts', () => {
      describe('with fetchDistrictsFromBackend disabled', () => {
        it('should not fetch when not authenticated', async () => {
          isAuthenticated.mockImplementation(() => false);
          const { findByTestId } = render(withSuspense());
          await findByTestId('loginPage');

          expect(actions.getDistricts).not.toHaveBeenCalled();
        });

        it('should not fetch when authenticated', async () => {
          isAuthenticated.mockImplementation(() => true);
          const { findByTestId } = render(withSuspense());
          await findByTestId('incidentManagementOverviewPage');

          expect(actions.getDistricts).not.toHaveBeenCalled();
        });
      });
      describe('with fetchDistrictsFromBackend enabled', () => {
        it('should not fetch when not authenticated', async () => {
          configuration.featureFlags.fetchDistrictsFromBackend = true;
          isAuthenticated.mockImplementation(() => false);
          const { findByTestId } = render(withSuspense());
          await findByTestId('loginPage');

          expect(actions.getDistricts).not.toHaveBeenCalled();
        });

        it('should fetch when authenticated', async () => {
          configuration.featureFlags.fetchDistrictsFromBackend = true;
          isAuthenticated.mockImplementation(() => true);
          const { findByTestId } = render(withSuspense());
          await findByTestId('incidentManagementOverviewPage');

          expect(actions.getDistricts).toHaveBeenCalledTimes(1);
        });
      });
    });

    describe('filters', () => {
      it('should not fetch when not authenticated', async () => {
        isAuthenticated.mockImplementation(() => false);
        const { findByTestId } = render(withSuspense());
        await findByTestId('loginPage');

        expect(actions.getFilters).not.toHaveBeenCalled();
      });

      it('should fetch when authenticated', async () => {
        isAuthenticated.mockImplementation(() => true);
        const { findByTestId } = render(withSuspense());
        await findByTestId('incidentManagementOverviewPage');

        expect(actions.getFilters).toHaveBeenCalledTimes(1);
      });
    });

    describe('incidents', () => {
      it('should not fetch when not authenticated', async () => {
        isAuthenticated.mockImplementation(() => false);
        const { findByTestId } = render(withSuspense());
        await findByTestId('loginPage');

        expect(actions.requestIncidents).not.toHaveBeenCalled();
      });

      it('should fetch when authenticated', async () => {
        isAuthenticated.mockImplementation(() => true);
        const { findByTestId } = render(withSuspense());
        await findByTestId('incidentManagementOverviewPage');

        expect(actions.requestIncidents).toHaveBeenCalledTimes(1);
      });

      it('should not search when not authenticated', async () => {
        isAuthenticated.mockImplementation(() => false);
        const { findByTestId } = render(withSuspense());
        await findByTestId('loginPage');

        expect(actions.searchIncidents).not.toHaveBeenCalled();
      });

      it('should not search without search query', async () => {
        isAuthenticated.mockImplementation(() => true);
        const { findByTestId } = render(withSuspense());
        await findByTestId('incidentManagementOverviewPage');

        expect(actions.searchIncidents).not.toHaveBeenCalled();
      });

      it('should search with search query when authenticated', async () => {
        isAuthenticated.mockImplementation(() => true);
        const searchQuery = 'stoeptegels';
        jest.spyOn(appSelectors, 'makeSelectSearchQuery').mockImplementation(() => searchQuery);
        const { findByTestId } = render(withSuspense());
        await findByTestId('incidentManagementOverviewPage');

        expect(actions.searchIncidents).toHaveBeenCalledWith(searchQuery);
      });
    });

    describe('users', () => {
      it('should not fetch when not authenticated', async () => {
        isAuthenticated.mockImplementation(() => false);
        const { findByTestId } = render(withSuspense());
        await findByTestId('loginPage');

        expect(fetch).not.toHaveBeenCalled();
      });

      it('should fetch when authenticated', async () => {
        isAuthenticated.mockImplementation(() => true);
        const { findByTestId } = render(withSuspense());
        await findByTestId('incidentManagementOverviewPage');

        expect(fetch).toHaveBeenCalledTimes(1);
        expect(fetch).toHaveBeenCalledWith(configuration.USERS_ENDPOINT, expect.objectContaining({ method: 'GET' }));
      });
    });
  });

  describe('routing', () => {
    const loginText = 'Om deze pagina te zien dient u ingelogd te zijn.';

    describe('incident list', () => {
      it('should show warning when not authenticated', async () => {
        history.push('/manage/incidents');
        isAuthenticated.mockImplementation(() => false);
        const { findByTestId, queryByText } = render(withSuspense());
        await findByTestId('loginPage');

        expect(queryByText(loginText)).not.toBeNull();
      });

      it('should not show warning when authenticated', async () => {
        history.push('/manage/incidents');
        isAuthenticated.mockImplementation(() => true);
        const { findByTestId, queryByText } = render(withSuspense());
        await findByTestId('incidentManagementOverviewPage');

        expect(queryByText(loginText)).toBeNull();
      });
    });

    describe('incident detail', () => {
      it('should show warning when not authenticated', async () => {
        history.push('/manage/incident/1101');
        isAuthenticated.mockImplementation(() => false);
        const { findByTestId, queryByText } = render(withSuspense());
        await findByTestId('loginPage');

        expect(queryByText(loginText)).not.toBeNull();
      });

      it('should not show warning when authenticated', async () => {
        history.push('/manage/incident/1101');
        isAuthenticated.mockImplementation(() => true);
        const { findByTestId, queryByText } = render(withSuspense());
        await findByTestId('incidentManagementOverviewPage');

        expect(queryByText(loginText)).toBeNull();
      });
    });

    describe('incident split', () => {
      it('should show warning when not authenticated', async () => {
        history.push('/manage/incident/1101/split');
        isAuthenticated.mockImplementation(() => false);
        const { findByTestId, queryByText } = render(withSuspense());
        await findByTestId('loginPage');

        expect(queryByText(loginText)).not.toBeNull();
      });

      it('should not show warning when authenticated', async () => {
        history.push('/manage/incident/1101/split');
        isAuthenticated.mockImplementation(() => true);
        const { findByTestId, queryByText } = render(withSuspense());
        await findByTestId('incidentManagementOverviewPage');

        expect(queryByText(loginText)).toBeNull();
      });
    });

    it('will use overview page as routing fallback', async () => {
      isAuthenticated.mockImplementation(() => true);
      const { findByTestId } = render(withSuspense());
      await findByTestId('incidentManagementOverviewPage');

      history.push('/manage/this-url-definitely-does-not-exist');

      expect(await findByTestId('incidentManagementOverviewPage')).toBeInTheDocument();
    });
  });
});
