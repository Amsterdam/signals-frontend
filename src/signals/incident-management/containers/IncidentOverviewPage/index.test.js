import React from 'react';
import { mount } from 'enzyme';
import cloneDeep from 'lodash.clonedeep';
import { render, cleanup } from '@testing-library/react';

import { withAppContext } from 'test/utils';

import IncidentOverviewPage, {
  IncidentOverviewPageContainerComponent,
  mapDispatchToProps,
} from './';
import { REQUEST_INCIDENTS, INCIDENT_SELECTED } from './constants';

describe('signals/incident-management/containers/IncidentOverviewPage', () => {
  let props;

  beforeEach(() => {
    props = {
      overviewpage: {
        incidents: [],
        loading: false,
        filter: {},
        incidentsCount: 666,
        page: 3,
        priorityList: [],
        stadsdeelList: [],
        statusList: [],
      },
      categories: {},
      onRequestIncidents: jest.fn(),
      onIncidentSelected: jest.fn(),
      onMainCategoryFilterSelectionChanged: jest.fn(),
      baseUrl: '',
    };
  });

  afterEach(() => {
    cleanup();
    jest.resetAllMocks();
  });

  it('should render correctly', () => {
    const { queryByTestId, rerender } = render(
      withAppContext(<IncidentOverviewPageContainerComponent {...props} />),
    );

    expect(queryByTestId('incidentOverviewPagerComponent')).not.toBeNull();
    expect(queryByTestId('incidentOverviewListComponent')).not.toBeNull();
    expect(queryByTestId('loadingIndicator')).toBeNull();

    const loadingProps = cloneDeep(props);
    loadingProps.overviewpage.loading = true;

    rerender(
      withAppContext(<IncidentOverviewPageContainerComponent {...loadingProps} />),
    );

    expect(queryByTestId('incidentOverviewPagerComponent')).toBeNull();
    expect(queryByTestId('incidentOverviewListComponent')).toBeNull();
    expect(queryByTestId('loadingIndicator')).not.toBeNull();
  });

  it('should have props from structured selector', () => {
    const tree = mount(withAppContext(
      <IncidentOverviewPage />
    ));

    const containerProps = tree.find(IncidentOverviewPageContainerComponent).props();

    expect(containerProps.overviewpage).not.toBeUndefined();
    expect(containerProps.categories).not.toBeUndefined();
    expect(containerProps.loading).not.toBeUndefined();
    expect(containerProps.error).not.toBeUndefined();
  });

  it('should have props from action creator', () => {
    const tree = mount(withAppContext(
      <IncidentOverviewPage />
    ));

    const containerProps = tree.find(IncidentOverviewPageContainerComponent).props();

    expect(containerProps.onIncidentSelected).not.toBeUndefined();
    expect(typeof containerProps.onIncidentSelected).toEqual('function');

    expect(containerProps.onRequestIncidents).not.toBeUndefined();
    expect(typeof containerProps.onRequestIncidents).toEqual('function');
  });

  describe('mapDispatchToProps', () => {
    const dispatch = jest.fn();

    it('should request incidents', () => {
      mapDispatchToProps(dispatch).onRequestIncidents({
        filter: {},
        page: 666,
      });
      expect(dispatch).toHaveBeenCalledWith({
        type: REQUEST_INCIDENTS,
        payload: { filter: {}, page: 666 },
      });
    });

    it('should select an incident', () => {
      mapDispatchToProps(dispatch).onIncidentSelected({ id: 666 });
      expect(dispatch).toHaveBeenCalledWith({
        type: INCIDENT_SELECTED,
        payload: { id: 666 },
      });
    });
  });
});
