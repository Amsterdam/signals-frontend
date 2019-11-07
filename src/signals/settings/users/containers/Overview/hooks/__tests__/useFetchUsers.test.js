import { renderHook, act } from '@testing-library/react-hooks'
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
    })
  });

  it('should return errors that are thrown during fetch', async () => {
    const error = new Error('fake error message');
    fetch.mockRejectOnce(error);

    const { result } = renderHook(() => useFetchUsers());

    await act(async () => {
      await expect(result.current.error).toEqual(false);

      await expect(result.current.error).toEqual(error);
    });
  });
});
