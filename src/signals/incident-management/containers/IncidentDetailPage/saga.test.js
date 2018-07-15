import { put, takeLatest } from 'redux-saga/effects';

import { authCall } from 'shared/services/api/api';
import { REQUEST_INCIDENT } from './constants';
import { requestIncidentSuccess } from './actions';
import watchRequestIncidentSaga, { fetchIncident } from './saga';

jest.mock('shared/services/api/api');


describe('IncidentDetailPage saga', () => {
  it('should watchRequestIncidentSaga', () => {
    const gen = watchRequestIncidentSaga();
    expect(gen.next().value).toEqual(takeLatest(REQUEST_INCIDENT, fetchIncident)); // eslint-disable-line redux-saga/yield-effects
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

  // it('should fetchIncident error', () => {
  //   const id = 1000;
  //   const action = { payload: id };
  //   const thrownError = { status: 500, text: 'Internal ServerError' };

  //   const gen = fetchIncident(action);
  //   expect(gen.throw('thrownError').value).toEqual(put(requestIncidentError('thrownError'))); // eslint-disable-line redux-saga/yield-effects
  // });
});
