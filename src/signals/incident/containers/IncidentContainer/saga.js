import { all, call, put, take, /* select, */ takeLatest, takeEvery } from 'redux-saga/effects';
import { replace } from 'react-router-redux';
import request from 'utils/request';

import CONFIGURATION from 'shared/services/configuration/configuration';
import { CREATE_INCIDENT, GET_CLASSIFICATION, UPLOAD_REQUEST } from './constants';
import {
  createIncidentSuccess,
  createIncidentError,
  getClassificationSuccess,
  getClassificationError,
  uploadRequest,
  uploadProgress,
  uploadSuccess,
  uploadFailure
} from './actions';
import { showGlobalError } from '../../../../containers/App/actions';

import mapControlsToParams from '../../services/map-controls-to-params';
import fileUploadChannel from '../../services/file-upload-channel';
import setClassification from '../../services/set-classification';

// import makeSelectIncidentContainer from './selectors';

export function* getClassification(action) {
  const requestURL = `${CONFIGURATION.API_ROOT}signals_mltool/predict`;

  try {
    const result = yield call(request, requestURL, {
      method: 'POST',
      body: JSON.stringify({
        text: action.payload.text
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

    if (action.payload.incident.image) {
      yield put(uploadRequest(action.payload.incident.image_file, result.id));
    }
    yield put(createIncidentSuccess(result));
  } catch (error) {
    yield put(createIncidentError());
    // yield put(showGlobalError('CREATE_INCIDENT_FAILED'));
    yield put(replace('/incident/fout'));
  }
}

export function* uploadFile(action) {
  const requestURL = `${CONFIGURATION.API_ROOT}signals/signal/image/`;

  const channel = yield call(fileUploadChannel, requestURL, action.payload.file, action.payload.id);
  const forever = true;
  while (forever) {
    const { progress = 0, error, success } = yield take(channel);
    if (error) {
      yield put(uploadFailure(action.payload.file, error));
      yield put(showGlobalError('UPLOAD_FAILED'));
      return;
    }
    if (success) {
      yield put(uploadSuccess(action.payload.file));
      return;
    }
    yield put(uploadProgress(action.payload.file, progress));
  }
}

function* uploadFileWrapper(action) {
  yield call(uploadFile, action);
}

// Individual exports for testing
export default function* watchIncidentContainerSaga() {
  yield all([
    takeLatest(GET_CLASSIFICATION, getClassification),
    takeLatest(CREATE_INCIDENT, createIncident),
    takeEvery(UPLOAD_REQUEST, uploadFileWrapper)
  ]);
}
