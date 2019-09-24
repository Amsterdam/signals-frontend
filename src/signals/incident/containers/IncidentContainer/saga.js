import { all, call, put, select, takeLatest } from 'redux-saga/effects';
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
import { makeSelectCategories } from '../../../../containers/App/selectors';
import mapControlsToParams from '../../services/map-controls-to-params';
import setClassification from '../../services/set-classification';

export function* getClassification(action) {
  const requestURL = `${CONFIGURATION.API_ROOT}signals/category/prediction`;
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
    const categories = yield select(makeSelectCategories());
    yield put(getClassificationSuccess(setClassification(result, categories.sub)));
  } catch (error) {
    yield put(getClassificationError(setClassification()));
  }
}

export function* createIncident(action) {
  console.log('createIncident 1', action);
  const requestURL = `${CONFIGURATION.API_ROOT}signals/signal/`;
  try {
    console.log('createIncident 2 requestURL', requestURL);
    const result = yield call(request, requestURL, {
      method: 'POST',
      body: JSON.stringify(mapControlsToParams(action.payload.incident, action.payload.wizard)),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    console.log('createIncident 3 result', result);

    if (action.payload.isAuthenticated && action.payload.incident.priority.id === 'high') {
      console.log('createIncident 4 prio', result, action.payload.incident.priority.id);
      yield put(setPriority({
        priority: action.payload.incident.priority.id,
        _signal: result.id
      }));
    }

    if (action.payload.incident.images) {
      console.log('createIncident 5 images', result, action.payload.incident.images);
      yield all(action.payload.incident.images.map((image) =>
        put(uploadRequest({
          file: image,
          id: result.signal_id
        }))
      ));
    }
    yield put(createIncidentSuccess(result));
    console.log('createIncident 6 sucess');
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
