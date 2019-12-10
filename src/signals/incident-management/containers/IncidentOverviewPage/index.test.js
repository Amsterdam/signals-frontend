import React from 'react';
import { mount } from 'enzyme';
import cloneDeep from 'lodash.clonedeep';
import { fireEvent, render } from '@testing-library/react';
import { disablePageScroll, enablePageScroll } from 'scroll-lock';

import { withAppContext } from 'test/utils';
import {
  priorityList,
  statusList,
  stadsdeelList,
  feedbackList,
} from 'signals/incident-management/definitions';
import * as constants from 'signals/incident-management/constants';
import { pageIncidentsChanged } from 'signals/incident-management/actions';

import IncidentOverviewPage, {
  IncidentOverviewPageContainerComponent,
  mapDispatchToProps,
} from '.';
import { REQUEST_INCIDENTS } from './constants';

jest.mock('scroll-lock');
jest.mock('signals/incident-management/constants');
jest.mock('signals/incident-management/actions', () => {
  const actual = jest.requireActual('signals/incident-management/actions');
  // eslint-disable-next-line
  const { PAGE_INCIDENTS_CHANGED } = require('signals/incident-management/constants');

  return {
    __esModule: true,
    ...actual,
    pageIncidentsChanged: jest.fn(page => ({
      type: PAGE_INCIDENTS_CHANGED,
      payload: page,
    })),
  };
});
jest.mock('./selectors', () => {
  const actual = jest.requireActual('./selectors');
  // eslint-disable-next-line
  const incident = require('utils/__tests__/fixtures/incident.json');

  return {
    __esModule: true,
    ...actual,
    makeSelectOverviewPage: jest.fn(() => ({
      ...actual.makeSelectOverviewPage,
      incidents: [...new Array(100).keys()].map(index => ({
        ...incident,
        id: index,
      })),
      loading: false,
    })),
    makeSelectIncidentsCount: jest.fn(() => 100),
  };
});

