import { call } from 'redux-saga/effects';
import request from 'utils/request';

import { generateParams, authCall, authCallWithPayload, authPostCall, authPatchCall } from './api';

jest.mock('containers/App/selectors', () => {
  function mockedMakeSelectAccessToken() { }

  return ({
    makeSelectAccessToken: () => mockedMakeSelectAccessToken,
  });
});

describe('api service', () => {
  let params;
  const queryString = 'name1=value1&name2=value2&value3=foo&value3=bar';
  const url = 'https://url/to/test';
  const token = 'bearer-token';

  beforeEach(() => {
    params = {
      name1: 'value1',
      name2: 'value2',
      value3: ['foo', 'bar']
    };
  });

  afterEach(() => {
    jest.resetAllMocks();
  });


  describe('generateParams', () => {
    it('should create the correct params from object', () => {
      const result = generateParams(params);
      expect(result).toEqual(queryString);
    });
  });

  describe('authCall', () => {
    it('should generate the right call', () => {
      global.sessionStorage.getItem.mockImplementationOnce(() => token);

      const fullUrl = `${url}?${queryString}`;
      const options = {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${token}`
        }
      };
      const gen = authCall(url, params);
      expect(gen.next(token).value).toEqual(call(request, fullUrl, options)); // eslint-disable-line redux-saga/yield-effects
    });

    it('should generate a call without token if it is not present', () => {
      const fullUrl = `${url}?${queryString}`;
      const options = {
        method: 'GET',
        headers: {
          accept: 'application/json'
        }
      };
      const gen = authCall(url, params);
      expect(gen.next().value).toEqual(call(request, fullUrl, options)); // eslint-disable-line redux-saga/yield-effects
    });

    it('should generate the right call when params are not defined', () => {
      global.sessionStorage.getItem.mockImplementationOnce(() => token);

      const fullUrl = `${url}`;
      const options = {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${token}`
        }
      };
      const gen = authCall(url, undefined);
      expect(gen.next(token).value).toEqual(call(request, fullUrl, options)); // eslint-disable-line redux-saga/yield-effects
    });

    it('should generate the right call with a custom token', () => {
      const fullUrl = `${url}?${queryString}`;
      const options = {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization: 'Bearer custom-token'
        }
      };
      const gen = authCall(url, params, 'custom-token');
      expect(gen.next(token).value).toEqual(call(request, fullUrl, options)); // eslint-disable-line redux-saga/yield-effects
    });
  });

  describe('authCallWithPayload', () => {
    it('should generate the right call', () => {
      global.sessionStorage.getItem.mockImplementationOnce(() => token);
      const options = {
        method: 'METHOD',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(params)
      };
      const gen = authCallWithPayload(url, params, 'METHOD');
      expect(gen.next(token).value).toEqual(call(request, url, options)); // eslint-disable-line redux-saga/yield-effects
    });

    it('should generate a call without token if it is not present', () => {
      const options = {
        method: 'METHOD',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(params)
      };
      const gen = authCallWithPayload(url, params, 'METHOD');
      expect(gen.next().value).toEqual(call(request, url, options)); // eslint-disable-line redux-saga/yield-effects
    });
  });

  describe('authPostCall', () => {
    it('should generate the right call', () => {
      const gen = authPostCall(url, params);
      expect(gen.next(token).value).toEqual(call(authCallWithPayload, url, params, 'POST')); // eslint-disable-line redux-saga/yield-effects
    });
  });

  describe('authPatchCall', () => {
    it('should generate the right call', () => {
      const gen = authPatchCall(url, params);
      expect(gen.next(token).value).toEqual(call(authCallWithPayload, url, params, 'PATCH')); // eslint-disable-line redux-saga/yield-effects
    });
  });
});
