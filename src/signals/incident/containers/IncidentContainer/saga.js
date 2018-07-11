import { call, put, take, /* select, */ takeLatest } from 'redux-saga/effects';
import request from 'utils/request';

import CONFIGURATION from '../../../../shared/services/configuration/configuration';
import { CREATE_INCIDENT, GET_CLASSIFICATION } from './constants';
import {
  createIncidentSuccess,
  createIncidentError,
  getClassificationSuccess,
  getClassificationError
  // uploadProgress,
  // uploadSuccess,
  // uploadFailure
} from './actions';
import mapControlsToParams from '../../services/map-controls-to-params';
import createFileUploadChannel from './createFileUploadChannel';

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
  const requestURL = `${CONFIGURATION.API_ROOT}signals/signal/`;
  const imageURL = `${CONFIGURATION.API_ROOT}signals/signal/image/`;

  try {
    const result = yield call(request, requestURL, {
      method: 'POST',
      body: JSON.stringify(mapControlsToParams(incident, wizard)),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (incident.image) {
      console.log('UPLOAD incident.image_file', result.id, incident.image_file);

      const channel = yield call(createFileUploadChannel, imageURL, incident.image_file, result.id);
      //
      const { progress = 0, err, success, ...rest } = yield take(channel);
      // if (err) {
        // yield put(uploadFailure(incident.image_file, err));
        // return;
      // }
      // if (success) {
        // yield put(uploadSuccess(incident.image_file));
          // return;
      // }
      // yield put(uploadProgress(incident.image_file, progress));
      //

      console.log('UPLOAD FINISHED', progress, err, success, rest);
    }
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
