import React from 'react';
import { mount } from 'enzyme';
import { createMemoryHistory } from 'history';
import { withAppContext } from 'test/utils';
import { render } from '@testing-library/react';
import { isAuthenticated } from 'shared/services/auth/auth';
import configuration from 'shared/services/configuration/configuration';

import IncidentManagementModule, { IncidentManagementModuleComponent } from '..';

const history = createMemoryHistory();

jest.mock('shared/services/auth/auth');

describe('signals/incident-management', () => {
  let props;

  afterAll(() => {
    jest.restoreAllMocks();
  });

  beforeEach(() => {
    props = {
      fetchCategoriesAction: jest.fn(),
      getDistrictsAction: jest.fn(),
      getFiltersAction: jest.fn(),
      requestIncidentsAction: jest.fn(),
      searchIncidentsAction: jest.fn(),
    };
  });

  it('should have props from structured selector', () => {
    const tree = mount(withAppContext(<IncidentManagementModule />));

    const moduleProps = tree.find(IncidentManagementModuleComponent).props();

    expect(moduleProps.searchQuery).toBeDefined();
  });

  it('should have props from action creator', () => {
    const tree = mount(withAppContext(<IncidentManagementModule />));

    const containerProps = tree.find(IncidentManagementModuleComponent).props();

    expect(containerProps.getDistrictsAction).toBeDefined();
    expect(typeof containerProps.getDistrictsAction).toEqual('function');

    expect(containerProps.getFiltersAction).toBeDefined();
    expect(typeof containerProps.getFiltersAction).toEqual('function');

    expect(containerProps.requestIncidentsAction).toBeDefined();
    expect(typeof containerProps.requestIncidentsAction).toEqual('function');

    expect(containerProps.searchIncidentsAction).toBeDefined();
    expect(typeof containerProps.searchIncidentsAction).toEqual('function');

    expect(containerProps.fetchCategoriesAction).toBeDefined();
    expect(typeof containerProps.fetchCategoriesAction).toEqual('function');
  });

  it('should render correctly', () => {
    localStorage.getItem.mockImplementationOnce(() => 'token');

    const { rerender, asFragment } = render(withAppContext(<IncidentManagementModuleComponent {...props} />));
    const firstRender = asFragment();

    localStorage.getItem.mockImplementationOnce(() => undefined);

    rerender(withAppContext(<IncidentManagementModuleComponent {...props} />));

    expect(firstRender.firstElementChild === asFragment().firstElementChild).toEqual(false);
  });

  describe('fetching', () => {
    it('should not request districts on mount by default', () => {
      isAuthenticated.mockImplementation(() => false);

      render(withAppContext(<IncidentManagementModuleComponent {...props} />));

      expect(props.getDistrictsAction).not.toHaveBeenCalled();

      isAuthenticated.mockImplementation(() => true);

      render(withAppContext(<IncidentManagementModuleComponent {...props} />));

      expect(props.getDistrictsAction).not.toHaveBeenCalled();
    });

    it('should request districts on mount with feature flag enabled', () => {
      configuration.fetchDistrictsFromBackend = true;

      isAuthenticated.mockImplementation(() => false);

      render(withAppContext(<IncidentManagementModuleComponent {...props} />));

      expect(props.getDistrictsAction).not.toHaveBeenCalled();

      isAuthenticated.mockImplementation(() => true);

      render(withAppContext(<IncidentManagementModuleComponent {...props} />));

      expect(props.getDistrictsAction).toHaveBeenCalledTimes(1);
    });

    it('should request filters on mount', () => {
      isAuthenticated.mockImplementation(() => false);

      render(withAppContext(<IncidentManagementModuleComponent {...props} />));

      expect(props.getFiltersAction).not.toHaveBeenCalled();

      isAuthenticated.mockImplementation(() => true);

      render(withAppContext(<IncidentManagementModuleComponent {...props} />));

      expect(props.getFiltersAction).toHaveBeenCalledTimes(1);
    });

    it('should request categories on mount', () => {
      isAuthenticated.mockImplementation(() => false);

      render(withAppContext(<IncidentManagementModuleComponent {...props} />));

      expect(props.fetchCategoriesAction).not.toHaveBeenCalled();

      isAuthenticated.mockImplementation(() => true);

      render(withAppContext(<IncidentManagementModuleComponent {...props} />));

      expect(props.fetchCategoriesAction).toHaveBeenCalledTimes(1);
    });

    it('should request incidents on mount', () => {
      isAuthenticated.mockImplementation(() => false);

      render(withAppContext(<IncidentManagementModuleComponent {...props} />));

      expect(props.requestIncidentsAction).not.toHaveBeenCalled();

      isAuthenticated.mockImplementation(() => true);

      render(withAppContext(<IncidentManagementModuleComponent {...props} />));

      expect(props.requestIncidentsAction).toHaveBeenCalledTimes(1);
    });

    it('should search incidents on mount', () => {
      isAuthenticated.mockImplementation(() => false);

      render(withAppContext(<IncidentManagementModuleComponent {...props} />));

      expect(props.searchIncidentsAction).not.toHaveBeenCalled();

      isAuthenticated.mockImplementation(() => true);

      render(withAppContext(<IncidentManagementModuleComponent {...props} />));

      expect(props.searchIncidentsAction).not.toHaveBeenCalled();

      render(withAppContext(<IncidentManagementModuleComponent {...props} searchQuery="stoeptegels" />));

      expect(props.searchIncidentsAction).toHaveBeenCalledWith('stoeptegels');
    });
  });

  describe('routing', () => {
    const loginText = 'Om deze pagina te zien dient u ingelogd te zijn.';

    it('can navigate to incident list', () => {
      history.push('/manage/incidents');

      isAuthenticated.mockImplementation(() => false);

      const { rerender, queryByText } = render(withAppContext(<IncidentManagementModuleComponent {...props} />));

      expect(queryByText(loginText)).not.toBeNull();

      isAuthenticated.mockImplementation(() => true);

      rerender(withAppContext(<IncidentManagementModuleComponent {...props} />));

      expect(queryByText(loginText)).toBeNull();
    });

    it('can navigate to incident detail', () => {
      history.push('/manage/incident/1101');

      isAuthenticated.mockImplementation(() => false);

      const { rerender, queryByText } = render(withAppContext(<IncidentManagementModuleComponent {...props} />));

      expect(queryByText(loginText)).not.toBeNull();

      isAuthenticated.mockImplementation(() => true);

      rerender(withAppContext(<IncidentManagementModuleComponent {...props} />));

      expect(queryByText(loginText)).toBeNull();
    });

    it('can navigate to incident split', () => {
      history.push('/manage/incident/1101/split');

      isAuthenticated.mockImplementation(() => false);

      const { rerender, queryByText } = render(withAppContext(<IncidentManagementModuleComponent {...props} />));

      expect(queryByText(loginText)).not.toBeNull();

      isAuthenticated.mockImplementation(() => true);

      rerender(withAppContext(<IncidentManagementModuleComponent {...props} />));

      expect(queryByText(loginText)).toBeNull();
    });

    it('will use overview page as routing fallback', () => {
      isAuthenticated.mockImplementation(() => true);

      history.push('/manage/this-url-definitely-does-not-exist');

      const { getByTestId } = render(withAppContext(<IncidentManagementModuleComponent {...props} />));

      expect(getByTestId('incidentManagementOverviewPage')).toBeInTheDocument();
    });
  });
});
