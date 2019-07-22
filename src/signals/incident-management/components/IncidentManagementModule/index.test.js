import React from 'react';
import { createMemoryHistory } from 'history';
import { withAppContext } from 'test/utils';
import { render, cleanup } from '@testing-library/react';

import { IncidentManagementModuleComponent } from './index';

const history = createMemoryHistory();

describe('<IncidentManagementModule />', () => {
  let props;

  afterEach(cleanup);

  beforeEach(() => {
    props = {
      match: {
        isExact: false,
        params: {},
        path: '/manage/incidents',
        url: '/manage/incidents',
      },
      isAuthenticated: true,
    };
  });

  it('should render correctly', () => {
    const { rerender, asFragment } = render(
      withAppContext(<IncidentManagementModuleComponent {...props} />),
    );
    const firstRender = asFragment();

    rerender(
      withAppContext(
        <IncidentManagementModuleComponent
          {...props}
          isAuthenticated={false}
        />,
      ),
    );

    expect(
      firstRender.firstElementChild === asFragment().firstElementChild,
    ).toEqual(false);
  });

  describe('routing', () => {
    const loginText = 'Om deze pagina te zien dient u ingelogd te zijn.';

    it('can navigate to incident list', () => {
      history.push('/manage/incidents');

      const { rerender, queryByText } = render(
        withAppContext(
          <IncidentManagementModuleComponent
            {...props}
            isAuthenticated={false}
          />,
        ),
      );

      expect(queryByText(loginText)).not.toBeNull();

      rerender(
        withAppContext(
          <IncidentManagementModuleComponent {...props} isAuthenticated />,
        ),
      );

      expect(queryByText(loginText)).toBeNull();
    });

    it('can navigate to incident detail', () => {
      history.push('/manage/incident/1101');

      const { rerender, queryByText } = render(
        withAppContext(
          <IncidentManagementModuleComponent
            {...props}
            isAuthenticated={false}
          />,
        ),
      );

      expect(queryByText(loginText)).not.toBeNull();

      rerender(
        withAppContext(
          <IncidentManagementModuleComponent {...props} isAuthenticated />,
        ),
      );

      expect(queryByText(loginText)).toBeNull();
    });

    it('can navigate to incident split', () => {
      history.push('/manage/incident/1101/split');

      const { rerender, queryByText } = render(
        withAppContext(
          <IncidentManagementModuleComponent
            {...props}
            isAuthenticated={false}
          />,
        ),
      );

      expect(queryByText(loginText)).not.toBeNull();

      rerender(
        withAppContext(
          <IncidentManagementModuleComponent {...props} isAuthenticated />,
        ),
      );

      expect(queryByText(loginText)).toBeNull();
    });
  });
});
