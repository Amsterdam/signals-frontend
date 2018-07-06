import { call, put, /* select, */ takeLatest } from 'redux-saga/effects';
import request from 'utils/request';

import { CREATE_INCIDENT, GET_CLASSIFICATION } from './constants';
import {
  createIncidentSuccess,
  createIncidentError,
  getClassificationSuccess,
  getClassificationError
} from './actions';
import mapControlsToParams from '../../services/map-controls-to-params';

// import makeSelectIncidentContainer from './selectors';

export function* getClassification({ text }) {
  const requestURL = 'https://meldingen-classification.herokuapp.com/calls/';

  try {
    const result = yield call(request, requestURL, {
      method: 'POST',
      body: JSON.stringify({
        text
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    yield put(getClassificationSuccess(result));
  } catch (err) {
    yield put(getClassificationError(err));
  }
}

export function* createIncident({ incident, wizard }) {
  const requestURL = 'https://acc.api.data.amsterdam.nl/signals/signal/';

  try {
    const result = yield call(request, requestURL, {
      method: 'POST',
      body: JSON.stringify(mapControlsToParams(incident, wizard)),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    yield put(createIncidentSuccess(result));
  } catch (err) {
    yield put(createIncidentError(err));
  }
}

// Individual exports for testing
export default function* watchIncidentContainerSaga() {
  yield [
    yield takeLatest(GET_CLASSIFICATION, getClassification),
    yield takeLatest(CREATE_INCIDENT, createIncident)
  ];
}
