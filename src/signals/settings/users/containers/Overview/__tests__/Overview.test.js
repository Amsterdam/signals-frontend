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

jest.mock('react-router-dom', () => ({
  __esModule: true,
  ...jest.requireActual('react-router-dom'),
  useLocation: () => ({
    hash: '',
    key: '',
    pathname: '/instellingen/gebruikers/',
    search: '',
    state: null,
  }),
}));

let historyMock;

describe('signals/settings/users/containers/Overview', () => {
  beforeEach(() => {
    fetch.mockResponse(JSON.stringify(usersJSON));

    historyMock = {
      ...history,
      action: '',
      push: jest.fn(),
      replace: jest.fn(),
    };
  });

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

    expect(getByText(`Gebruikers (${usersJSON.count})`)).toBeInTheDocument();

    expect(container.querySelectorAll('tbody tr')).toHaveLength(usersJSON.count);
  });

  it('should render pagination controls', async () => {
    let queryByTestId;
    let rerender;

    await reAct(async () => {
      ({ rerender, queryByTestId } = await render(
        withAppContext(<UsersOverview history={historyMock} />)
      ));
    });

    expect(queryByTestId('overviewPagerComponent')).toBeInTheDocument();

    cleanup();

    await reAct(async () => {
      await rerender(
        withAppContext(<UsersOverview pageSize={100} history={historyMock} />)
      );
    });

    expect(queryByTestId('overviewPagerComponent')).not.toBeInTheDocument();
  });

  it('should push to the history stack on pagination item click', async () => {
    global.window.scrollTo = jest.fn();
    const push = jest.fn();
    let getByText;

    await reAct(async () => {
      ({ getByText } = await render(
        withAppContext(<UsersOverview history={{ ...historyMock, push }} />)
      ));
    });

    expect(getByText('2')).toBeInTheDocument();

    fireEvent.click(getByText('2'));

    expect(push).toHaveBeenCalled();
    expect(global.window.scrollTo).toHaveBeenCalledWith(0, 0);

    global.window.scrollTo.mockRestore();
  });

  it('should push on update when page parameter and page state var differ', async () => {
    const historyMockObj = {
      ...historyMock,
      action: 'PUSH',
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
    };

    await reAct(async () => {
      ({ container } = await render(
        withAppContext(<UsersOverview history={historyMockObj} />)
      ));
    });

    const row = container.querySelector('tbody tr:nth-child(42)');
    const itemId = 666;
    row.dataset.itemId = itemId;

    fireEvent.click(row.querySelector('td:first-of-type'), { bubbles: true });

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
