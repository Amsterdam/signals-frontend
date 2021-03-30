import type { Reducer } from 'react';
import { useCallback, useReducer } from 'react';
import { getAuthHeaders } from 'shared/services/auth/auth';
import { getErrorMessage } from 'shared/services/api/api';

type Data = Record<string, unknown>;
export type FetchError = (Response | Error) & { message: string };

interface State<T> {
  data?: T[];
  error?: boolean | FetchError;
  isLoading: boolean;
  isSuccess?: boolean;
}

interface FetchResponse<T> extends State<T> {
  get: (urls: string[], params?: Data, requestOptions?: Data) => Promise<void>;
}

/**
 * Custom hook useFetch
 *
 * Will take a URL and an optional object of parameters and use those to construct a request URL
 * with, call fetch and return the response.
 *
 * @returns {FetchResponse}
 */
const useFetchAll = <T>(): FetchResponse<T> => {
  interface Action {
    payload: boolean | Data[] | FetchError;
    type: string;
  }

  const initialState: State<T> = {
    data: [],
    error: undefined,
    isLoading: false,
    isSuccess: undefined,
  };

  const reducer = (state: State<T>, action: Action): State<T> => {
    // console.log(state, action)
    switch (action.type) {
      case 'SET_LOADING':
        return { ...state, isLoading: action.payload as boolean, error: false };

      case 'SET_GET_DATA':
        return { ...state, data: action.payload as T[], isLoading: false, error: false };

      case 'SET_ERROR':
        return { ...state, isLoading: false, isSuccess: false, error: action.payload as FetchError };

      /* istanbul ignore next */
      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer<Reducer<State<T>, Action>>(reducer, initialState);

  // const controller = useMemo(() => new AbortController(), []);
  // const { signal } = controller;
  const requestHeaders = useCallback(
    () => ({
      ...getAuthHeaders(),
      'Content-Type': 'application/json',
      Accept: 'application/json',
    }),
    []
  );

  // useEffect(
  //   () => () => {
  //     controller.abort();
  //   },
  //   [controller]
  // );

  const get = useCallback(
    async (urls: string[]) => {
      dispatch({ type: 'SET_LOADING', payload: true });

      const requests = urls.map(async url =>
        fetch(url, {
          headers: requestHeaders(),
          method: 'GET',
        })
      );

      try {
        // const fetchResponse = await fetch(requestURL, {
        //   signal,
        //   ...requestOptions,
        // });
        const fetchResponse = await Promise.all(requests);

        if (!fetchResponse.some(response => !response.ok)) {
          const responseData = await Promise.all(fetchResponse.map(response => (response.json() as unknown) as Data));

          dispatch({ type: 'SET_GET_DATA', payload: responseData });
        } else {
          const errorResponse = fetchResponse.find(response => !response.ok);

          Object.defineProperty(fetchResponse, 'message', {
            value: getErrorMessage(fetchResponse),
            writable: false,
          });

          dispatch({ type: 'SET_ERROR', payload: errorResponse as FetchError });
        }
      } catch (exception: unknown) {
        Object.defineProperty(exception, 'message', {
          value: getErrorMessage(exception),
          writable: false,
        });

        dispatch({ type: 'SET_ERROR', payload: exception as FetchError });
      }
    },
    [requestHeaders]
  );

  /**
   * @typedef {Object} FetchResponse
   * @property {Object} data - Fetch response
   * @property {Error} error - Error object thrown during fetch and data parsing
   * @property {Function} get - Function that expects a URL and a query parameter object
   * @property {Boolean} isLoading - Indicator of fetch request status
   * @property {Boolean} isSuccess - Indicator of post or patch request status
   */
  return {
    get,
    ...state,
  };
};

export default useFetchAll;
