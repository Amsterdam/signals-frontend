import { all, call, put, take, /* select, */ takeLatest, takeEvery } from 'redux-saga/effects';
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
import mapControlsToParams from '../../services/map-controls-to-params';
import createFileUploadChannel from './createFileUploadChannel';

// import makeSelectIncidentContainer from './selectors';

const getCategory = (clasificationResult) => {
  const minimumSubcategoryChance = 0.40;
  const overig = 'Overig';

  return (minimumSubcategoryChance < clasificationResult.subrubriek && clasificationResult.subrubriek[0][0]) ? {
    category: clasificationResult.hoofdrubriek[0][0],
    categoryChance: clasificationResult.hoofdrubriek[1][0],
    subcategory: clasificationResult.subrubriek[0][0],
    subcategoryChance: clasificationResult.subrubriek[1][0]

  } : {
    category: overig,
    categoryChance: 0,
    subcategory: overig,
    subcategoryChance: 0

  };
};

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

    yield put(getClassificationSuccess(getCategory(result)));
  } catch (err) {
    yield put(getClassificationError(err));
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
  } catch (err) {
    yield put(createIncidentError(err));
  }
}

export function* uploadFile(file, id) {
  const requestURL = `${CONFIGURATION.API_ROOT}signals/signal/image/`;

  const channel = yield call(createFileUploadChannel, requestURL, file, id);
  const { progress = 0, err, success } = yield take(channel);
  if (err) {
    yield put(uploadFailure(file, err));
    return;
  }
  if (success) {
    yield put(uploadSuccess(file));
    return;
  }
  yield put(uploadProgress(file, progress));
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
