import { call, select } from 'redux-saga/effects';
import request from 'utils/request';

import { makeSelectAccessToken } from '../../../containers/App/selectors';
import CONFIGURATION from '../configuration/configuration';

const createUrl = (url) => {
  if (process.env.NODE_ENV === 'production') {
    return `${CONFIGURATION.API_ROOT}/${url}`;
  }
  return url;
};

const generateParams = (data) => Object.entries(data)
  .filter((pair) => pair[1])
  .map((pair) => (Array.isArray(pair[1]) === true ?
    pair[1]
      .filter((val) => val)
      .map((val) => `${pair[0]}=${val}`).join('&') :
    pair.map(encodeURIComponent).join('='))).join('&');

export function* authCall(url, params) {
  const headers = {
    accept: 'application/json'
  };

  const token = yield select(makeSelectAccessToken());
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const options = {
    method: 'GET',
    headers
  };

  const fullUrl = `${createUrl(url)}/${params ? `?${generateParams(params)}` : ''}`;
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

  const fullUrl = `${createUrl(url)}`;
  // console.log(fullUrl);
  // console.log(options);
  return yield call(request, fullUrl, options);
}

