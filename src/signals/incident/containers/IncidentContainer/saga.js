import { all, call, put, /* select, */ takeLatest } from 'redux-saga/effects';
import { replace } from 'react-router-redux';
import request from 'utils/request';

import { authPostCall } from 'shared/services/api/api';
import CONFIGURATION from 'shared/services/configuration/configuration';
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
import setClassification from '../../services/set-classification';

// import makeSelectIncidentContainer from './selectors';

export function* getClassification(action) {
  const requestURL = `${CONFIGURATION.API_ROOT_MLTOOL}signals_mltool/predict`;

  try {
    const result = yield call(request, requestURL, {
      method: 'POST',
      body: JSON.stringify({
        text: action.payload
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    yield put(getClassificationSuccess(setClassification(result)));
  } catch (error) {
    yield put(getClassificationError(setClassification()));
  }
}

export function* createIncident(action) {
  const requestURL = `${CONFIGURATION.API_ROOT}signals/signal/`;
  try {
    const result = yield call(request, requestURL, {
      method: 'POST',
      body: JSON.stringify(mapControlsToParams(action.payload.incident, action.payload.wizard)),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (action.payload.isAuthenticated && action.payload.incident.priority) {
      yield put(setPriority({
        priority: action.payload.incident.priority,
        _signal: result.id
      }));
    }

    if (action.payload.incident.image) {
      yield put(uploadRequest({
        file: action.payload.incident.image_file,
        id: result.signal_id
      }));
    }
    yield put(createIncidentSuccess(result));
  } catch (error) {
    yield put(createIncidentError());
    yield put(replace('/incident/fout'));
  }
}

export function* setPriorityHandler(action) {
  const requestURL = `${CONFIGURATION.API_ROOT}signals/auth/priority/`;
  try {
    const result = yield authPostCall(requestURL, action.payload);
    yield put(setPrioritySuccess(result));
  } catch (error) {
    yield put(setPriorityError());
    yield put(showGlobalError('PRIORITY_FRAILED'));
  }
}

// Individual exports for testing
export default function* watchIncidentContainerSaga() {
  yield all([
    takeLatest(GET_CLASSIFICATION, getClassification),
    takeLatest(CREATE_INCIDENT, createIncident),
    takeLatest(SET_PRIORITY, setPriorityHandler)
  ]);
}
