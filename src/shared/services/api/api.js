import { call } from 'redux-saga/effects';
import request from 'utils/request';
import { getAccessToken } from 'shared/services/auth/auth';

export const generateParams = (data) => Object.entries(data)
  .filter((pair) => pair[1])
  .map((pair) => (Array.isArray(pair[1]) === true ?
    pair[1]
      .filter((val) => val)
      .map((val) => `${pair[0]}=${val}`).join('&') :
    pair.map(encodeURIComponent).join('='))).join('&');

export function* authCall(url, params, authorizationToken) {
  const headers = {
    accept: 'application/json'
  };

  if (authorizationToken) {
    headers.Authorization = `Bearer ${authorizationToken}`;
  } else {
    const token = getAccessToken();

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  const options = {
    method: 'GET',
    headers
  };
  const fullUrl = `${url}${params ? `?${generateParams(params)}` : ''}`;
  return yield call(request, fullUrl, options);
}

export function* authCallWithPayload(url, params, method) {
  const headers = {
    'Content-Type': 'application/json'
  };

  const token = getAccessToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const options = {
    method,
    headers,
    body: JSON.stringify(params)
  };

  const fullUrl = `${url}`;
  return yield call(request, fullUrl, options);
}

export function* authPostCall(url, params) {
  return yield call(authCallWithPayload, url, params, 'POST');
}

export function* authDeleteCall(url, params) {
  return yield call(authCallWithPayload, url, params, 'DELETE');
}

export function* authPatchCall(url, params) {
  return yield call(authCallWithPayload, url, params, 'PATCH');
}
