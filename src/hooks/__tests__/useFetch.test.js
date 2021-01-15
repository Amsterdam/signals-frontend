import { renderHook, act } from '@testing-library/react-hooks';
import JSONresponse from 'utils/__tests__/fixtures/user.json';
import { getErrorMessage } from 'shared/services/api/api';
import { getAuthHeaders } from 'shared/services/auth/auth';

import useFetch from '../useFetch';

jest.mock('shared/services/auth/auth');

const URL = 'https://here-is-my.api/someId/6';

describe('hooks/useFetch', () => {
  afterEach(() => {
    fetch.resetMocks();
  });

  describe('get', () => {
    it('should request from URL on mount', async () => {
      fetch.mockResponseOnce(JSON.stringify(JSONresponse));

      const { result, waitForNextUpdate } = renderHook(() => useFetch());

      expect(result.current.isLoading).toEqual(false);
      expect(result.current.data).toBeUndefined();

      act(() => {
        result.current.get(URL);
      });

      expect(result.current.isLoading).toEqual(true);

      expect(fetch).toHaveBeenCalledWith(
        URL,
        expect.objectContaining({
          method: 'GET',
        })
      );

      await waitForNextUpdate();

      expect(result.current.isLoading).toEqual(false);
      expect(result.current.data).toEqual(JSONresponse);
    });

    it('should use correct request headers', () => {
      const { result, waitForNextUpdate } = renderHook(() => useFetch());
      const authHeader = { Authorization: 'Bearer token' };

      act(() => {
        result.current.get(URL);
      });

      expect(fetch).not.toHaveBeenCalledWith(
        URL,
        expect.objectContaining({
          headers: expect.objectContaining(authHeader),
        })
      );

      getAuthHeaders.mockImplementation(() => authHeader);

      act(() => {
        result.current.get(URL);
      });

      expect(fetch).toHaveBeenLastCalledWith(
        URL,
        expect.objectContaining({
          headers: expect.objectContaining(authHeader),
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
        result.current.get(URL, params);
      });

      await waitForNextUpdate();

      expect(fetch).toHaveBeenCalledWith(
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
        result.current.get(URL, params);
      });

      await waitForNextUpdate();

      expect(fetch).toHaveBeenCalledWith(
        `${URL}?category=a&category=b&category=c&foo=bar&qux=zork`,
        expect.objectContaining({
          method: 'GET',
        })
      );
    });

    it('should return errors that are thrown during fetch', async () => {
      const error = new Error();
      const message = getErrorMessage(error);
      fetch.mockRejectOnce(error);

      const { result, waitForNextUpdate } = renderHook(() => useFetch());

      act(() => {
        result.current.get(URL);
      });

      expect(result.current.isLoading).toEqual(true);
      expect(result.current.error).toEqual(false);

      await waitForNextUpdate();

      expect(result.current.error).toEqual(error);
      expect(result.current.error.message).toEqual(message);
      expect(result.current.isLoading).toEqual(false);
    });

    it('should abort request on unmount', () => {
      fetch.mockResponseOnce(
        () => new Promise(resolve => setTimeout(() => resolve(JSON.stringify(JSONresponse)), 100))
      );

      const abortSpy = jest.spyOn(global.AbortController.prototype, 'abort');

      const { result, unmount } = renderHook(() => useFetch());

      act(() => {
        result.current.get(URL);
      });

      expect(abortSpy).not.toHaveBeenCalled();

      unmount();

      expect(abortSpy).toHaveBeenCalled();
    });

    it('should throw on error response', async () => {
      const response = { status: 401, ok: false, statusText: 'Unauthorized' };
      const message = getErrorMessage(response);

      fetch.mockImplementation(() => response);

      const { result, waitForNextUpdate } = renderHook(() => useFetch());

      act(() => {
        result.current.get(URL);
      });

      expect(result.current.isLoading).toEqual(true);
      expect(result.current.error).toEqual(false);

      await waitForNextUpdate();

      expect(result.current.error).toEqual(response);
      expect(result.current.error.message).toEqual(message);
      expect(result.current.isLoading).toEqual(false);
    });

    it('should apply request options', async () => {
      const { result, waitForNextUpdate } = renderHook(() => useFetch());
      const params = {};
      const requestOptions = { responseType: 'blob' };

      act(() => {
        result.current.get(URL, params, requestOptions);
      });

      await waitForNextUpdate();

      expect(fetch).toHaveBeenCalledWith(
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
      fetch.mockResponse(JSON.stringify(JSONresponse));

      const { result, waitForNextUpdate } = renderHook(() => useFetch(URL));

      const formData = { ...JSONresponse, is_active: false };

      fetch.mockResponseOnce(JSON.stringify(formData));

      const expectRequest = [
        URL,
        expect.objectContaining({
          body: JSON.stringify(formData),
          method: 'PATCH',
        }),
      ];

      // value of isSuccess can be one of `undefined`, `false`, or `true`
      expect(result.current.isSuccess).not.toEqual(true);

      expect(fetch).not.toHaveBeenLastCalledWith(...expectRequest);

      act(() => {
        result.current.patch(URL, formData);
      });

      await waitForNextUpdate();

      expect(fetch).toHaveBeenLastCalledWith(...expectRequest);

      expect(result.current.isSuccess).toEqual(true);
      expect(result.current.isLoading).toEqual(false);
    });

    it('should throw on error response', async () => {
      const response = { status: 401, ok: false, statusText: 'Unauthorized' };
      const message = getErrorMessage(response);
      const formData = { ...JSONresponse, is_active: false };
      const { result, waitForNextUpdate } = renderHook(() => useFetch());

      // set the result for the patch response
      fetch.mockImplementation(() => response);

      act(() => {
        result.current.patch(URL, formData);
      });

      expect(result.current.isLoading).toEqual(true);
      expect(result.current.error).not.toEqual(response);
      // value of isSuccess can be one of `undefined`, `false`, or `true`
      expect(result.current.isSuccess).not.toEqual(false);

      await waitForNextUpdate();

      expect(result.current.error).toEqual(response);
      expect(result.current.error.message).toEqual(message);
      expect(result.current.isSuccess).toEqual(false);
      expect(result.current.isLoading).toEqual(false);
    });

    it('should apply request options', async () => {
      const { result, waitForNextUpdate } = renderHook(() => useFetch());
      const formData = {};
      const requestOptions = { responseType: 'blob' };

      act(() => {
        result.current.patch(URL, formData, requestOptions);
      });

      await waitForNextUpdate();

      expect(fetch).toHaveBeenCalledWith(
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
      delete formData.id;

      fetch.mockResponseOnce(JSON.stringify(JSONresponse));

      const expectRequest = [
        URL,
        expect.objectContaining({
          body: JSON.stringify(formData),
          method: 'POST',
        }),
      ];

      expect(fetch).not.toHaveBeenCalledWith(...expectRequest);

      act(() => {
        result.current.post(URL, formData);
      });

      expect(result.current.isSuccess).not.toEqual(true);

      await waitForNextUpdate();

      expect(fetch).toHaveBeenCalledWith(...expectRequest);

      expect(result.current.isSuccess).toEqual(true);
      expect(result.current.isLoading).toEqual(false);
    });

    it('should throw on error response', async () => {
      const response = { status: 401, ok: false, statusText: 'Unauthorized' };
      const message = getErrorMessage(response);
      const formData = { ...JSONresponse, is_active: false };
      const { result, waitForNextUpdate } = renderHook(() => useFetch());

      // set the result for the patch response
      fetch.mockImplementation(() => response);

      act(() => {
        result.current.post(URL, formData);
      });

      expect(result.current.isLoading).toEqual(true);
      expect(result.current.error).not.toEqual(response);
      expect(result.current.isSuccess).not.toEqual(false);

      await waitForNextUpdate();

      expect(result.current.error).toEqual(response);
      expect(result.current.error.message).toEqual(message);
      expect(result.current.isSuccess).toEqual(false);
      expect(result.current.isLoading).toEqual(false);
    });

    it('should apply request options', async () => {
      const { result, waitForNextUpdate } = renderHook(() => useFetch());
      const formData = {};
      const requestOptions = { responseType: 'blob' };

      act(() => {
        result.current.post(URL, formData, requestOptions);
      });

      await waitForNextUpdate();

      expect(fetch).toHaveBeenCalledWith(
        URL,
        expect.objectContaining({
          method: 'POST',
          ...requestOptions,
        })
      );
    });
  });
});
