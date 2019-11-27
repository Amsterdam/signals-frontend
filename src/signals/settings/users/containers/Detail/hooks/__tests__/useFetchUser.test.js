import { renderHook, act , cleanup } from '@testing-library/react-hooks';
import { wait } from '@testing-library/react';
import userJSON from 'utils/__tests__/fixtures/user.json';
import configuration from 'shared/services/configuration/configuration';
import useFetchUser from '../useFetchUser';

describe('signals/settings/users/containers/Detail/hooks/useFetchUser', () => {
  afterEach(() => {
    cleanup();
    fetch.resetMocks();
  });

  it('should request user from API on mount', async () => {
    const userId = 45;
    fetch.mockResponseOnce(JSON.stringify(userJSON));

    const { result, waitForNextUpdate } = renderHook(() =>
      useFetchUser(userId)
    );

    expect(result.current.isLoading).toEqual(true);
    expect(result.current.data).toBeUndefined();

    await waitForNextUpdate();

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringMatching(new RegExp(`\\/${userId}$`)),
      expect.objectContaining({ headers: {} })
    );

    expect(result.current.isLoading).toEqual(false);
    expect(result.current.data).toEqual(userJSON);
  });

  it('should return errors that are thrown during fetch', async () => {
    const userId = 99;
    const error = new Error();
    fetch.mockRejectOnce(error);

    const { result, waitForNextUpdate } = renderHook(() =>
      useFetchUser(userId)
    );

    expect(result.current.isLoading).toEqual(true);
    expect(result.current.error).toEqual(false);

    await waitForNextUpdate();

    expect(result.current.error).toEqual(error);
    expect(result.current.isLoading).toEqual(false);
  });

  it('should abort request on unmount', () => {
    const userId = 123;
    fetch.mockResponseOnce(
      () =>
        new Promise(resolve =>
          setTimeout(() => resolve(JSON.stringify(userJSON)), 100)
        )
    );

    const abortSpy = jest.spyOn(global.AbortController.prototype, 'abort');

    const { unmount } = renderHook(async () => useFetchUser(userId));

    unmount();

    expect(abortSpy).toHaveBeenCalled();
  });

  it('should throw on error response', async () => {
    const userId = 13;
    const response = { status: 401, ok: false, statusText: 'Unauthorized' };

    fetch.mockImplementation(() => response);

    const { result, waitForNextUpdate } = renderHook(() =>
      useFetchUser(userId)
    );

    expect(result.current.isLoading).toEqual(true);
    expect(result.current.error).toEqual(false);

    await waitForNextUpdate();

    expect(result.current.error).toEqual(response);
    expect(result.current.isLoading).toEqual(false);
  });

  describe('patch', () => {
    it('should send PATCH request', async () => {
      fetch.mockResponse(JSON.stringify(userJSON));

      const userId = 1;

      const {
        result,
        waitForNextUpdate,
      } = renderHook(() => useFetchUser(userId));

      expect(result.current.isLoading).toEqual(true);

      // make sure the side effects are all done
      await waitForNextUpdate();

      fetch.resetMocks();

      const formData = { ...userJSON, is_active: false };

      fetch.mockResponseOnce(JSON.stringify(formData));

      // value of isSuccess can be one of `undefined`, `false`, or `true`
      expect(result.current.isSuccess).not.toEqual(true);

      act(() => {
        result.current.patch(formData);
      });

      await waitForNextUpdate();

      expect(global.fetch).toHaveBeenLastCalledWith(
        expect.stringMatching(new RegExp(`\\/${userId}$`)),
        expect.objectContaining({
          body: JSON.stringify(formData),
          method: 'PATCH',
        })
      );

      expect(result.current.isSuccess).toEqual(true);
      expect(result.current.isLoading).toEqual(false);
    });

    it('should throw on error response', async () => {
      const response = { status: 401, ok: false, statusText: 'Unauthorized' };
      const formData = { ...userJSON, is_active: false };
      const userId = 13;
      const {
        result,
        waitForNextUpdate,
      } = renderHook(() => useFetchUser(userId));

      expect(result.current.isLoading).toEqual(true);
      expect(result.current.error).not.toEqual(response);
      // value of isSuccess can be one of `undefined`, `false`, or `true`
      expect(result.current.isSuccess).not.toEqual(false);

      // make sure the side effects are all done
      await waitForNextUpdate();

      const { patch } = result.current;

      // set the result for the patch response
      fetch.mockImplementation(() => response);

      act(() => {
        patch(formData);
      });

      await waitForNextUpdate();

      expect(result.current.error).toEqual(response);
      expect(result.current.isSuccess).toEqual(false);
      expect(result.current.isLoading).toEqual(false);
    });
  });

  describe('post', () => {
    it('should send POST request', async () => {
      // fetch.mockResponse(JSON.stringify(userJSON));

      // const userId = userJSON.id;

      const {
        result,
        waitForNextUpdate,
      } = renderHook(() => useFetchUser());

      // expect(result.current.isLoading).toEqual(true);

      // // make sure the side effects are all done
      // await waitForNextUpdate();

      // fetch.resetMocks();

      const formData = { first_name: userJSON.first_name, last_name: userJSON.last_name, username: userJSON.username };
      delete formData.id;

      fetch.mockResponseOnce(JSON.stringify(userJSON));

      expect(result.current.isSuccess).not.toEqual(true);

      act(() => {
        result.current.post(formData);
      });

      await waitForNextUpdate();

      expect(global.fetch).toHaveBeenCalledWith(
        configuration.USERS_ENDPOINT,
        expect.objectContaining({
          body: JSON.stringify(formData),
          method: 'POST',
        })
      );

      expect(result.current.isSuccess).toEqual(true);
      expect(result.current.isLoading).toEqual(false);
    });

    it('should throw on error response', async () => {
      const response = { status: 401, ok: false, statusText: 'Unauthorized' };
      const formData = { ...userJSON, is_active: false };
      const userId = 13;
      const {
        result,
        waitForNextUpdate,
      } = renderHook(() => useFetchUser(userId));

      expect(result.current.isLoading).toEqual(true);
      expect(result.current.error).not.toEqual(response);
      expect(result.current.isSuccess).not.toEqual(false);

      // make sure the side effects are all done
      await waitForNextUpdate();

      const { post } = result.current;

      // set the result for the patch response
      fetch.mockImplementation(() => response);

      act(() => {
        post(formData);
      });

      await waitForNextUpdate();

      expect(result.current.error).toEqual(response);
      expect(result.current.isSuccess).toEqual(false);
      expect(result.current.isLoading).toEqual(false);
    });
  });

  it('should NOT request user from API on mount', async () => {
    const { waitForNextUpdate } = renderHook(() =>
      useFetchUser()
    );

    waitForNextUpdate();

    await wait(() => expect(global.fetch).not.toHaveBeenCalled());
  });
});
