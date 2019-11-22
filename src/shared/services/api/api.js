import { call } from 'redux-saga/effects';
import request from 'utils/request';
import { getAccessToken } from 'shared/services/auth/auth';

export const generateParams = data => Object.entries(data)
  .filter(pair => pair[1])
  .map(pair => Array.isArray(pair[1]) === true
    ? pair[1]
      .filter(val => val)
      .map(val => `${pair[0]}=${val}`)
      .join('&')
    : pair.map(encodeURIComponent).join('='),)
  .join('&');

export function* authCall(url, params, authorizationToken) {
  const headers = {
    accept: 'application/json',
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
    headers,
  };
  const fullUrl = `${url}${params ? `?${generateParams(params)}` : ''}`;
  return yield call(request, fullUrl, options);
}

export function* authCallWithPayload(url, params, method) {
  const headers = {
    'Content-Type': 'application/json',
  };

  const token = getAccessToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const options = {
    method,
    headers,
    body: JSON.stringify(params),
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

export function* postCall(url, params) {
  const options = {
    method: 'POST',
    body: JSON.stringify(params),
    headers: {
      'Content-Type': 'application/json',
    },
  };

  return yield call(request, url, options);
}

export const defaultErrorMessage = 'De opgevraagde gegevens konden niet gevonden worden';

/**
 * Get an error message based on an error's status code
 *
 * @param {Error} error
 * @returns {String}
 */
export const getErrorMessage = error => {
  let message;

  switch (error.status) {
    case 500:
      message = 'Interne fout op de server. Probeer het nogmaals';
      break;
    case 503:
      message = 'Server is op dit moment niet beschikbaar. Probeer het nogmaals';
      break;
    case 400:
      message = 'De server kan de gegevens niet verwerken';
      break;
    case 401:
      message = 'Je hebt niet voldoende rechten om de opgevraagde gegevens te bekijken';
      break;
    case 403:
      message = 'Het is niet toegestaan om gegevens te bekijken of te wijzigen';
      break;
    case 408:
      message = 'Het verzoek kan niet verwerkt worden door een timeout op de server';
      break;
    case 413:
      message = 'De grootte van de payload overschrijdt de toegestane limiet';
      break;
    case 418:
      message = 'The server refuses to brew coffee because it is a teapot';
      break;
    case 429:
      message = 'Er zijn teveel verzoeken verstuurd';
      break;
    case 404:
    default:
      message = defaultErrorMessage;
      break;
  }

  return message;
};
