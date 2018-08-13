/**
 * Test  sagas
 */

import { all, call, put, takeLatest } from 'redux-saga/effects';
import { replace } from 'react-router-redux';
import request from 'utils/request';

import watchIncidentContainerSaga, { getClassification, createIncident } from './saga';
import { CREATE_INCIDENT, GET_CLASSIFICATION } from './constants';
import {
  createIncidentSuccess,
  createIncidentError,
  getClassificationSuccess,
  getClassificationError
} from './actions';
import { uploadRequest } from '../../../../containers/App/actions';
import mapControlsToParams from '../../services/map-controls-to-params';
// import setClassification from '../../services/set-classification';

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
      takeLatest(CREATE_INCIDENT, createIncident)
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
      payload.incident.image = true;
      payload.incident.image_file = { name: 'some-file' };
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
        signal_id: 666
      }).value).toEqual(put(uploadRequest({
        file: { name: 'some-file' },
        id: 666
      })));
      expect(gen.next().value).toEqual(put(createIncidentSuccess({
        signal_id: 666
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
