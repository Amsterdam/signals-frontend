import React from 'react';
import { mount } from 'enzyme';
import { fireEvent, render, act } from '@testing-library/react';
import { disablePageScroll, enablePageScroll } from 'scroll-lock';
import incidentJson from 'utils/__tests__/fixtures/incident.json';

import { withAppContext } from 'test/utils';
import * as constants from 'signals/incident-management/constants';

import IncidentOverviewPage, {
  IncidentOverviewPageContainerComponent,
} from '.';

jest.mock('scroll-lock');
jest.mock('signals/incident-management/constants');
jest.mock('signals/incident-management/actions', () => {
  const actual = jest.requireActual('signals/incident-management/actions');
  const {
    PAGE_CHANGED,
    // eslint-disable-next-line
  } = require('signals/incident-management/constants');

  return {
    __esModule: true,
    ...actual,
    pageChanged: jest.fn(page => ({
      type: PAGE_CHANGED,
      payload: page,
    })),
  };
});

// mocking the return value of selectors for underlying components
jest.mock('models/categories/selectors', () => {
  // eslint-disable-next-line global-require
  const cats = require('utils/__tests__/fixtures/categories_structured.json');
  return {
    __esModule: true,
    ...jest.requireActual('models/categories/selectors'),
    makeSelectStructuredCategories: jest.fn(() => cats),
  };
});

// make sure that JSDOM doesn't trip over unsupported feature
Object.defineProperty(window, 'scrollTo', {
  value: () => {},
  writable: true,
});

const generateIncidents = (number = 100) =>
  [...new Array(number).keys()].map(index => ({
    ...incidentJson,
    id: index + 1,
  }));

describe('signals/incident-management/containers/IncidentOverviewPage', () => {
  let props;

  beforeEach(() => {
    constants.FILTER_PAGE_SIZE = 50;

    props = {
      incidents: {
        count: 0,
        results: [],
        loading: true,
      },
      page: 3,
      categories: {},
      orderingChangedAction: jest.fn(),
      pageChangedAction: jest.fn(),
    };
  });

  it('should render modal buttons', () => {
    const { getByText } = render(
      withAppContext(<IncidentOverviewPageContainerComponent {...props} />)
    );

    expect(getByText('Filteren').tagName).toEqual('BUTTON');
    expect(getByText('Mijn filters').tagName).toEqual('BUTTON');
  });

  it('should render a list of incidents', () => {
    const { queryByTestId, rerender } = render(
      withAppContext(<IncidentOverviewPageContainerComponent {...props} />)
    );

    expect(queryByTestId('loadingIndicator')).toBeInTheDocument();
    expect(
      queryByTestId('incidentOverviewListComponent')
    ).not.toBeInTheDocument();

    const incidents = generateIncidents();

    rerender(
      withAppContext(
        <IncidentOverviewPageContainerComponent
          {...props}
          incidents={{
            count: incidents.length,
            results: incidents,
            loading: false,
          }}
        />
      )
    );

    expect(queryByTestId('loadingIndicator')).not.toBeInTheDocument();
    expect(queryByTestId('incidentOverviewListComponent')).toBeInTheDocument();
  });

  it('should render pagination controls', () => {
    constants.FILTER_PAGE_SIZE = 101;
    const incidents = generateIncidents();

    const { queryByTestId } = render(
      withAppContext(
        <IncidentOverviewPageContainerComponent
          {...props}
          incidents={{
            count: incidents.length,
            results: incidents,
            loading: false,
          }}
        />
      )
    );

    expect(queryByTestId('pagination')).not.toBeInTheDocument();

    constants.FILTER_PAGE_SIZE = 100;

    render(
      withAppContext(
        <IncidentOverviewPageContainerComponent
          {...props}
          incidents={{
            count: incidents.length,
            results: incidents,
            loading: false,
          }}
        />
      )
    );

    expect(queryByTestId('pagination')).not.toBeInTheDocument();

    constants.FILTER_PAGE_SIZE = 99;

    render(
      withAppContext(
        <IncidentOverviewPageContainerComponent
          {...props}
          incidents={{
            count: incidents.length,
            results: incidents,
            loading: false,
          }}
        />
      )
    );

    expect(queryByTestId('pagination')).toBeInTheDocument();
  });

  it('should show notification when no results can be rendered', () => {
    const { getByText } = render(
      withAppContext(<IncidentOverviewPageContainerComponent {...props} />)
    );

    expect(getByText('Geen meldingen')).toBeInTheDocument();
  });

  it('should have props from structured selector', () => {
    const tree = mount(withAppContext(<IncidentOverviewPage />));

    const containerProps = tree
      .find(IncidentOverviewPageContainerComponent)
      .props();

    expect(containerProps.activeFilter).not.toBeUndefined();
    expect(containerProps.ordering).not.toBeUndefined();
    expect(containerProps.page).not.toBeUndefined();
  });

  it('should have props from action creator', () => {
    const tree = mount(withAppContext(<IncidentOverviewPage />));

    const containerProps = tree
      .find(IncidentOverviewPageContainerComponent)
      .props();

    expect(containerProps.pageChangedAction).not.toBeUndefined();
    expect(typeof containerProps.pageChangedAction).toEqual('function');

    expect(containerProps.orderingChangedAction).not.toBeUndefined();
    expect(typeof containerProps.orderingChangedAction).toEqual('function');
  });

  it('should set page after navigating with pagination', () => {
    constants.FILTER_PAGE_SIZE = 30;

    const incidents = generateIncidents();

    const { getByTestId } = render(
      withAppContext(
        <IncidentOverviewPageContainerComponent
          {...props}
          incidents={{
            count: incidents.length,
            results: incidents,
            loading: false,
          }}
        />
      )
    );

    expect(props.pageChangedAction).not.toHaveBeenCalled();

    const firstButton = getByTestId('pagination').querySelector(
      'button:first-of-type'
    );
    const pagenum = parseInt(firstButton.dataset.pagenum, 10);

    act(() => {
      fireEvent.click(firstButton);
    });

    expect(props.pageChangedAction).toHaveBeenCalledWith(pagenum);
  });

  it('should render a map', async () => {
    const incidents = generateIncidents();

    const { queryByTestId, getByTestId, findByTestId, unmount } = render(
      withAppContext(
        <IncidentOverviewPageContainerComponent
          {...props}
          incidents={{
            count: incidents.length,
            results: incidents,
            loading: false,
          }}
        />
      )
    );

    expect(getByTestId('subNav')).toBeInTheDocument();

    expect(getByTestId('incidentOverviewListComponent')).toBeInTheDocument();
    expect(queryByTestId('24HourMap')).not.toBeInTheDocument();

    const subNavMapLink = await findByTestId('subNavMapLink');

    act(() => {
      fireEvent.click(subNavMapLink);
    });

    const subNavListLink = await findByTestId('subNavListLink');

    expect(queryByTestId('incidentOverviewListComponent')).not.toBeInTheDocument();
    expect(getByTestId('24HourMap')).toBeInTheDocument();

    act(() => {
      fireEvent.click(subNavListLink);
    });

    await findByTestId('subNavMapLink');

    expect(getByTestId('incidentOverviewListComponent')).toBeInTheDocument();
    expect(queryByTestId('24HourMap')).not.toBeInTheDocument();

    unmount();
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
});
