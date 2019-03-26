import { all, call, put, takeLatest } from 'redux-saga/effects';
import { delay } from 'redux-saga';

import { authCall, authPatchCall } from 'shared/services/api/api';
import { REQUEST_INCIDENT, PATCH_INCIDENT } from './constants';
import { requestIncidentSuccess, requestIncidentError, patchIncidentSuccess, patchIncidentError } from './actions';
import watchIncidentModelSaga, { fetchIncident, patchIncident } from './saga';

jest.mock('shared/services/api/api');

describe('incidentModel saga', () => {
  it('should watchIncidentModelSaga', () => {
    const gen = watchIncidentModelSaga();
    expect(gen.next().value).toEqual(all([
      takeLatest(REQUEST_INCIDENT, fetchIncident),
      takeLatest(PATCH_INCIDENT, patchIncident)
    ]));
  });

  it('should fetchIncident success', () => {
    const requestURL = 'https://acc.api.data.amsterdam.nl/signals/auth/signal';
    const id = 1000;
    const action = { payload: id };
    const incident = { id, name: 'incident' };

    const gen = fetchIncident(action);
    expect(gen.next().value).toEqual(authCall(`${requestURL}/${id}`));
    expect(gen.next(incident).value).toEqual(put(requestIncidentSuccess(incident))); // eslint-disable-line redux-saga/yield-effects
  });

  it('should fetchIncident error', () => {
    const id = 1000;
    const action = { payload: id };
    const error = new Error('404 Not Found');

    const gen = fetchIncident(action);
    gen.next();
    expect(gen.throw(error).value).toEqual(put(requestIncidentError(error))); // eslint-disable-line redux-saga/yield-effects
  });

  it('should fetchIncident success', () => {
    const requestURL = 'https://acc.api.data.amsterdam.nl/signals/auth/signal';
    const id = 1000;
    const action = { payload: id };
    const incident = { id, name: 'incident' };

    const gen = fetchIncident(action);
    expect(gen.next().value).toEqual(authCall(`${requestURL}/${id}`));
    expect(gen.next(incident).value).toEqual(put(requestIncidentSuccess(incident))); // eslint-disable-line redux-saga/yield-effects
  });

  it('should patchIncident success', () => {
    const id = 1000;
    const requestURL = 'https://acc.api.data.amsterdam.nl/signals/v1/private/signals';
    const action = {
      payload: {
        id,
        type: 'location',
        patch: {
          location: { stadsdeel: 'A' }
        }
      }
    };
    const incident = { id: 1000 };
    const payload = { type: 'location', incident };


    const gen = patchIncident(action);
    expect(gen.next().value).toEqual(authPatchCall(`${requestURL}/${id}`));
    expect(gen.next(incident).value).toEqual(call(delay, 1000)); // eslint-disable-line redux-saga/yield-effects
    expect(gen.next().value).toEqual(put(patchIncidentSuccess(payload))); // eslint-disable-line redux-saga/yield-effects
  });

  it('should patchIncident error', () => {
    const id = 1000;
    const action = {
      payload: {
        id,
        type: 'location',
        patch: {
          location: { stadsdeel: 'A' }
        }
      }
    };
    const error = new Error('404 Not Found');

    const gen = patchIncident(action);
    gen.next();
    expect(gen.throw(error).value).toEqual(put(patchIncidentError({ type: action.payload.type, error }))); // eslint-disable-line redux-saga/yield-effects
  });
});
