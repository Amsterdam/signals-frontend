import { call } from 'redux-saga/effects';
import request from 'utils/request';

import {
  authCall,
  authCallWithPayload,
  authDeleteCall,
  authPatchCall,
  authPostCall,
  generateParams,
} from './api';

describe('api service', () => {
  let params;
  const queryString = 'name1=value1&name2=value2&value3=foo&value3=bar';
  const url = 'https://url/to/test';
  const token = 'bearer-token';
  let origSessionStorage;

  beforeEach(() => {
    params = {
      name1: 'value1',
      name2: 'value2',
      value3: ['foo', 'bar'],
    };
    origSessionStorage = global.sessionStorage;

    global.sessionStorage = {
      getItem: (key) => {
        switch (key) {
          case 'accessToken':
            return '42';
          default:
            return '';
        }
      },
      setItem: jest.fn(),
      removeItem: jest.fn(),
    };
  });

  afterEach(() => {
    jest.resetAllMocks();
    global.sessionStorage = origSessionStorage;
  });

  describe('generateParams', () => {
    it('should create the correct params from object', () => {
      const result = generateParams(params);
      expect(result).toEqual(queryString);
    });
  });

  describe('authCall', () => {
    it('should generate the right call', () => {
      const fullUrl = `${url}?${queryString}`;
      const options = {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization: 'Bearer 42',
        },
      };

      const gen = authCall(url, params);
      expect(gen.next(token).value).toEqual(call(request, fullUrl, options));
    });

    it('should generate a call without token if it is not present', () => {
      jest
        .spyOn(global.sessionStorage, 'getItem')
        .mockImplementationOnce(() => undefined);

      const fullUrl = `${url}?${queryString}`;
      const options = {
        method: 'GET',
        headers: {
          accept: 'application/json',
        },
      };
      const gen = authCall(url, params);
      expect(gen.next().value).toEqual(call(request, fullUrl, options));
    });

    it('should generate the right call when params are not defined', () => {
      jest
        .spyOn(global.sessionStorage, 'getItem')
        .mockImplementationOnce(() => 'bearer-token');
      const fullUrl = `${url}`;
      const options = {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      };
      const gen = authCall(url, undefined);
      expect(gen.next(token).value).toEqual(call(request, fullUrl, options));
    });

    it('should generate the right call with a custom token', () => {
      const fullUrl = `${url}?${queryString}`;
      const options = {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization: 'Bearer custom-token',
        },
      };
      const gen = authCall(url, params, 'custom-token');
      expect(gen.next(token).value).toEqual(call(request, fullUrl, options));
    });
  });

  describe('authCallWithPayload', () => {
    it('should generate the right call', () => {
      const options = {
        method: 'METHOD',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer 42',
        },
        body: JSON.stringify(params),
      };
      const gen = authCallWithPayload(url, params, 'METHOD');
      expect(gen.next(token).value).toEqual(call(request, url, options));
    });

    it('should generate a call without token if it is not present', () => {
      jest
        .spyOn(global.sessionStorage, 'getItem')
        .mockImplementationOnce(() => undefined);
      const options = {
        method: 'METHOD',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      };
      const gen = authCallWithPayload(url, params, 'METHOD');
      expect(gen.next().value).toEqual(call(request, url, options));
    });
  });

  describe('authPostCall', () => {
    it('should generate the right call', () => {
      const gen = authPostCall(url, params);
      expect(gen.next(token).value).toEqual(
        call(authCallWithPayload, url, params, 'POST'),
      );
    });
  });

  describe('authPatchCall', () => {
    it('should generate the right call', () => {
      const gen = authPatchCall(url, params);
      expect(gen.next(token).value).toEqual(
        call(authCallWithPayload, url, params, 'PATCH'),
      );
    });
  });

  describe('authDeleteCall', () => {
    it('should generate the right call', () => {
      const gen = authDeleteCall(url, params);
      expect(gen.next(token).value).toEqual(
        call(authCallWithPayload, url, params, 'DELETE'),
      );
    });
  });
});
