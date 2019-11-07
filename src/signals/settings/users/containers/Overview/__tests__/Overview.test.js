import React from 'react';
import { act } from '@testing-library/react-hooks'
import { render, wait } from '@testing-library/react';
import { act as reAct } from 'react-dom/test-utils';
import { withAppContext } from 'test/utils';
import usersJSON from 'utils/__tests__/fixtures/users.json';

import UsersOverview from '..';
import { usersEndpoint } from '../hooks/useFetchUsers';

describe('signals/settings/users/containers/Overview', () => {
  it('should request users from API on mount', async () => {
    await act(async () => {
      await render(withAppContext(<UsersOverview />));

      await wait(() => expect(global.fetch).toHaveBeenCalledWith(
        usersEndpoint,
        expect.objectContaining({ headers: {} })
      ));
    });

  });

  it('should render a loading indicator', () => {
    const { getByTestId } = render(withAppContext(<UsersOverview />));

    expect(getByTestId('loadingIndicator')).toBeTruthy();
  });

  it('should render the list of fetched users', async () => {
    fetch.mockResponseOnce(JSON.stringify(usersJSON));

    let getByText;
    let container;

    await reAct(async () => {
      ({ container, getByText } = await render(withAppContext(<UsersOverview />)));
    });

    await expect(getByText(`Gebruikers (${usersJSON.count})`)).toBeTruthy();

    await expect(container.querySelectorAll('tbody tr')).toHaveLength(69);
  });
});
