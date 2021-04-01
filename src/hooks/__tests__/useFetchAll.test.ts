import fetchMock from 'jest-fetch-mock';
import { renderHook, act } from '@testing-library/react-hooks';
import JSONresponse from 'utils/__tests__/fixtures/user.json';

// import type { FetchError } from '../useFetch';
import useFetchAll from '../useFetchAll';
import { getErrorMessage } from 'shared/services/api/api';
import { getAuthHeaders } from 'shared/services/auth/auth';
import type { FetchError } from 'hooks/useFetch';

jest.mock('shared/services/auth/auth');

const mockGetAuthHeaders = getAuthHeaders as jest.MockedFunction<typeof getAuthHeaders>;
const URL1 = 'https://here-is-my.api/someId/6';
const URL2 = 'https://here-is-my.api/someId/7';

describe('hooks/useFetchAll', () => {
  let promise: undefined | Promise<void>;

  beforeEach(() => {
    fetchMock.mockResponse(JSON.stringify(JSONresponse));
    fetchMock.mockResponse(JSON.stringify(JSONresponse));
    promise = undefined;
  });

  afterEach(async () => {
    fetchMock.resetMocks();
    if (promise) await promise;
  });

  describe('get', () => {
    it('should request from URLs on mount', async () => {
      const { result, waitForNextUpdate } = renderHook(() => useFetchAll());

      expect(result.current.isLoading).toEqual(false);
      expect(result.current.data).toBeUndefined();

      act(() => {
        promise = result.current.get([URL1, URL2]);
      });

      expect(result.current.isLoading).toEqual(true);

      expect(fetchMock).toHaveBeenCalledWith(
        URL1,
        expect.objectContaining({
          method: 'GET',
        })
      );
      expect(fetchMock).toHaveBeenCalledTimes(2);

      await waitForNextUpdate();

      expect(result.current.isLoading).toEqual(false);
      expect(result.current.data).toEqual([JSONresponse, JSONresponse]);
    });

    it('should use correct request headers', async () => {
      const { result } = renderHook(() => useFetchAll());
      const authHeader = { Authorization: 'Bearer token' };

      await act(async () => {
        await result.current.get([URL1]);
      });

      expect(fetchMock).not.toHaveBeenCalledWith(
        URL1,
        expect.objectContaining({
          headers: expect.objectContaining(authHeader) as Record<string, unknown>,
        })
      );

      mockGetAuthHeaders.mockImplementation(() => authHeader);

      await act(async () => {
        await result.current.get([URL1]);
      });

      expect(fetchMock).toHaveBeenLastCalledWith(
        URL1,
        expect.objectContaining({
          headers: expect.objectContaining(authHeader) as Record<string, unknown>,
        })
      );
    });

    it('should return errors that are thrown during fetch', async () => {
      const error = new Error();
      const message = getErrorMessage(error);
      fetchMock.mockRejectOnce(error);

      const { result, waitForNextUpdate } = renderHook(() => useFetchAll());

      act(() => {
        promise = result.current.get([URL1]);
      });

      expect(result.current.isLoading).toEqual(true);
      expect(result.current.error).toEqual(false);

      await waitForNextUpdate();

      expect(result.current.error).toEqual(error);
      expect((result.current.error as FetchError).message).toEqual(message);
      expect(result.current.isLoading).toEqual(false);
    });

    it('should abort request on unmount', async () => {
      const abortSpy = jest.spyOn(global.AbortController.prototype, 'abort');

      const { result, unmount } = renderHook(() => useFetchAll());

      await act(async () => {
        await result.current.get([URL1]);
      });

      expect(abortSpy).not.toHaveBeenCalled();

      unmount();

      expect(abortSpy).toHaveBeenCalled();
    });

    it('should throw on error response', async () => {
      const response = { status: 401, ok: false, statusText: 'Unauthorized' };
      const message = getErrorMessage(response);

      fetchMock.mockResponse('', response);

      const { result, waitForNextUpdate } = renderHook(() => useFetchAll());

      act(() => {
        promise = result.current.get([URL1]);
      });

      expect(result.current.isLoading).toEqual(true);
      expect(result.current.error).toEqual(false);

      await waitForNextUpdate();

      expect(result.current.error).toEqual(expect.objectContaining(response));
      expect((result.current.error as FetchError).message).toEqual(message);
      expect(result.current.isLoading).toEqual(false);
    });
  });
});
