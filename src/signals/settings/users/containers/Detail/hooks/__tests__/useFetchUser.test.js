import { renderHook } from '@testing-library/react-hooks';
import userJSON from 'utils/__tests__/fixtures/user.json';
import useFetchUser, { userEndpoint } from '../useFetchUser';

describe('signals/settings/users/containers/Detail/hooks/useFetchUser', () => {
  beforeEach(() => {
    fetch.resetMocks();
  });

  it('should request user from API on mount', async () => {
    const userId = 45;
    fetch.mockResponseOnce(JSON.stringify(userJSON));
    const { result, waitForNextUpdate } = renderHook(() => useFetchUser(userId));

    expect(result.current.isLoading).toEqual(true);
    expect(result.current.data).toBeUndefined();

    await waitForNextUpdate();

    expect(global.fetch).toHaveBeenCalledWith(
      `${userEndpoint}${userId}`,
      expect.objectContaining({ headers: {} })
    );

    expect(result.current.isLoading).toEqual(false);
    expect(result.current.data).toEqual(userJSON);
  });

  it('should return errors that are thrown during fetch', async () => {
    const userId = 99;
    const error = new Error('fake error message');
    fetch.mockRejectOnce(error);

    const { result, waitForNextUpdate } = renderHook(() => useFetchUser(userId));

    expect(result.current.error).toEqual(false);

    await waitForNextUpdate();

    expect(result.current.error).toEqual(error);
    expect(result.current.isLoading).toEqual(false);
  });
});
