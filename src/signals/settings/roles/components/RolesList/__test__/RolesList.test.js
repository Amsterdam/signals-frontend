import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { withAppContext } from 'test/utils';
import * as reactRouterDom from 'react-router-dom';
import RolesList from '..';

jest.mock('react-router-dom', () => ({
  __esModule: true,
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    push: jest.fn(),
  }),
}));

describe('/signals/settings/roles/components/RolesList', () => {
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

  it('should click to role detail page', () => {
    const push = jest.fn();
    jest.spyOn(reactRouterDom, 'useHistory').mockImplementationOnce(() => ({ push }));

    const { container } = render(withAppContext(<RolesList {...props} />))
    const event = { currentTarget: { getAttribute: () => 2 } };

    fireEvent.click(container.querySelector('tr:nth-child(1) td:nth-child(1)'), event);

    expect(push).toHaveBeenCalledWith('/instellingen/rol/2');
  });
});
