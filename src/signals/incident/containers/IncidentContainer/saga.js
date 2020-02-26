import { all, call, put, takeLatest } from 'redux-saga/effects';
import { replace } from 'connected-react-router/immutable';

import request from 'utils/request';
import { authPostCall, postCall } from 'shared/services/api/api';
import CONFIGURATION from 'shared/services/configuration/configuration';
import { uploadRequest, showGlobalNotification } from 'containers/App/actions';
import { VARIANT_ERROR } from 'containers/Notification/constants';
import resolveClassification from 'shared/services/resolveClassification';
import { CREATE_INCIDENT, GET_CLASSIFICATION, SET_PRIORITY } from './constants';
import {
  createIncidentSuccess,
  createIncidentError,
  getClassificationSuccess,
  getClassificationError,
  setPriority,
  setPrioritySuccess,
  setPriorityError,
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

    const postResult = yield call(
      postCall,
      CONFIGURATION.INCIDENT_ENDPOINT,
      mapControlsToParams(postData, action.payload.wizard)
    );

    const incident = { ...postResult, handling_message };

    if (
      action.payload.isAuthenticated &&
      action.payload.incident.priority.id !== 'normal'
    ) {
      yield put(
        setPriority({
          priority: action.payload.incident.priority.id,
          _signal: incident.id,
        })
      );
    }

    if (action.payload.incident.images) {
      yield all(
        action.payload.incident.images.map(image =>
          put(
            uploadRequest({
              file: image,
              id: incident.signal_id,
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

export function* setPriorityHandler(action) {
  try {
    const result = yield call(
      authPostCall,
      CONFIGURATION.PRIORITY_ENDPOINT,
      action.payload
    );
    yield put(setPrioritySuccess(result));
  } catch (error) {
    yield put(setPriorityError());
    yield put(
      showGlobalNotification({
        variant: VARIANT_ERROR,
        title: 'Het zetten van de urgentie van deze melding is niet gelukt',
      })
    );
  }
}

export default function* watchIncidentContainerSaga() {
  yield all([
    takeLatest(GET_CLASSIFICATION, getClassification),
    takeLatest(CREATE_INCIDENT, createIncident),
    takeLatest(SET_PRIORITY, setPriorityHandler),
  ]);
}
