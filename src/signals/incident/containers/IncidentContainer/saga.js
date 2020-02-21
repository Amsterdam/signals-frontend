import { all, call, put, takeLatest } from 'redux-saga/effects';
import { replace } from 'connected-react-router/immutable';

import request from 'utils/request';
import { authPostCall, postCall } from 'shared/services/api/api';
import CONFIGURATION from 'shared/services/configuration/configuration';
import { uploadRequest } from 'containers/App/actions';
// import { VARIANT_ERROR } from 'containers/Notification/constants';
import resolveClassification from 'shared/services/resolveClassification';
import { CREATE_INCIDENT, GET_CLASSIFICATION } from './constants';
import {
  createIncidentSuccess,
  createIncidentError,
  getClassificationSuccess,
  getClassificationError,
} from './actions';
import mapControlsToParams from '../../services/map-controls-to-params';

export function* getClassification(action) {
  try {
    const result = yield call(postCall, CONFIGURATION.PREDICTION_ENDPOINT, {
      text: action.payload,
    });

    const classification = yield call(resolveClassification, result);

    yield put(getClassificationSuccess(classification));
  } catch (error) {
    const classification = yield call(resolveClassification);

    yield put(getClassificationError(classification));
  }
}

export function* createIncident(action) {
  try {
    const { category, subcategory } = action.payload.incident;

    const {
      handling_message,
      _links: {
        self: { href: sub_category },
      },
    } = yield call(
      request,
      `${CONFIGURATION.CATEGORIES_ENDPOINT}${category}/sub_categories/${subcategory}`
    );

    const postData = {
      ...action.payload.incident,
      handling_message,
      category: {
        sub_category,
      },
    };

    let postResult;
    if (action.payload.isAuthenticated) {
      postResult = yield call(
        authPostCall,
        CONFIGURATION.INCIDENT_PRIVATE_ENDPOINT,
        mapControlsToParams(postData, action.payload.wizard)
      );
    } else {
      postResult = yield call(
        postCall,
        CONFIGURATION.INCIDENT_PUBLIC_ENDPOINT,
        mapControlsToParams(postData, action.payload.wizard)
      );
    }

    const incident = { ...postResult, handling_message };

    if (action.payload.incident.images) {
      yield all(
        action.payload.incident.images.map(image =>
          put(
            uploadRequest({
              file: image,
              id: action.payload.isAuthenticated ? incident.id : incident.signal_id,
              isAuthenticated: action.payload.isAuthenticated,
            })
          )
        )
      );
    }

    yield put(createIncidentSuccess(incident));
  } catch (error) {
    yield put(createIncidentError());
    yield put(replace('/incident/fout'));
  }
}

export default function* watchIncidentContainerSaga() {
  yield all([
    takeLatest(GET_CLASSIFICATION, getClassification),
    takeLatest(CREATE_INCIDENT, createIncident),
  ]);
}
