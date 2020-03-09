import React from 'react';
import { render, fireEvent, wait, waitForElement, within, cleanup } from '@testing-library/react';
import { history as memoryHistory, withCustomAppContext } from 'test/utils';

import usersJSON from 'utils/__tests__/fixtures/users.json';
import { USER_URL, USERS_PAGED_URL } from 'signals/settings/routes';
import configuration from 'shared/services/configuration/configuration';
import * as constants from 'containers/App/constants';
import * as appSelectors from 'containers/App/selectors';
import { UsersOverviewContainer } from '..';

jest.mock('containers/App/constants', () => ({
  __esModule: true,
  ...jest.requireActual('containers/App/constants'),
}));

constants.PAGE_SIZE = 50;

let testContext = {};
const usersOverviewWithAppContext = (overrideProps = {}, overrideCfg = {}) => {
  const { userCan, history } = testContext;
  const props = {
    userCan,
    ...overrideProps,
  };

  return withCustomAppContext(<UsersOverviewContainer {...props} />)({
    routerCfg: { history },
    ...overrideCfg,
  });
};
const resolveAfterMs = timeMs => new Promise(resolve => setTimeout(resolve, timeMs));

describe('signals/settings/users/containers/Overview', () => {
  beforeEach(() => {
    const push = jest.fn();
    const scrollTo = jest.fn();
    const userCan = () => true;
    const apiHeaders = {
      headers: {
        Accept: 'application/json',
      },
    };
    const history = {
      ...memoryHistory,
      push,
    };

    jest.useRealTimers();
    fetch.resetMocks();

    fetch.mockResponse(JSON.stringify(usersJSON));
    global.window.scrollTo = scrollTo;

    testContext = {
      apiHeaders,
      history,
      push,
      scrollTo,
      userCan,
    };
  });

  it('should render "add user" button', async () => {
    jest
      .spyOn(appSelectors, 'makeSelectUserCan')
      .mockImplementation(() => () => true);

    const { queryByText, rerender } = render(usersOverviewWithAppContext());

    await wait();

    expect(queryByText('Gebruiker toevoegen')).toBeInTheDocument();

    jest
      .spyOn(appSelectors, 'makeSelectUserCan')
      .mockImplementation(() => () => true);

    cleanup();

    rerender(usersOverviewWithAppContext());

    await wait();

    expect(queryByText('Gebruiker toevoegen')).not.toBeInTheDocument();
  });

  it('should request users from API on mount', async () => {
    const { apiHeaders } = testContext;

    render(usersOverviewWithAppContext());

    await wait();

    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining(configuration.USERS_ENDPOINT),
      expect.objectContaining(apiHeaders)
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

    jest.advanceTimersByTime(25);

    await wait();

    expect(getByText('Gebruikers')).toBeInTheDocument();
    expect(queryByTestId('dataViewHeadersRow')).toBeInTheDocument();
    expect(queryByTestId('loadingIndicator')).toBeInTheDocument();

    jest.advanceTimersByTime(25);

    await wait();

    expect(getByText(`Gebruikers (${usersJSON.count})`)).toBeInTheDocument();
    expect(queryByTestId('dataViewHeadersRow')).toBeInTheDocument();
    expect(queryByTestId('loadingIndicator')).toBeNull();

    jest.runAllTimers();
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

    jest.advanceTimersByTime(25);

    await wait();

    expect(queryAllByTestId('dataViewBodyRow')).toHaveLength(0);

    jest.advanceTimersByTime(25);

    await wait();

    expect(queryByTestId('loadingIndicator')).toBeNull();
    expect(queryAllByTestId('dataViewBodyRow')).toHaveLength(usersJSON.count);

    jest.runAllTimers();
  });

  it('should data view when data', async () => {
    const { queryAllByTestId } = render(usersOverviewWithAppContext());

    await wait();

    expect(queryAllByTestId('dataViewBodyRow')).toHaveLength(usersJSON.count);
  });

  it('should render pagination controls', async () => {
    const { rerender, queryByTestId } = render(usersOverviewWithAppContext());

    await wait();

    expect(queryByTestId('pagination')).toBeInTheDocument();
    expect(within(queryByTestId('pagination')).queryByText('2')).toBeInTheDocument();

    constants.PAGE_SIZE = usersJSON.count;

    rerender(usersOverviewWithAppContext({ pageSize: usersJSON.count }));

    await wait();

    expect(queryByTestId('pagination')).not.toBeInTheDocument();
  });

  it('should push to the history stack and scroll to top on pagination item click', async () => {
    constants.PAGE_SIZE = 50;
    const { push, scrollTo } = testContext;
    const { getByText } = render(usersOverviewWithAppContext());

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
    expect(push).toHaveBeenCalledWith(
      expect.stringContaining(`${USER_URL}/${itemId}`),
      expect.objectContaining({ filters: {} }),
    );

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
    jest
      .spyOn(appSelectors, 'makeSelectUserCan')
      .mockImplementation(() => () => false);

    const { push } = testContext;
    const { container } = render(usersOverviewWithAppContext());

    const row = await waitForElement(
      () => container.querySelector('tbody tr:nth-child(42)'),
      { container }
    );

    // Explicitly set an 'itemId'.
    row.dataset.itemId = 666;

    fireEvent.click(row.querySelector('td:first-of-type'));

    expect(push).not.toHaveBeenCalled();
  });

  it('should render a username filter', async () => {
    const { getByTestId } = render(usersOverviewWithAppContext());

    await wait();

    expect(getByTestId('filterUsersByUsername')).toBeInTheDocument();
  });

  it('should make API call only after 250ms since last filter update', async () => {
    const { apiHeaders } = testContext;
    const { getByTestId } = render(usersOverviewWithAppContext());

    await wait();

    const filterByUsername = getByTestId('filterUsersByUsername');
    const filterByUserNameInput = filterByUsername.querySelector('input');
    let filterValue = 'test1';

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).not.toHaveBeenCalledWith(
      expect.stringContaining(`username=${filterValue}`),
      expect.objectContaining(apiHeaders),
    );

    fireEvent.change(filterByUserNameInput, { target: { value: filterValue } });

    await wait(() => resolveAfterMs(50));

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).not.toHaveBeenCalledWith(
      expect.stringContaining(`username=${filterValue}`),
      expect.objectContaining(apiHeaders),
    );

    await wait(() => resolveAfterMs(200));

    expect(fetch).toHaveBeenCalledTimes(2);
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining(`username=${filterValue}`),
      expect.objectContaining(apiHeaders),
    );

    // Test that 'debounce' timer is reset on new input changes within 250ms.
    filterValue = 'test2';

    fireEvent.change(filterByUserNameInput, { target: { value: filterValue } });

    await wait(() => resolveAfterMs(200));

    expect(fetch).toHaveBeenCalledTimes(2);
    expect(fetch).not.toHaveBeenCalledWith(
      expect.stringContaining(`username=${filterValue}`),
      expect.objectContaining(apiHeaders),
    );

    filterValue = 'test3';

    fireEvent.change(filterByUserNameInput, { target: { value: filterValue } });

    await wait(() => resolveAfterMs(200));

    expect(fetch).toHaveBeenCalledTimes(2);
    expect(fetch).not.toHaveBeenCalledWith(
      expect.stringContaining(`username=${filterValue}`),
      expect.objectContaining(apiHeaders),
    );

    filterValue = 'test4';

    fireEvent.change(filterByUserNameInput, { target: { value: filterValue } });

    await wait(() => resolveAfterMs(200));

    expect(fetch).toHaveBeenCalledTimes(2);
    expect(fetch).not.toHaveBeenCalledWith(
      expect.stringContaining(`username=${filterValue}`),
      expect.objectContaining(apiHeaders),
    );

    await wait(() => resolveAfterMs(50));

    expect(fetch).toHaveBeenCalledTimes(3);
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining(`username=${filterValue}`),
      expect.objectContaining(apiHeaders),
    );
  });

  it(`should send 'filters' as state when navigating to details page.`, async () => {
    jest
      .spyOn(appSelectors, 'makeSelectUserCan')
      .mockImplementation(() => () => true);

    const { push } = testContext;
    const { getByTestId, queryAllByTestId } = render(usersOverviewWithAppContext());

    await wait();

    const filterByUsername = getByTestId('filterUsersByUsername');
    const filterByUserNameInput = filterByUsername.querySelector('input');
    const filterValue = 'test1';

    let rows = queryAllByTestId('dataViewBodyRow');
    let firstRow = Array.from(rows)[0];

    expect(push).not.toHaveBeenCalled();

    fireEvent.click(firstRow);

    expect(push).toHaveBeenCalledTimes(1);
    expect(push).toHaveBeenCalledWith(
      expect.stringContaining(`${USER_URL}/${firstRow.dataset.itemId}`),
      expect.objectContaining({ filters: {} })
    );

    fireEvent.change(filterByUserNameInput, { target: { value: filterValue } });

    await wait(() => resolveAfterMs(250));

    expect(push).toHaveBeenCalledTimes(2);
    expect(push).toHaveBeenCalledWith(expect.stringContaining(`${USERS_PAGED_URL}/1`));

    rows = queryAllByTestId('dataViewBodyRow');
    firstRow = Array.from(rows)[0];

    fireEvent.click(firstRow);

    expect(push).toHaveBeenCalledTimes(3);
    expect(push).toHaveBeenCalledWith(
      expect.stringContaining(`${USER_URL}/${firstRow.dataset.itemId}`),
      expect.objectContaining({ filters: { username: filterValue } })
    );
  });

  it(`should set 'filters' initial state to receiving history state`, async () => {
    const { apiHeaders, history } = testContext;
    const username = 'test';
    const historyWithState = {
      ...history,
      location: {
        ...history.location,
        state: {
          filters: {
            username,
          },
        },
      },
    };
    const { getByTestId } = render(usersOverviewWithAppContext(
      {},
      {
        routerCfg: {
          history: historyWithState,
        },
      }
    ));

    await wait();

    const filterByUsername = getByTestId('filterUsersByUsername');
    const filterByUserNameInput = filterByUsername.querySelector('input');

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining(`username=${username}`),
      expect.objectContaining(apiHeaders)
    );
    expect(filterByUserNameInput.value).toBe(username);
  });
});
