import React from 'react';
import { withRouter } from 'react-router';
import { createMemoryHistory } from 'history';
import { withAppContext, withCustomAppContext } from 'test/utils';
import { render, cleanup } from '@testing-library/react';

import {
  IncidentManagementModuleComponent,
  incidentDetailWrapper,
  incidentOverviewPageWrapper,
  incidentSplitContainerWrapper,
} from './';

const history = createMemoryHistory();

describe('signals/incident-management', () => {
  let props;
  let origSessionStorage;

  afterAll(() => {
    jest.restoreAllMocks();
  });

  afterEach(() => {
    cleanup();

    global.sessionStorage = origSessionStorage;
  });

  beforeEach(() => {
    props = {
      match: {
        isExact: false,
        params: {},
        path: '/manage/incidents',
        url: '/manage/incidents',
      },
      getFiltersAction: () => {},
    };

    origSessionStorage = global.sessionStorage;

    global.sessionStorage = {
      getItem: (key) => {
        switch (key) {
          case 'accessToken':
            return '42';
          default:
            return '';
        }
      },
      setItem: jest.fn(),
      removeItem: jest.fn(),
    };
  });

  it('should render correctly', () => {
    const { rerender, asFragment } = render(
      withAppContext(<IncidentManagementModuleComponent {...props} />),
    );
    const firstRender = asFragment();

    jest
      .spyOn(global.sessionStorage, 'getItem')
      .mockImplementationOnce(() => undefined);

    rerender(withAppContext(<IncidentManagementModuleComponent {...props} />));

    expect(
      firstRender.firstElementChild === asFragment().firstElementChild,
    ).toEqual(false);
  });

  describe('routing', () => {
    const loginText = 'Om deze pagina te zien dient u ingelogd te zijn.';

    it('can navigate to incident list', () => {
      history.push('/manage/incidents');

      jest
        .spyOn(global.sessionStorage, 'getItem')
        .mockImplementationOnce(() => undefined);

      const { rerender, queryByText } = render(
        withAppContext(<IncidentManagementModuleComponent {...props} />),
      );

      expect(queryByText(loginText)).not.toBeNull();

      rerender(
        withAppContext(<IncidentManagementModuleComponent {...props} />),
      );

      expect(queryByText(loginText)).toBeNull();
    });

    it('can navigate to incident detail', () => {
      history.push('/manage/incident/1101');

      jest
        .spyOn(global.sessionStorage, 'getItem')
        .mockImplementationOnce(() => undefined);

      const { rerender, queryByText } = render(
        withAppContext(<IncidentManagementModuleComponent {...props} />),
      );

      expect(queryByText(loginText)).not.toBeNull();

      rerender(
        withAppContext(<IncidentManagementModuleComponent {...props} />),
      );

      expect(queryByText(loginText)).toBeNull();
    });

    it('can navigate to incident split', () => {
      history.push('/manage/incident/1101/split');

      jest
        .spyOn(global.sessionStorage, 'getItem')
        .mockImplementationOnce(() => undefined);

      const { rerender, queryByText } = render(
        withAppContext(<IncidentManagementModuleComponent {...props} />),
      );

      expect(queryByText(loginText)).not.toBeNull();

      rerender(
        withAppContext(<IncidentManagementModuleComponent {...props} />),
      );

      expect(queryByText(loginText)).toBeNull();
    });
  });

  describe('route components', () => {
    beforeAll(() => {
      // silencing console errors because of missing props in rendered containers
      global.console.error = jest.fn();
    });

    afterAll(() => {
      global.console.error.mockRestore();
    });

    it('renders IncidentDetailWrapper', () => {
      const baseUrl = '/manage';
      const IncidentDetail = withRouter(incidentDetailWrapper(baseUrl));

      const { container } = render(
        withCustomAppContext(<IncidentDetail />)({
          routerCfg: { initialEntries: ['/manage/incident/1101'] },
        }),
      );

      expect(container.firstChild).toBeTruthy();
    });

    it('renders IncidentOverviewPageWrapper', () => {
      const baseUrl = '/manage';
      const IncidentOverviewPage = withRouter(
        incidentOverviewPageWrapper(baseUrl),
      );

      const { container } = render(
        withCustomAppContext(<IncidentOverviewPage />)({
          routerCfg: { initialEntries: ['/manage/incidents'] },
        }),
      );

      expect(container.firstChild).toBeTruthy();
    });

    it('renders IncidentSplitContainerWrapper', () => {
      const baseUrl = '/manage';
      const IncidentSplitContainer = withRouter(
        incidentSplitContainerWrapper(baseUrl),
      );

      const { container } = render(
        withCustomAppContext(<IncidentSplitContainer />)({
          routerCfg: { initialEntries: ['/manage/incident/1101/split'] },
        }),
      );

      expect(container.firstChild).toBeTruthy();
    });
  });
});
