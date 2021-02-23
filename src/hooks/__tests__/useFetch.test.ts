import fetchMock from 'jest-fetch-mock';
import { renderHook, act } from '@testing-library/react-hooks';
import JSONresponse from 'utils/__tests__/fixtures/user.json';
import { getErrorMessage } from 'shared/services/api/api';
import { getAuthHeaders } from 'shared/services/auth/auth';

import type { FetchError } from '../useFetch';
import useFetch from '../useFetch';

jest.mock('shared/services/auth/auth');

const mockGetAuthHeaders = getAuthHeaders as jest.MockedFunction<typeof getAuthHeaders>;
const URL = 'https://here-is-my.api/someId/6';

describe('hooks/useFetch', () => {
  let promise: undefined | Promise<void>;

  beforeEach(() => {
    fetchMock.mockResponse(JSON.stringify(JSONresponse));
    promise = undefined;
  });

  afterEach(async () => {
    fetchMock.resetMocks();
    if (promise) await promise;
  });

  describe('get', () => {
    it('should request from URL on mount', async () => {
      const { result, waitForNextUpdate } = renderHook(() => useFetch());

      expect(result.current.isLoading).toEqual(false);
      expect(result.current.data).toBeUndefined();

      act(() => {
        promise = result.current.get(URL);
      });

      expect(result.current.isLoading).toEqual(true);

      expect(fetchMock).toHaveBeenCalledWith(
        URL,
        expect.objectContaining({
          method: 'GET',
        })
      );

      await waitForNextUpdate();

      expect(result.current.isLoading).toEqual(false);
      expect(result.current.data).toEqual(JSONresponse);
    });

    it('should use correct request headers', async () => {
      const { result } = renderHook(() => useFetch());
      const authHeader = { Authorization: 'Bearer token' };

      await act(async () => {
        await result.current.get(URL);
      });

      expect(fetchMock).not.toHaveBeenCalledWith(
        URL,
        expect.objectContaining({
          headers: expect.objectContaining(authHeader) as Record<string, unknown>,
        })
      );

      mockGetAuthHeaders.mockImplementation(() => authHeader);

      await act(async () => {
        await result.current.get(URL);
      });

      expect(fetchMock).toHaveBeenLastCalledWith(
        URL,
        expect.objectContaining({
          headers: expect.objectContaining(authHeader) as Record<string, unknown>,
        })
      );
    });

    it('should construct a URL with query params', async () => {
      const params = {
        foo: 'bar',
        qux: 'zork',
      };

      const { result, waitForNextUpdate } = renderHook(() => useFetch());

      act(() => {
        promise = result.current.get(URL, params);
      });

      await waitForNextUpdate();

      expect(fetchMock).toHaveBeenCalledWith(
        `${URL}?foo=bar&qux=zork`,
        expect.objectContaining({
          method: 'GET',
        })
      );
    });

    it('should construct a URL with complex query params', async () => {
      const params = {
        foo: 'bar',
        qux: 'zork',
        category: ['a', 'b', 'c'],
      };

      const { result, waitForNextUpdate } = renderHook(() => useFetch());

      act(() => {
        promise = result.current.get(URL, params);
      });

      await waitForNextUpdate();

      expect(fetchMock).toHaveBeenCalledWith(
        `${URL}?category=a&category=b&category=c&foo=bar&qux=zork`,
        expect.objectContaining({
          method: 'GET',
        })
      );
    });

    it('should return errors that are thrown during fetch', async () => {
      const error = new Error();
      const message = getErrorMessage(error);
      fetchMock.mockRejectOnce(error);

      const { result, waitForNextUpdate } = renderHook(() => useFetch());

      act(() => {
        promise = result.current.get(URL);
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

      const { result, unmount } = renderHook(() => useFetch());

      await act(async () => {
        await result.current.get(URL);
      });

      expect(abortSpy).not.toHaveBeenCalled();

      unmount();

      expect(abortSpy).toHaveBeenCalled();
    });

    it('should throw on error response', async () => {
      const response = { status: 401, ok: false, statusText: 'Unauthorized' };
      const message = getErrorMessage(response);

      fetchMock.mockResponseOnce('', response);

      const { result, waitForNextUpdate } = renderHook(() => useFetch());

      act(() => {
        promise = result.current.get(URL);
      });

      expect(result.current.isLoading).toEqual(true);
      expect(result.current.error).toEqual(false);

      await waitForNextUpdate();

      expect(result.current.error).toEqual(expect.objectContaining(response));
      expect((result.current.error as FetchError).message).toEqual(message);
      expect(result.current.isLoading).toEqual(false);
    });

    it('should apply request options', async () => {
      const { result, waitForNextUpdate } = renderHook(() => useFetch());
      const params = {};
      const requestOptions = { responseType: 'blob' };

      act(() => {
        promise = result.current.get(URL, params, requestOptions);
      });

      await waitForNextUpdate();

      expect(fetchMock).toHaveBeenCalledWith(
        URL,
        expect.objectContaining({
          method: 'GET',
          ...requestOptions,
        })
      );
    });
  });

  describe('patch', () => {
    it('should send PATCH request', async () => {
      fetchMock.mockResponse(JSON.stringify(JSONresponse));

      const { result, waitForNextUpdate } = renderHook(() => useFetch());

      const formData = { ...JSONresponse, is_active: false };

      fetchMock.mockResponseOnce(JSON.stringify(formData));

      const expectRequest = [
        URL,
        expect.objectContaining({
          body: JSON.stringify(formData),
          method: 'PATCH',
        }),
      ];

      // value of isSuccess can be one of `undefined`, `false`, or `true`
      expect(result.current.isSuccess).not.toEqual(true);

      expect(fetchMock).not.toHaveBeenLastCalledWith(...expectRequest);

      act(() => {
        promise = result.current.patch(URL, formData);
      });

      await waitForNextUpdate();

      expect(fetchMock).toHaveBeenLastCalledWith(...expectRequest);

      expect(result.current.isSuccess).toEqual(true);
      expect(result.current.isLoading).toEqual(false);
    });

    it('should throw on error response', async () => {
      const response = { status: 401, ok: false, statusText: 'Unauthorized' };
      const message = getErrorMessage(response);
      const formData = { ...JSONresponse, is_active: false };
      const { result, waitForNextUpdate } = renderHook(() => useFetch());

      fetchMock.mockResponseOnce('', response);

      act(() => {
        promise = result.current.patch(URL, formData);
      });

      expect(result.current.isLoading).toEqual(true);
      expect(result.current.error).not.toEqual(expect.objectContaining(response));
      // value of isSuccess can be one of `undefined`, `false`, or `true`
      expect(result.current.isSuccess).not.toEqual(false);

      await waitForNextUpdate();

      expect(result.current.error).toEqual(expect.objectContaining(response));
      expect((result.current.error as FetchError).message).toEqual(message);
      expect(result.current.isSuccess).toEqual(false);
      expect(result.current.isLoading).toEqual(false);
    });

    it('should apply request options', async () => {
      const { result, waitForNextUpdate } = renderHook(() => useFetch());
      const formData = {};
      const requestOptions = { responseType: 'blob' };

      act(() => {
        promise = result.current.patch(URL, formData, requestOptions);
      });

      await waitForNextUpdate();

      expect(fetchMock).toHaveBeenCalledWith(
        URL,
        expect.objectContaining({
          method: 'PATCH',
          ...requestOptions,
        })
      );
    });
  });

  describe('post', () => {
    it('should send POST request', async () => {
      const { result, waitForNextUpdate } = renderHook(() => useFetch());

      const formData = {
        first_name: JSONresponse.first_name,
        last_name: JSONresponse.last_name,
        username: JSONresponse.username,
      };

      fetchMock.mockResponseOnce(JSON.stringify(JSONresponse));

      const expectRequest = [
        URL,
        expect.objectContaining({
          body: JSON.stringify(formData),
          method: 'POST',
        }),
      ];

      expect(fetchMock).not.toHaveBeenCalledWith(...expectRequest);

      act(() => {
        promise = result.current.post(URL, formData);
      });

      expect(result.current.isSuccess).not.toEqual(true);

      await waitForNextUpdate();

      expect(fetchMock).toHaveBeenCalledWith(...expectRequest);

      expect(result.current.isSuccess).toEqual(true);
      expect(result.current.isLoading).toEqual(false);
    });

    it('should throw on error response', async () => {
      const response = { status: 401, ok: false, statusText: 'Unauthorized' };
      const message = getErrorMessage(response);
      const formData = { ...JSONresponse, is_active: false };
      const { result, waitForNextUpdate } = renderHook(() => useFetch());

      fetchMock.mockResponseOnce('', response);

      act(() => {
        promise = result.current.post(URL, formData);
      });

      expect(result.current.isLoading).toEqual(true);
      expect(result.current.error).not.toEqual(expect.objectContaining(response));
      expect(result.current.isSuccess).not.toEqual(false);

      await waitForNextUpdate();

      expect(result.current.error).toEqual(expect.objectContaining(response));
      expect((result.current.error as FetchError).message).toEqual(message);
      expect(result.current.isSuccess).toEqual(false);
      expect(result.current.isLoading).toEqual(false);
    });

    it('should apply request options', async () => {
      const { result, waitForNextUpdate } = renderHook(() => useFetch());
      const formData = {};
      const requestOptions = { responseType: 'blob' };

      act(() => {
        promise = result.current.post(URL, formData, requestOptions);
      });

      await waitForNextUpdate();

      expect(fetchMock).toHaveBeenCalledWith(
        URL,
        expect.objectContaining({
          method: 'POST',
          ...requestOptions,
        })
      );
    });
  });
});
