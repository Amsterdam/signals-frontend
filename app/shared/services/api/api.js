import { call, select } from 'redux-saga/effects';
import request from 'utils/request';

import { makeSelectAccessToken } from '../../../containers/App/selectors';
import CONFIGURATION from '../configuration/configuration';

const createUrl = (url) => {
  if (process.env.NODE_ENV === 'development') {
    return url;
  }
  return `${CONFIGURATION.API_ROOT}/${url}`;
};

const generateParams = (data) => Object.entries(data)
        .filter((pair) => pair[1])
        .map((pair) => pair.map(encodeURIComponent).join('=')).join('&');

// const generateParam = (data) => Object.keys(data)
//         .filter((key) => data[key])
//         .reduce((result, key) => (
//           result + data[key].map((pair) => pair.map(encodeURIComponent).join('=')).join('&')
//           // {
//           // ...result,
//           // [key]: data[key]
//         ), '');


function* authCallWithToken(url, params, cancel, token) {
  const headers = { };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const options = {
    method: 'GET',
    headers
  };

  if (cancel) {
    options.signal = cancel;
  }

  const fullUrl = `${createUrl(url)}/${params ? `?${generateParams(params)}` : ''}`;
  return yield call(request, fullUrl, options);
}

export function* authCall(url, params, cancel) {
  const token = yield select(makeSelectAccessToken());
  return yield authCallWithToken(url, params, cancel, token);
}

