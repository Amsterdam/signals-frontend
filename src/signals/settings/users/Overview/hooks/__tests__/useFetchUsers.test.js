import { renderHook } from '@testing-library/react-hooks';
import usersJSON from 'utils/__tests__/fixtures/users.json';
import configuration from 'shared/services/configuration/configuration';
import { getErrorMessage } from 'shared/services/api/api';
import * as constants from 'containers/App/constants';

import useFetchUsers from '../useFetchUsers';
import { rest, server, mockGet, fetchMock } from '../../../../../../../internals/testing/msw-server';

jest.mock('containers/App/constants', () => ({
  __esModule: true,
  ...jest.requireActual('containers/App/constants'),
}));

fetchMock.disableMocks();

constants.PAGE_SIZE = 5;

describe('signals/settings/users/containers/Overview/hooks/FetchUsers', () => {
  it('should request users from API on mount', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useFetchUsers());

    expect(result.current.isLoading).toEqual(true);
    expect(result.current.users.count).toBeUndefined();
    expect(result.current.users.list).toBeUndefined();

    await waitForNextUpdate();

    expect(result.current.isLoading).toEqual(false);
    expect(result.current.users.count).toEqual(constants.PAGE_SIZE);
    expect(result.current.users.list).toHaveLength(constants.PAGE_SIZE);
    expect(result.current.users.list[0].id).toEqual(usersJSON.results[0].id);
  });

  it('should request the correct page', async () => {
    const page = 2;
    const { result, waitForNextUpdate } = renderHook(() => useFetchUsers({ page }));

    await waitForNextUpdate();

    expect(result.current.users.count).toEqual(constants.PAGE_SIZE);
    expect(result.current.users.list).toHaveLength(constants.PAGE_SIZE);
    expect(result.current.users.list[0].id).toEqual(usersJSON.results[constants.PAGE_SIZE].id);
  });

  it('should return errors that are thrown during fetch', async () => {
    const message = 'Network request failed';
    const error = new Error();
    mockGet({ status: 404, body: { message } });

    const { result, waitForNextUpdate } = renderHook(() => useFetchUsers({ page: 1 }));

    expect(result.current.error).toEqual(false);

    await waitForNextUpdate();
    expect(result.current.error.message).toEqual(getErrorMessage(error));
  });

  it('should abort request on unmount', async () => {
    const page = 1;

    const abortSpy = jest.spyOn(global.AbortController.prototype, 'abort');
    server.use(rest.get(/localhost/, async (req, res, ctx) => res(ctx.delay(200), ctx.status(404), ctx.json(body))));

    const { unmount, waitForNextUpdate } = renderHook(() => useFetchUsers({ page }));

    await waitForNextUpdate();
    unmount();

    expect(abortSpy).toHaveBeenCalled();
  });
});
