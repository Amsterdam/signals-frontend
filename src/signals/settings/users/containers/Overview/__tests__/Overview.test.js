import React from 'react';
import { render, fireEvent, wait, waitForElement, within } from '@testing-library/react';
import { history as memoryHistory, withCustomAppContext } from 'test/utils';
import usersJSON from 'utils/__tests__/fixtures/users.json';
import { USER_URL } from 'signals/settings/routes';
import configuration from 'shared/services/configuration/configuration';
import { UsersOverviewContainer as UsersOverview } from '..';

let testContext = {};
const usersOverviewWithAppContext = (overrideProps = {}, overrideCfg = {}) => {
  const { userCan, history } = testContext;
  const props = {
    userCan,
    ...overrideProps,
  };

  return withCustomAppContext(<UsersOverview {...props} />)({
    routerCfg: { history },
    ...overrideCfg,
  });
};

describe('signals/settings/users/containers/Overview', () => {
  beforeEach(() => {
    const push = jest.fn();
    const scrollTo = jest.fn();
    const userCan = () => true;
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
      userCan,
    };
  });

  it('should render "add user" button', async () => {
    const { queryByText, rerender } = render(usersOverviewWithAppContext());

    await wait();

    expect(queryByText('Gebruiker toevoegen')).toBeInTheDocument();

    rerender(usersOverviewWithAppContext({ userCan: () => false }));

    await wait();

    expect(queryByText('Gebruiker toevoegen')).not.toBeInTheDocument();
  });

  it('should request users from API on mount', async () => {
    render(usersOverviewWithAppContext());

    await wait();

    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining(configuration.USERS_ENDPOINT),
      expect.objectContaining({
        headers: {
          Accept: 'application/json',
        },
      })
    );
  });

  it('should render title, data view with headers only and loading indicator when loading', async () => {
    jest.useFakeTimers();
    fetch.mockResponse(() => new Promise((resolve => {
      setTimeout(() => resolve({
        body: JSON.stringify(usersJSON),
      }) , 50);
    })));

    const { getByText, queryByTestId } = render(usersOverviewWithAppContext());

    await wait(() => queryByTestId('loadingIndicator'));

    expect(getByText('Gebruikers')).toBeInTheDocument();
    expect(queryByTestId('dataViewHeadersRow')).toBeInTheDocument();
    expect(queryByTestId('loadingIndicator')).toBeInTheDocument();

    jest.runAllTimers();

    await wait();

    expect(getByText(`Gebruikers (${usersJSON.count})`)).toBeInTheDocument();
    expect(queryByTestId('dataViewHeadersRow')).toBeInTheDocument();
    expect(queryByTestId('loadingIndicator')).toBeNull();
  });

  it('should render title and data view with headers only when no data', async () => {
    fetch.mockResponse(JSON.stringify({}));

    const { getByText, queryByTestId, queryAllByTestId } = render(usersOverviewWithAppContext());

    await wait();

    expect(getByText('Gebruikers')).toBeInTheDocument();
    expect(queryByTestId('dataViewHeadersRow')).toBeInTheDocument();
    expect(queryAllByTestId('dataViewBodyRow')).toHaveLength(0);
  });

  it('should render data view with no data when loading', async () => {
    jest.useFakeTimers();
    fetch.mockResponse(() => new Promise((resolve => {
      setTimeout(() => resolve({
        body: JSON.stringify(usersJSON),
      }) , 50);
    })));

    const { queryByTestId, queryAllByTestId } = render(usersOverviewWithAppContext());

    await wait(() => queryByTestId('loadingIndicator'));

    expect(queryAllByTestId('dataViewBodyRow')).toHaveLength(0);

    jest.runAllTimers();

    await wait();

    expect(queryByTestId('loadingIndicator')).toBeNull();
    expect(queryAllByTestId('dataViewBodyRow')).toHaveLength(usersJSON.count);
  });

  it('should data view when data', async () => {
    const { queryAllByTestId } = render(usersOverviewWithAppContext());

    await wait();

    expect(queryAllByTestId('dataViewBodyRow')).toHaveLength(usersJSON.count);
  });

  it('should render pagination controls', async () => {
    const pageSize = Math.ceil(usersJSON.count / 2);
    const { rerender, queryByTestId } = render(usersOverviewWithAppContext({ pageSize }));

    await wait();

    expect(queryByTestId('pagination')).toBeInTheDocument();
    expect(within(queryByTestId('pagination')).queryByText('2')).toBeInTheDocument();

    rerender(usersOverviewWithAppContext({ pageSize: usersJSON.count }));

    await wait();

    expect(queryByTestId('pagination')).not.toBeInTheDocument();
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

  it('should push on list item with an itemId click', async () => {
    const { push } = testContext;
    const { container } = render(usersOverviewWithAppContext());
    const itemId = 666;

    const row = await waitForElement(
      () => container.querySelector('tbody tr:nth-child(42)'),
      { container }
    );
    const username = row.querySelector('td:first-of-type');

    // Explicitly set an 'itemId' so that we can easily test against its value.
    row.dataset.itemId = itemId;

    expect(push).toHaveBeenCalledTimes(0);

    fireEvent.click(username);

    expect(push).toHaveBeenCalledTimes(1);
    expect(push).toHaveBeenCalledWith(`${USER_URL}/${itemId}`);

    // Remove 'itemId' and fire click event again.
    delete row.dataset.itemId;

    fireEvent.click(username);

    expect(push).toHaveBeenCalledTimes(1);

    // Set 'itemId' again and fire click event once more.
    row.dataset.itemId = itemId;

    fireEvent.click(username);

    expect(push).toHaveBeenCalledTimes(2);
  });

  it('should not push on list item click when permissions are insufficient', async () => {
    const { push } = testContext;
    const { container } = render(usersOverviewWithAppContext({ userCan: () => false }));

    const row = await waitForElement(
      () => container.querySelector('tbody tr:nth-child(42)'),
      { container }
    );

    // Explicitly set an 'itemId'.
    row.dataset.itemId = 666;

    fireEvent.click(row.querySelector('td:first-of-type'));

    expect(push).not.toHaveBeenCalled();
  });
});
