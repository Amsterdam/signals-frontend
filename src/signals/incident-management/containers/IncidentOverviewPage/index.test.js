import React from 'react';
import { mount } from 'enzyme';
import { cloneDeep } from 'lodash';
import { fireEvent, render, cleanup } from '@testing-library/react';
import { disablePageScroll, enablePageScroll } from 'scroll-lock';

import { withAppContext } from 'test/utils';

import IncidentOverviewPage, {
  IncidentOverviewPageContainerComponent,
  mapDispatchToProps,
} from '.';
import { REQUEST_INCIDENTS, INCIDENT_SELECTED, GET_FILTERS } from './constants';

jest.mock('scroll-lock');

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
      onGetFilters: jest.fn(),
      baseUrl: '',
    };
  });

  afterEach(() => {
    cleanup();
    jest.resetAllMocks();
  });

  it('should render correctly', () => {
    const { queryByTestId, rerender, getByText } = render(
      withAppContext(<IncidentOverviewPageContainerComponent {...props} />),
    );

    expect(queryByTestId('incidentOverviewPagerComponent')).not.toBeNull();
    expect(queryByTestId('incidentOverviewListComponent')).not.toBeNull();
    expect(queryByTestId('loadingIndicator')).toBeNull();

    const loadingProps = cloneDeep(props);
    loadingProps.overviewpage.loading = true;

    rerender(
      withAppContext(
        <IncidentOverviewPageContainerComponent {...loadingProps} />,
      ),
    );

    expect(queryByTestId('incidentOverviewPagerComponent')).toBeNull();
    expect(queryByTestId('incidentOverviewListComponent')).toBeNull();
    expect(queryByTestId('loadingIndicator')).not.toBeNull();

    // filter button
    expect(getByText('Filteren').tagName).toEqual('BUTTON');
    expect(getByText('Mijn filters').tagName).toEqual('BUTTON');

    expect(props.onRequestIncidents).toBeCalledWith({});
    expect(props.onGetFilters).toBeCalledWith();
  });


  it('should render correctly with search query present', () => {
    render(
      withAppContext(<IncidentOverviewPageContainerComponent {...props} searchQuery="666" />),
    );

    expect(props.onRequestIncidents).toBeCalledWith({ filter: { searchQuery: '666' } });
  });

  it('should have props from structured selector', () => {
    const tree = mount(withAppContext(<IncidentOverviewPage />));

    const containerProps = tree
      .find(IncidentOverviewPageContainerComponent)
      .props();

    expect(containerProps.overviewpage).not.toBeUndefined();
    expect(containerProps.categories).not.toBeUndefined();
    expect(containerProps.loading).not.toBeUndefined();
    expect(containerProps.error).not.toBeUndefined();
    expect(containerProps.searchQuery).not.toBeUndefined();
  });

  it('should have props from action creator', () => {
    const tree = mount(withAppContext(<IncidentOverviewPage />));

    const containerProps = tree
      .find(IncidentOverviewPageContainerComponent)
      .props();

    expect(containerProps.onIncidentSelected).not.toBeUndefined();
    expect(typeof containerProps.onIncidentSelected).toEqual('function');

    expect(containerProps.onRequestIncidents).not.toBeUndefined();
    expect(typeof containerProps.onRequestIncidents).toEqual('function');

    expect(containerProps.onGetFilters).not.toBeUndefined();
    expect(typeof containerProps.onGetFilters).toEqual('function');
  });

  describe.skip('filter modal', async () => {
    it('opens modal', () => {
      const { queryByTestId, getByTestId } = render(
        withAppContext(<IncidentOverviewPage />),
      );

      expect(queryByTestId('filterModal')).toBeNull();

      fireEvent(
        getByTestId('filterModalBtn'),
        new MouseEvent('click', { bubbles: true }),
      );

      expect(queryByTestId('filterModal')).not.toBeNull();
    });

    it('closes modal on ESC', () => {
      const { queryByTestId, getByTestId } = render(
        withAppContext(<IncidentOverviewPage />),
      );

      fireEvent(
        getByTestId('filterModalBtn'),
        new MouseEvent('click', {
          bubbles: true,
        }),
      );

      expect(queryByTestId('filterModal')).not.toBeNull();

      fireEvent.keyDown(global.document, { key: 'Esc', keyCode: 27 });

      expect(queryByTestId('filterModal')).toBeNull();
    });

    it('closes modal by means of close button', () => {
      const { queryByTestId, getByTestId } = render(
        withAppContext(<IncidentOverviewPage />),
      );

      fireEvent(
        getByTestId('modalBtn'),
        new MouseEvent('click', {
          bubbles: true,
        }),
      );

      expect(queryByTestId('modal')).not.toBeNull();

      fireEvent(
        getByTestId('closeBtn'),
        new MouseEvent('click', {
          bubbles: true,
        }),
      );

      expect(queryByTestId('modal')).toBeNull();
    });

    it('should disable page scroll', () => {
      const { getByTestId } = render(withAppContext(<IncidentOverviewPage />));

      fireEvent(
        getByTestId('modalBtn'),
        new MouseEvent('click', {
          bubbles: true,
        }),
      );

      expect(disablePageScroll).toHaveBeenCalled();
    });

    it('should enable page scroll', () => {
      const { getByTestId } = render(withAppContext(<IncidentOverviewPage />));

      fireEvent(
        getByTestId('modalBtn'),
        new MouseEvent('click', {
          bubbles: true,
        }),
      );

      fireEvent(
        getByTestId('closeBtn'),
        new MouseEvent('click', {
          bubbles: true,
        }),
      );

      expect(enablePageScroll).toHaveBeenCalled();
    });
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

    it('should select an incident', () => {
      mapDispatchToProps(dispatch).onGetFilters();
      expect(dispatch).toHaveBeenCalledWith({
        type: GET_FILTERS,
      });
    });
  });
});
