import React from 'react';
import { act } from '@testing-library/react-hooks';
import { render, wait, fireEvent, cleanup } from '@testing-library/react';
import { act as reAct } from 'react-dom/test-utils';
import * as reactRouterDom from 'react-router-dom';
import { withAppContext, history } from 'test/utils';
import usersJSON from 'utils/__tests__/fixtures/users.json';
import routes from 'signals/settings/routes';

import UsersOverview from '..';
import { usersEndpoint } from '../hooks/useFetchUsers';

jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');
  return {
    __esModule: true,
    ...actual,
    useParams: jest.fn(() => ({})),
    useLocation: () => ({
      hash: '',
      key: '',
      pathname: '/instellingen/gebruikers/',
      search: '',
      state: null,
    }),
  };
});

describe('signals/settings/users/containers/Overview', () => {
  beforeAll(() => {
    fetch.mockResponse(JSON.stringify(usersJSON));
  });

  const historyMock = {
    ...history,
    action: '',
  };

  it('should request users from API on mount', async () => {
    await act(async () => {
      await render(withAppContext(<UsersOverview history={historyMock} />));

      await wait(() =>
        expect(global.fetch).toHaveBeenCalledWith(
          expect.stringContaining(usersEndpoint),
          expect.objectContaining({ headers: {} })
        )
      );
    });
  });

  it('should render the list of fetched users', async () => {
    let getByText;
    let container;

    await reAct(async () => {
      ({ container, getByText } = await render(
        withAppContext(<UsersOverview history={historyMock} />)
      ));
    });

    expect(getByText('Gebruikers (69)')).toBeTruthy();

    expect(container.querySelectorAll('tbody tr')).toHaveLength(69);
  });

  it('should render pagination controls', async () => {
    let queryByTestId;
    let rerender;

    await reAct(async () => {
      ({ rerender, queryByTestId } = await render(
        withAppContext(<UsersOverview history={historyMock} />)
      ));
    });

    expect(queryByTestId('overviewPagerComponent')).toBeTruthy();

    cleanup();

    await reAct(async () => {
      await rerender(
        withAppContext(<UsersOverview pageSize={100} history={historyMock} />)
      );
    });

    expect(queryByTestId('overviewPagerComponent')).toBeFalsy();
  });

  it('should push to the history stack on pager item click', async () => {
    let container;
    const historyMockObj = { ...historyMock, push: jest.fn() };

    await reAct(async () => {
      ({ container } = await render(
        withAppContext(<UsersOverview history={historyMockObj} />)
      ));
    });

    fireEvent.click(container.querySelector('.pager_nav.volgende'));
    expect(historyMockObj.push).toHaveBeenCalledWith(
      expect.stringContaining(routes.users)
    );
  });

  it('should push on update when page parameter and page state var differ', async () => {
    const historyMockObj = {
      ...historyMock,
      action: 'PUSH',
      push: jest.fn(),
      replace: jest.fn(),
    };

    jest.spyOn(reactRouterDom, 'useParams').mockImplementation(() => ({
      pageNum: 2,
    }));

    await reAct(async () => {
      await render(withAppContext(<UsersOverview history={historyMockObj} />));
    });

    expect(historyMockObj.push).toHaveBeenCalledWith(
      expect.stringContaining(`${routes.users}/page/1`)
    );

    expect(historyMockObj.replace).not.toHaveBeenCalled();
  });

  it('should not push', async () => {
    const historyMockObj = {
      ...historyMock,
      action: 'PUSH',
      push: jest.fn(),
    };

    jest.spyOn(reactRouterDom, 'useParams').mockImplementation(() => ({
      pageNum: 1,
    }));

    await reAct(async () => {
      await render(withAppContext(<UsersOverview history={historyMockObj} />));
    });

    expect(historyMockObj.push).not.toHaveBeenCalled();
  });

  it('should not push on POP', async () => {
    const historyMockObj = {
      ...historyMock,
      action: 'POP',
      push: jest.fn(),
    };

    jest.spyOn(reactRouterDom, 'useParams').mockImplementation(() => ({
      pageNum: 1,
    }));

    await reAct(async () => {
      await render(withAppContext(<UsersOverview history={historyMockObj} />));
    });

    expect(historyMockObj.push).not.toHaveBeenCalled();
  });

  it('should push on list item click', async () => {
    let container;
    const historyMockObj = {
      ...historyMock,
      push: jest.fn(),
    };

    await reAct(async () => {
      ({ container } = await render(
        withAppContext(<UsersOverview history={historyMockObj} />)
      ));
    });

    const row = container.querySelector('tbody tr:nth-child(42)');
    const itemId = 666;
    row.dataset.itemId = itemId;

    fireEvent.click(row.querySelector('td:first-of-type'));

    expect(historyMockObj.push).toHaveBeenCalledWith(
      routes.user.replace(':userId', itemId)
    );

    historyMockObj.push.mockReset();

    const row2 = container.querySelector('tbody tr:nth-child(43)');
    delete row2.dataset.itemId;

    fireEvent.click(row2.querySelector('td:first-of-type'));

    expect(historyMockObj.push).not.toHaveBeenCalled();
  });
});
