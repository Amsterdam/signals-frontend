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
        .filter((pair) => pair[1] !== undefined)
        .map((pair) => pair.map(encodeURIComponent).join('=')).join('&');

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
  // console.log(fullUrl);
  // console.log(options);
  return yield call(request, fullUrl, options);
}

export function* authCall(url, params, cancel) {
  const token = yield select(makeSelectAccessToken());
  return yield authCallWithToken(url, params, cancel, token);
}

