import { renderHook, act } from '@testing-library/react-hooks';
import { wait } from '@testing-library/react';
import { act as reAct } from 'react-dom/test-utils';
import usersJSON from 'utils/__tests__/fixtures/users.json';
import useFetchUsers, { usersEndpoint } from '../useFetchUsers';

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

    reAct(() => {
      waitForNextUpdate();
    });

    expect(global.fetch).toHaveBeenCalledWith(
      usersEndpoint,
      expect.objectContaining({ headers: {} })
    );

    await wait(() => {
      expect(result.current.isLoading).toEqual(false);
      expect(result.current.users.count).toEqual(usersJSON.count);
      expect(result.current.users.list).toHaveLength(usersJSON.count);
    });
  });

  it('should request the correct page', async () => {
    const page = 12;
    const { waitForNextUpdate } = renderHook(() => useFetchUsers({ page }));

    await act(async () => {
      await waitForNextUpdate();

      await expect(global.fetch).toHaveBeenCalledWith(
        `${usersEndpoint}/?page=${page}`,
        expect.objectContaining({ headers: {} })
      );
    });
  });

  it('should request the correct page size', async () => {
    const pageSize = 30000;
    const { waitForNextUpdate } = renderHook(() => useFetchUsers({ pageSize }));

    await act(async () => {
      await waitForNextUpdate();

      await expect(global.fetch).toHaveBeenCalledWith(
        `${usersEndpoint}/?page_size=${pageSize}`,
        expect.objectContaining({ headers: {} })
      );
    });
  });

  it('should return errors that are thrown during fetch', async () => {
    const error = new Error('fake error message');
    fetch.mockRejectOnce(error);

    const { result, waitForNextUpdate } = renderHook(() => useFetchUsers({ page: 1 }));

    expect(result.current.error).toEqual(false);

    reAct(() => {
      waitForNextUpdate();
    });

    await wait(() => {
      expect(result.current.error).toEqual(error);
    });
  });

  it('should request the correct page', async () => {
    const page = 12;
    const { waitForNextUpdate } = renderHook(() => useFetchUsers({ page }));

    await act(async () => {
      await waitForNextUpdate();

      await expect(global.fetch).toHaveBeenCalledWith(
        `${usersEndpoint}/?page=${page}`,
        expect.objectContaining({ headers: {} })
      );
    });
  });

  it('should request the correct page size', async () => {
    const pageSize = 30000;
    const { waitForNextUpdate } = renderHook(() => useFetchUsers({ pageSize }));

    await act(async () => {
      await waitForNextUpdate();

      await expect(global.fetch).toHaveBeenCalledWith(
        `${usersEndpoint}/?page_size=${pageSize}`,
        expect.objectContaining({ headers: {} })
      );
    });
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

    const { unmount } = renderHook(async () => useFetchUsers({ page }));

    unmount();

    expect(abortSpy).toHaveBeenCalled();
  });
});
