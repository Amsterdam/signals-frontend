import { call, select } from 'redux-saga/effects';
import request from 'utils/request';

import { makeSelectAccessToken } from '../../../containers/App/selectors';

const generateParams = (data) => Object.entries(data).map((pair) => pair.map(encodeURIComponent).join('=')).join('&');

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

  const fullUrl = `${url}${params ? `?${generateParams(params)}` : ''}`;
  return yield call(request, fullUrl, options);
}

export function* authCall(url, params, cancel) {
  const token = yield select(makeSelectAccessToken());
  return yield authCallWithToken(url, params, cancel, token);
}

