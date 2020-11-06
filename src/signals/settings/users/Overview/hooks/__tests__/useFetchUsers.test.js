import { renderHook } from '@testing-library/react-hooks';
import usersJSON from 'utils/__tests__/fixtures/users.json';
import configuration from 'shared/services/configuration/configuration';
import useFetchUsers from '../useFetchUsers';

describe('signals/settings/users/containers/Overview/hooks/FetchUsers', () => {
  beforeEach(() => {
    fetch.resetMocks();
  });

  it('should request users from API on mount', async () => {
    fetch.mockResponseOnce(JSON.stringify(usersJSON));

    const { result, waitForNextUpdate } = renderHook(() => useFetchUsers());

    expect(result.current.isLoading).toEqual(true);
    expect(result.current.users.count).toBeUndefined();
    expect(result.current.users.list).toBeUndefined();

    await waitForNextUpdate();

    expect(fetch).toHaveBeenCalledWith(
      expect.stringMatching(configuration.USERS_ENDPOINT),
      expect.objectContaining({ method: 'GET' })
    );

    expect(result.current.isLoading).toEqual(false);
    expect(result.current.users.count).toEqual(usersJSON.count);
    expect(result.current.users.list).toHaveLength(usersJSON.count);
  });

  it('should request the correct page', async () => {
    const page = 12;
    const { waitForNextUpdate } = renderHook(() => useFetchUsers({ page }));

    await waitForNextUpdate();

    expect(fetch).toHaveBeenCalledWith(
      expect.stringMatching(new RegExp(`\\/?page=${page}`)),
      expect.objectContaining({ method: 'GET' })
    );
  });

  it('should return errors that are thrown during fetch', async () => {
    const error = new Error('fake error message');
    fetch.mockRejectOnce(error);

    const { result, waitForNextUpdate } = renderHook(() =>
      useFetchUsers({ page: 1 })
    );

    expect(result.current.error).toEqual(false);

    await waitForNextUpdate();

    expect(result.current.error).toEqual(error);
  });

  it('should abort request on unmount', () => {
    const page = 1;
    fetch.mockResponseOnce(
      () =>
        new Promise(resolve =>
          setTimeout(() => resolve(JSON.stringify(usersJSON)), 100)
        )
    );

    const abortSpy = jest.spyOn(global.AbortController.prototype, 'abort');

    const { unmount } = renderHook(() => useFetchUsers({ page }));

    unmount();

    expect(abortSpy).toHaveBeenCalled();
  });
});
