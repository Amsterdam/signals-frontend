import React from 'react';
import { render } from '@testing-library/react';
import { withAppContext } from 'test/utils';

import RolesList from '..';

describe('containers/RolesOverview', () => {
  let props = {};

  beforeEach(() => {
    props = {
      list: [
        {
          _display: 'behandelaars',
          id: 2,
          name: 'behandelaars',
          permissions: [
            {
              _display: 'Can read frnom SIA',
              codename: 'sia_read',
            },
            {
              _display: 'Can change the status of a signal',
              codename: 'sia_signal_change_status',
            },
          ],
        },
        {
          _display: 'coordinatoren',
          id: 3,
          name: 'coordinatoren',
          permissions: [],
        },
      ],
      loading: false,
    };
  });

  describe('rendering', () => {
    it('should render correctly', () => {
      const { container, rerender } = render(withAppContext(<RolesList {...props} />))

      expect(container.querySelector('h1')).toHaveTextContent(/^Rollen$/);
      expect(container.querySelector('table')).toBeTruthy();

      expect(container.querySelector('tr:nth-child(1) td:nth-child(1)')).toHaveTextContent(/^behandelaars$/);
      expect(container.querySelector('tr:nth-child(1) td:nth-child(2)')).toHaveTextContent(/^Can read frnom SIA, Can change the status of a signal$/);

      expect(container.querySelector('tr:nth-child(2) td:nth-child(1)')).toHaveTextContent(/^coordinatoren$/);
      expect(container.querySelector('tr:nth-child(2) td:nth-child(2)')).toHaveTextContent(/^$/);


      props.list = [];
      rerender(withAppContext(<RolesList {...props} />))

      expect(container.querySelector('table')).toBeFalsy();
    });

    it('should lazy load correctly', () => {
      props.loading = true;
      const { container, rerender } = render(withAppContext(<RolesList {...props} />))

      expect(container.querySelector('table')).toBeFalsy();

      props.loading = false;
      rerender(withAppContext(<RolesList {...props} />))

      expect(container.querySelector('table')).toBeTruthy();
    });
  });
});