describe('signals/incident-management/containers/IncidentOverviewPage', () => {
  let props;

  beforeEach(() => {
    props = {
      overviewpage: {
        incidents: [],
        loading: false,
      },
      page: 3,
      incidentsCount: 100,
      categories: {},
      onRequestIncidents: jest.fn(),
      onChangeOrdering: jest.fn(),
      onPageIncidentsChanged: jest.fn(),
      baseUrl: '',
      dataLists: {
        priority: priorityList,
        status: statusList,
        stadsdeel: stadsdeelList,
        feedback: feedbackList,
      },
    };
  });

  it('should render correctly', () => {
    const { queryByTestId, rerender, getByText } = render(
      withAppContext(<IncidentOverviewPageContainerComponent {...props} />)
    );

    expect(queryByTestId('pagination')).not.toBeNull();
    expect(queryByTestId('incidentOverviewListComponent')).not.toBeNull();
    expect(queryByTestId('loadingIndicator')).toBeNull();

    const loadingProps = cloneDeep(props);
    loadingProps.overviewpage.loading = true;

    rerender(
      withAppContext(
        <IncidentOverviewPageContainerComponent {...loadingProps} />
      )
    );

    expect(queryByTestId('incidentOverviewPagerComponent')).toBeNull();
    expect(queryByTestId('incidentOverviewListComponent')).toBeNull();
    expect(queryByTestId('loadingIndicator')).not.toBeNull();

    // filter button
    expect(getByText('Filteren').tagName).toEqual('BUTTON');
    expect(getByText('Mijn filters').tagName).toEqual('BUTTON');

    expect(props.onRequestIncidents).toBeCalledWith();
  });

  it.only('should show notification when no results can be rendered', () => {
    const { getByText } = render(
      withAppContext(<IncidentOverviewPageContainerComponent {...props} incidentsCount={0} />)
    );

    expect(getByText('Geen meldingen')).toBeInTheDocument();
  });

  it('should have props from structured selector', () => {
    const tree = mount(withAppContext(<IncidentOverviewPage />));

    const containerProps = tree
      .find(IncidentOverviewPageContainerComponent)
      .props();

    expect(containerProps.overviewpage).not.toBeUndefined();
    expect(containerProps.categories).not.toBeUndefined();
  });

  it('should have props from action creator', () => {
    const tree = mount(withAppContext(<IncidentOverviewPage />));

    const containerProps = tree
      .find(IncidentOverviewPageContainerComponent)
      .props();

    expect(containerProps.onRequestIncidents).not.toBeUndefined();
    expect(typeof containerProps.onRequestIncidents).toEqual('function');

    expect(containerProps.onPageIncidentsChanged).not.toBeUndefined();
    expect(typeof containerProps.onPageIncidentsChanged).toEqual('function');

    expect(containerProps.onChangeOrdering).not.toBeUndefined();
    expect(typeof containerProps.onChangeOrdering).toEqual('function');
  });

  it('should scroll page to top after navigating with pagination', async () => {
    constants.FILTER_PAGE_SIZE = 30;
    Object.defineProperty(window, 'scrollTo', {
      value: () => { },
      writable: true,
    });
    const scrollSpy = jest.spyOn(window, 'scrollTo');

    const { getByTestId } = render(withAppContext(<IncidentOverviewPage />));

    fireEvent.click(
      getByTestId('pagination').querySelector('button:first-of-type')
    );

    expect(scrollSpy).toHaveBeenCalledWith(0, 0);
    expect(pageIncidentsChanged).toHaveBeenCalledWith(2);
  });

  describe('filter modal', () => {
    it('opens filter modal', () => {
      const { queryByTestId, getByTestId } = render(
        withAppContext(<IncidentOverviewPage />)
      );

      expect(queryByTestId('filterModal')).toBeNull();

      fireEvent(
        getByTestId('filterModalBtn'),
        new MouseEvent('click', { bubbles: true })
      );

      expect(queryByTestId('filterModal')).not.toBeNull();
    });

    it('opens my filters modal', () => {
      const { queryByTestId, getByTestId } = render(
        withAppContext(<IncidentOverviewPage />)
      );

      expect(queryByTestId('myFiltersModal')).toBeNull();

      fireEvent(
        getByTestId('myFiltersModalBtn'),
        new MouseEvent('click', { bubbles: true })
      );

      expect(queryByTestId('myFiltersModal')).not.toBeNull();
    });

    it('closes modal on ESC', () => {
      const { queryByTestId, getByTestId } = render(
        withAppContext(<IncidentOverviewPage />)
      );

      fireEvent(
        getByTestId('filterModalBtn'),
        new MouseEvent('click', {
          bubbles: true,
        })
      );

      expect(queryByTestId('filterModal')).not.toBeNull();

      fireEvent.keyDown(global.document, { key: 'Esc', keyCode: 27 });

      expect(queryByTestId('filterModal')).toBeNull();
    });

    it('closes modal by means of close button', () => {
      const { queryByTestId, getByTestId } = render(
        withAppContext(<IncidentOverviewPage />)
      );

      fireEvent(
        getByTestId('filterModalBtn'),
        new MouseEvent('click', {
          bubbles: true,
        })
      );

      expect(queryByTestId('filterModal')).not.toBeNull();

      fireEvent(
        getByTestId('closeBtn'),
        new MouseEvent('click', {
          bubbles: true,
        })
      );

      expect(queryByTestId('filterModal')).toBeNull();
    });

    it('should disable page scroll', () => {
      const { getByTestId } = render(withAppContext(<IncidentOverviewPage />));

      fireEvent(
        getByTestId('filterModalBtn'),
        new MouseEvent('click', {
          bubbles: true,
        })
      );

      expect(disablePageScroll).toHaveBeenCalled();
    });

    it('should enable page scroll', () => {
      const { getByTestId } = render(withAppContext(<IncidentOverviewPage />));

      fireEvent(
        getByTestId('filterModalBtn'),
        new MouseEvent('click', {
          bubbles: true,
        })
      );

      fireEvent(
        getByTestId('closeBtn'),
        new MouseEvent('click', {
          bubbles: true,
        })
      );

      expect(enablePageScroll).toHaveBeenCalled();
    });
  });

  describe('mapDispatchToProps', () => {
    const dispatch = jest.fn();

    it('should request incidents', () => {
      mapDispatchToProps(dispatch).onRequestIncidents();
      expect(dispatch).toHaveBeenCalledWith({
        type: REQUEST_INCIDENTS,
      });
    });
  });
});
