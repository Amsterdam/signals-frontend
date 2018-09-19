import { call, select } from 'redux-saga/effects';
import request from 'utils/request';

import { makeSelectAccessToken } from '../../../containers/App/selectors';

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
    const token = yield select(makeSelectAccessToken());
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  const options = {
    method: 'GET',
    headers
  };

  const fullUrl = `${url}/${params ? `?${generateParams(params)}` : ''}`;
  // console.log('fullUrl', fullUrl);
  // console.log(options);
  return yield call(request, fullUrl, options);
}

export function* authPostCall(url, params) {
  const headers = {
    'Content-Type': 'application/json'
  };

  const token = yield select(makeSelectAccessToken());
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const options = {
    method: 'POST',
    headers,
    body: JSON.stringify(params)
  };

  const fullUrl = `${url}`;
  // console.log(fullUrl);
  // console.log(options);
  return yield call(request, fullUrl, options);
}

