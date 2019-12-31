import React from 'react';
import { render, fireEvent, wait, waitForElement } from '@testing-library/react';

import { history as memoryHistory, withCustomAppContext } from 'test/utils';
import usersJSON from 'utils/__tests__/fixtures/users.json';
import routes from 'signals/settings/routes';
import configuration from 'shared/services/configuration/configuration';
import UsersOverview from '..';

let testContext = {};
const usersOverviewWithAppContext = (props = {}, overrideCfg = {}) => {
  const { history } = testContext;

  return withCustomAppContext(<UsersOverview {...props} />)({
    routerCfg: { history },
    ...overrideCfg,
  });
};

describe('signals/settings/users/containers/Overview', () => {
  beforeEach(() => {
    const push = jest.fn();
    const scrollTo = jest.fn();
    const history = {
      ...memoryHistory,
      push,
    };

    fetch.mockResponse(JSON.stringify(usersJSON));
    global.window.scrollTo = scrollTo;

    testContext = {
      history,
      push,
      scrollTo,
    };
  });

  it('should request users from API on mount', async () => {
    render(usersOverviewWithAppContext());

    await wait();

    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining(configuration.USERS_ENDPOINT),
      expect.objectContaining({ headers: {} })
    );
  });

  it('should render title and loading indicator when loading', async () => {
    jest.useFakeTimers();
    fetch.mockResponse(() => new Promise((resolve => {
      setTimeout(() => resolve({
        body: JSON.stringify(usersJSON),
      }) , 50);
    })));

    const { getByText, queryByTestId } = render(usersOverviewWithAppContext());

    await wait(() => queryByTestId('loadingIndicator'));

    expect(getByText('Gebruikers (0)')).toBeInTheDocument();
    expect(queryByTestId('loadingIndicator')).toBeInTheDocument();

    jest.runAllTimers();

    await wait();

    expect(getByText(`Gebruikers (${usersJSON.count})`)).toBeInTheDocument();
    expect(queryByTestId('loadingIndicator')).toBeNull();
  });

  it('should render title and data view with no data rows when no data', async () => {
    fetch.mockResponse(JSON.stringify({}));

    const { container, getByText, queryByTestId } = render(usersOverviewWithAppContext());

    await wait();

    expect(getByText('Gebruikers (0)')).toBeInTheDocument();
    expect(queryByTestId('dataView')).toBeInTheDocument();
    expect(container.querySelectorAll('tbody tr')).toHaveLength(0);
  });

  it('should render title and data view with data rows when data', async () => {
    const { container, getByText, getByTestId } = render(usersOverviewWithAppContext());

    await wait();

    expect(getByText(`Gebruikers (${usersJSON.count})`)).toBeInTheDocument();
    expect(getByTestId('dataView')).toBeInTheDocument();
    expect(container.querySelectorAll('tbody tr')).toHaveLength(usersJSON.count);
  });

  it('should render data view with no data rows when loading', async () => {
    jest.useFakeTimers();
    fetch.mockResponse(() => new Promise((resolve => {
      setTimeout(() => resolve({
        body: JSON.stringify(usersJSON),
      }) , 50);
    })));

    const { container, queryByTestId } = render(usersOverviewWithAppContext());

    await wait(() => queryByTestId('loadingIndicator'));

    expect(container.querySelectorAll('tbody tr')).toHaveLength(0);

    jest.runAllTimers();

    await wait();

    expect(queryByTestId('loadingIndicator')).toBeNull();
    expect(container.querySelectorAll('tbody tr')).toHaveLength(usersJSON.count);
  });

  it('should render pagination controls', async () => {
    const pageSize = Math.ceil(usersJSON.count / 2);
    const { rerender, queryByTestId, queryByText } = render(usersOverviewWithAppContext({ pageSize }));

    await wait();

    expect(queryByTestId('pagination')).toBeInTheDocument();
    expect(queryByText('2')).not.toBeNull();

    rerender(usersOverviewWithAppContext({ pageSize: usersJSON.count }));

    await wait();

    expect(queryByTestId('pagination')).toBeInTheDocument();
    expect(queryByText('2')).toBeNull();
  });

  it('should push to the history stack and scroll to top on pagination item click', async () => {
    const pageSize = Math.ceil(usersJSON.count / 2);
    const { push, scrollTo } = testContext;
    const { getByText } = render(usersOverviewWithAppContext({ pageSize }));

    await wait(() => getByText('2'));

    fireEvent.click(getByText('2'));

    expect(scrollTo).toHaveBeenCalledWith(0, 0);
    expect(push).toHaveBeenCalled();
  });

  it('should not push', async () => {
    const { push } = testContext;

    render(usersOverviewWithAppContext());

    await wait();

    expect(push).not.toHaveBeenCalled();
  });

  it('should push on list item with an itemId click', async () => {
    const { push } = testContext;
    const { container } = render(usersOverviewWithAppContext());
    const itemId = 666;

    const row = await waitForElement(
      () => container.querySelector('tbody tr:nth-child(42)'),
      { container }
    );
    const username = row.querySelector('td:first-of-type');

    // Explicitly set an 'itemId' so that we can easily test against it's value.
    row.dataset.itemId = itemId;

    expect(push).toHaveBeenCalledTimes(0);

    fireEvent.click(username);

    expect(push).toHaveBeenCalledTimes(1);
    expect(push).toHaveBeenCalledWith(routes.user.replace(/:userId.*/, itemId));

    // Remove 'itemId' and fire click event again.
    delete row.dataset.itemId;

    fireEvent.click(username);

    expect(push).toHaveBeenCalledTimes(1);

    // Set 'itemId' again and fire click event once more.
    row.dataset.itemId = itemId;

    fireEvent.click(username);

    expect(push).toHaveBeenCalledTimes(2);
  });
});
