import { call, select } from 'redux-saga/effects';
import request from 'utils/request';
import { makeSelectAccessToken } from 'containers/App/selectors';

import { generateParams, authCall, authPostCall } from './api';

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
      const fullUrl = `${url}/?${queryString}`;
      const options = {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${token}`
        }
      };
      const gen = authCall(url, params);
      expect(gen.next().value).toEqual(select(makeSelectAccessToken())); // eslint-disable-line redux-saga/yield-effects
      expect(gen.next(token).value).toEqual(call(request, fullUrl, options)); // eslint-disable-line redux-saga/yield-effects
    });

    it('should generate a call without token if it is not present', () => {
      const fullUrl = `${url}/?${queryString}`;
      const options = {
        method: 'GET',
        headers: {
          accept: 'application/json'
        }
      };
      const gen = authCall(url, params);
      expect(gen.next().value).toEqual(select(makeSelectAccessToken())); // eslint-disable-line redux-saga/yield-effects
      expect(gen.next().value).toEqual(call(request, fullUrl, options)); // eslint-disable-line redux-saga/yield-effects
    });

    it('should generate the right call when params are not defined', () => {
      const fullUrl = `${url}/`;
      const options = {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${token}`
        }
      };
      const gen = authCall(url, undefined);
      expect(gen.next().value).toEqual(select(makeSelectAccessToken())); // eslint-disable-line redux-saga/yield-effects
      expect(gen.next(token).value).toEqual(call(request, fullUrl, options)); // eslint-disable-line redux-saga/yield-effects
    });

    it('should generate the right call with a custom token', () => {
      const fullUrl = `${url}/?${queryString}`;
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

  describe('authPostCall', () => {
    it('should generate the right call', () => {
      const fullUrl = `${url}`;
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(params)
      };
      const gen = authPostCall(url, params);
      expect(gen.next().value).toEqual(select(makeSelectAccessToken())); // eslint-disable-line redux-saga/yield-effects
      expect(gen.next(token).value).toEqual(call(request, fullUrl, options)); // eslint-disable-line redux-saga/yield-effects
    });

    it('should generate a call without token if it is not present', () => {
      const fullUrl = `${url}`;
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(params)
      };
      const gen = authPostCall(url, params);
      expect(gen.next().value).toEqual(select(makeSelectAccessToken())); // eslint-disable-line redux-saga/yield-effects
      expect(gen.next().value).toEqual(call(request, fullUrl, options)); // eslint-disable-line redux-saga/yield-effects
    });
  });
});
