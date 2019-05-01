/**
 * Test  sagas
 */

import { all, call, put, takeLatest } from 'redux-saga/effects';
import { replace } from 'react-router-redux';
import request from 'utils/request';

import { authPostCall } from 'shared/services/api/api';
import watchIncidentContainerSaga, { getClassification, createIncident, setPriorityHandler } from './saga';
import { CREATE_INCIDENT, GET_CLASSIFICATION, SET_PRIORITY } from './constants';
import {
  createIncidentSuccess,
  createIncidentError,

  getClassificationSuccess,
  getClassificationError,

  setPriority,
  setPrioritySuccess,
  setPriorityError
} from './actions';
import { uploadRequest, showGlobalError } from '../../../../containers/App/actions';
import mapControlsToParams from '../../services/map-controls-to-params';

jest.mock('../../services/map-controls-to-params');
jest.mock('../../services/set-classification');

describe('IncidentContainer saga', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should watchAppSaga', () => {
    const gen = watchIncidentContainerSaga();
    expect(gen.next().value).toEqual(all([
      takeLatest(GET_CLASSIFICATION, getClassification),
      takeLatest(CREATE_INCIDENT, createIncident),
      takeLatest(SET_PRIORITY, setPriorityHandler)
    ]));
  });

  describe('getClassification', () => {
    let payload;
    let gen;

    beforeEach(() => {
      payload = 'poep';
      gen = getClassification({ payload });
    });

    it('should success', () => {
      expect(gen.next().value).toEqual(call(request, 'https://acc.api.data.amsterdam.nl/signals_mltool/predict', {
        method: 'POST',
        body: JSON.stringify({
          text: 'poep'
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      }));
      expect(gen.next().value).toEqual(put(getClassificationSuccess()));
    });

    it('should error', () => {
      gen.next();
      expect(gen.throw().value).toEqual(put(getClassificationError()));
    });
  });

  describe('createIncident', () => {
    let payload;
    let gen;

    beforeEach(() => {
      payload = {
        incident: {},
        wizard: {}
      };
      mapControlsToParams.mockImplementation(() => ({ payload }));
    });

    it('should success', () => {
      gen = createIncident({ payload });

      expect(gen.next().value).toEqual(call(request, 'https://acc.api.data.amsterdam.nl/signals/signal/', {
        method: 'POST',
        body: JSON.stringify({
          payload
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      }));
      expect(gen.next().value).toEqual(put(createIncidentSuccess()));
    });

    it('should success with file upload', () => {
      payload.incident.images = [{ name: 'some-file' }];
      gen = createIncident({ payload });

      expect(gen.next().value).toEqual(call(request, 'https://acc.api.data.amsterdam.nl/signals/signal/', {
        method: 'POST',
        body: JSON.stringify({
          payload
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      }));
      expect(gen.next({ signal_id: 42 }).value).toEqual(all(payload.incident.images.map((image) => put(uploadRequest({ file: image, id: 42 })))));
      expect(gen.next().value).toEqual(put(createIncidentSuccess({ signal_id: 42 })));
    });

    it('should success with logged in', () => {
      payload.isAuthenticated = true;
      payload.incident.priority = 'high';
      gen = createIncident({ payload });

      expect(gen.next().value).toEqual(call(request, 'https://acc.api.data.amsterdam.nl/signals/signal/', {
        method: 'POST',
        body: JSON.stringify({
          payload
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      }));
      expect(gen.next({
        id: 666
      }).value).toEqual(put(setPriority({
        priority: 'high',
        _signal: 666
      })));
      expect(gen.next().value).toEqual(put(createIncidentSuccess({
        id: 666
      })));
    });

    it('should error', () => {
      gen = createIncident({ payload });
      gen.next();
      expect(gen.throw().value).toEqual(put(createIncidentError()));
      expect(gen.next().value).toEqual(put(replace('/incident/fout')));
    });
  });
});

describe('setPriority', () => {
  let payload;
  let gen;

  beforeEach(() => {
    payload = { priority: 'normal' };
    gen = setPriorityHandler({ payload });
  });

  it('should success', () => {
    // work around for failing toEqual
    expect(JSON.stringify(gen.next().value)).toEqual(JSON.stringify(authPostCall('https://acc.api.data.amsterdam.nl/signals/auth/priority/', payload)));
    expect(gen.next().value).toEqual(put(setPrioritySuccess()));
  });

  it('should error', () => {
    gen.next();
    expect(gen.throw().value).toEqual(put(setPriorityError()));
    expect(gen.next().value).toEqual(put(showGlobalError('PRIORITY_FRAILED'))); // eslint-disable-line redux-saga/yield-effects
  });
});
