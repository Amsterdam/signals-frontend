import { renderHook, act } from '@testing-library/react-hooks';
import usersJSON from 'utils/__tests__/fixtures/users.json';
import useFetchUsers, { usersEndpoint } from '../useFetchUsers';

describe('signals/settings/users/containers/Overview/hooks/FetchUsers', () => {
  beforeEach(() => {
    fetch.resetMocks();
  });

  it('should request users from API on mount', async () => {
    fetch.mockResponseOnce(JSON.stringify(usersJSON));

    const { result, waitForNextUpdate } = renderHook(() => useFetchUsers());

    await act(async () => {
      await expect(result.current.isLoading).toEqual(true);
      await expect(result.current.users).toHaveLength(0);

      await waitForNextUpdate();

      await expect(global.fetch).toHaveBeenCalledWith(
        usersEndpoint,
        expect.objectContaining({ headers: {} })
      );

      await expect(result.current.isLoading).toEqual(false);
      await expect(result.current.users).toHaveLength(usersJSON.count);
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

    const { result } = renderHook(() => useFetchUsers({ page: 1 }));

    await act(async () => {
      await expect(result.current.error).toEqual(false);

      await expect(result.current.error).toEqual(error);
    });
  });
});
