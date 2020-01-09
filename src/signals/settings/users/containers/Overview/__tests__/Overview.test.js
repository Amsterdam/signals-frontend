import React from 'react';
import { act } from '@testing-library/react-hooks';
import { render, wait, fireEvent, cleanup } from '@testing-library/react';
import { act as reAct } from 'react-dom/test-utils';
import * as reactRouterDom from 'react-router-dom';
import { withAppContext } from 'test/utils';
import usersJSON from 'utils/__tests__/fixtures/users.json';
import routes from 'signals/settings/routes';
import configuration from 'shared/services/configuration/configuration';

import { UsersOverviewContainer } from '..';

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

const push = jest.fn();
jest.spyOn(reactRouterDom, 'useHistory').mockImplementation(() => ({
  push,
}));

const userCan = jest.fn(() => true);

describe('signals/settings/users/containers/Overview', () => {
  beforeEach(() => {
    fetch.mockResponse(JSON.stringify(usersJSON));
    push.mockReset();
  });

  it('should render "add user" button', async () => {
    let rerender;
    let queryByText;

    await reAct(async () => {
      ({ queryByText, rerender } = await render(withAppContext(<UsersOverviewContainer userCan={userCan} />)));
    });

    expect(queryByText('Gebruiker toevoegen')).toBeInTheDocument();

    await reAct(async () => rerender(withAppContext(<UsersOverviewContainer userCan={() => false} />)));

    expect(queryByText('Gebruiker toevoegen')).not.toBeInTheDocument();
  });

  it('should request users from API on mount', async () => {
    await act(async () => {
      await render(withAppContext(<UsersOverviewContainer userCan={userCan} />));

      await wait(() =>
        expect(global.fetch).toHaveBeenCalledWith(
          expect.stringContaining(configuration.USERS_ENDPOINT),
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
        withAppContext(<UsersOverviewContainer userCan={userCan} />)
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
        withAppContext(<UsersOverviewContainer userCan={userCan} />)
      ));
    });

    expect(queryByTestId('pagination')).toBeInTheDocument();

    cleanup();

    await reAct(async () => {
      await rerender(
        withAppContext(<UsersOverviewContainer pageSize={100} userCan={userCan} />)
      );
    });

    expect(queryByTestId('pagination')).not.toBeInTheDocument();
  });

  it('should push to the history stack on pagination item click', async () => {
    global.window.scrollTo = jest.fn();
    let getByText;

    await reAct(async () => {
      ({ getByText } = await render(
        withAppContext(<UsersOverviewContainer userCan={userCan} />)
      ));
    });

    expect(getByText('2')).toBeInTheDocument();

    fireEvent.click(getByText('2'));

    expect(push).toHaveBeenCalled();
    expect(global.window.scrollTo).toHaveBeenCalledWith(0, 0);

    global.window.scrollTo.mockRestore();
  });

  it('should not push', async () => {
    jest.spyOn(reactRouterDom, 'useParams').mockImplementation(() => ({
      pageNum: 1,
    }));

    await reAct(async () => {
      await render(withAppContext(<UsersOverviewContainer userCan={userCan} />));
    });

    expect(push).not.toHaveBeenCalled();
  });

  it('should not push on POP', async () => {
    jest.spyOn(reactRouterDom, 'useParams').mockImplementation(() => ({
      pageNum: 1,
    }));

    await reAct(async () => {
      await render(withAppContext(<UsersOverviewContainer userCan={userCan} />));
    });

    expect(push).not.toHaveBeenCalled();
  });

  it('should push on list item click', async () => {
    let container;

    await reAct(async () => {
      ({ container } = await render(
        withAppContext(<UsersOverviewContainer userCan={userCan} />)
      ));
    });

    const row = container.querySelector('tbody tr:nth-child(42)');
    const itemId = 666;
    row.dataset.itemId = itemId;

    fireEvent.click(row.querySelector('td:first-of-type'), { bubbles: true });

    expect(push).toHaveBeenCalledWith(
      routes.user.replace(/:userId.*/, itemId)
    );

    push.mockReset();

    const row2 = container.querySelector('tbody tr:nth-child(43)');
    delete row2.dataset.itemId;

    fireEvent.click(row2.querySelector('td:first-of-type'));

    expect(push).not.toHaveBeenCalled();
  });

  it('should not push on list item click when permissions are insufficient', async () => {
    let container;

    await reAct(async () => {
      ({ container } = await render(
        withAppContext(<UsersOverviewContainer userCan={() => false} />)
      ));
    });

    const row = container.querySelector('tbody tr:nth-child(42)');
    const itemId = 666;
    row.dataset.itemId = itemId;

    fireEvent.click(row.querySelector('td:first-of-type'), { bubbles: true });

    expect(push).not.toHaveBeenCalled();
  });
});
