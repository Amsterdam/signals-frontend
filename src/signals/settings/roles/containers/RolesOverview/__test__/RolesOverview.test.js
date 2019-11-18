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
