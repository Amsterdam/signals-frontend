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
  const queryString = 'name1=value1&name2=value2';
  const url = 'https://url/to/test';
  const token = 'bearer-token';

  beforeEach(() => {
    params = {
      name1: 'value1',
      name2: 'value2'
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
  });
});
