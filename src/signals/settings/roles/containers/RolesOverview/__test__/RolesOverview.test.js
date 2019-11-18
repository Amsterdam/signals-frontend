import React from 'react';
import { render } from '@testing-library/react';
import { withAppContext } from 'test/utils';

import { FETCH_ROLES } from 'models/roles/constants';
import { RolesOverview, mapDispatchToProps } from '..';


describe('containers/RolesOverview', () => {
  let props = {};

  beforeEach(() => {
    props = {
      roles: {
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
      },
      onFetchRoles: jest.fn(),
    };
  });

  describe('rendering', () => {
    it('should render correctly', () => {
      const { container, rerender } = render(withAppContext(<RolesOverview {...props} />))

      expect(container.querySelector('h1')).toHaveTextContent(/^Rollen$/);
      expect(container.querySelector('table')).toBeTruthy();

      expect(container.querySelector('tr:nth-child(1) td:nth-child(1)')).toHaveTextContent(/^behandelaars$/);
      expect(container.querySelector('tr:nth-child(1) td:nth-child(2)')).toHaveTextContent(/^Can read frnom SIA, Can change the status of a signal$/);

      expect(container.querySelector('tr:nth-child(2) td:nth-child(1)')).toHaveTextContent(/^coordinatoren$/);
      expect(container.querySelector('tr:nth-child(2) td:nth-child(2)')).toHaveTextContent(/^$/);


      props.roles.list = [];
      rerender(withAppContext(<RolesOverview {...props} />))

      expect(container.querySelector('table')).toBeFalsy();
    });

    it('should lazy load correctly', () => {
      props.roles.loading = true;
      const { container, rerender } = render(withAppContext(<RolesOverview {...props} />))

      expect(container.querySelector('table')).toBeFalsy();

      props.roles.loading = false;
      rerender(withAppContext(<RolesOverview {...props} />))

      expect(container.querySelector('table')).toBeTruthy();
    });
  });

  describe('events', () => {
    it('should fetch roles by default', () => {
      render(withAppContext(<RolesOverview {...props} />))

      expect(props.onFetchRoles).toHaveBeenCalled();
    });
  });

  describe('mapDispatchToProps', () => {
    const dispatch = jest.fn();

    it('onRequestIncident', () => {
      mapDispatchToProps(dispatch).onFetchRoles();
      expect(dispatch).toHaveBeenCalledWith({ type: FETCH_ROLES });
    });
  });
});
