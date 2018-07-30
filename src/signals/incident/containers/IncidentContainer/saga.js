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

export function* getClassification({ text }) {
  const requestURL = `${CONFIGURATION.API_ROOT}signals_mltool/predict`;

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

    yield put(getClassificationSuccess(setClassification(result)));
  } catch (error) {
    yield put(getClassificationError(setClassification()));
  }
}

export function* createIncident({ incident, wizard }) {
  const requestURL = `${CONFIGURATION.API_ROOT}signals/signal/`;

  try {
    const result = yield call(request, requestURL, {
      method: 'POST',
      body: JSON.stringify(mapControlsToParams(incident, wizard)),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (incident.image) {
      yield put(uploadRequest(incident.image_file, result.id));
    }
    yield put(createIncidentSuccess(result));
  } catch (error) {
    yield put(createIncidentError(error));
    // yield put(showGlobalError('CREATE_INCIDENT_FAILED'));
    yield put(replace('/incident/fout'));
  }
}

export function* uploadFile(file, id) {
  const requestURL = `${CONFIGURATION.API_ROOT}signals/signal/image/`;

  const channel = yield call(fileUploadChannel, requestURL, file, id);
  const forever = true;
  while (forever) {
    const { progress = 0, error, success } = yield take(channel);
    if (error) {
      yield put(uploadFailure(file, error));
      yield put(showGlobalError('UPLOAD_FAILED'));
      return;
    }
    if (success) {
      yield put(uploadSuccess(file));
      return;
    }
    yield put(uploadProgress(file, progress));
  }
}

function* uploadFileWrapper(action) {
  const file = action.payload;
  yield call(uploadFile, file, action.meta.id);
}

// Individual exports for testing
export default function* watchIncidentContainerSaga() {
  yield all([
    takeLatest(GET_CLASSIFICATION, getClassification),
    takeLatest(CREATE_INCIDENT, createIncident),
    takeEvery(UPLOAD_REQUEST, uploadFileWrapper)
  ]);
}
