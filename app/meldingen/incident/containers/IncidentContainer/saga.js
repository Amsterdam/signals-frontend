import { call, put, /* select, */ takeLatest } from 'redux-saga/effects';
import request from 'utils/request';

import { CREATE_INCIDENT, GET_CLASSIFICATION } from './constants';
import {
  createIncidentSuccess,
  createIncidentError,
  getClassificationSuccess,
  getClassificationError
} from './actions';
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

export function* createIncident({ incident }) {
  console.log('saga createIncident', incident);
  const requestURL = 'https://acc.api.data.amsterdam.nl/signals/signal/';

  const payload = {
    text: incident.description,
    incident_date_start: '2018-07-03T13:49:38.737Z',
    category: {
      main: incident.category,
      sub: incident.subcategory
    },
    location: {
      address: incident.location.address,
      geometrie: {
        type: 'Point',
        coordinates: [
          incident.location.lat,
          incident.location.lng
        ]
      }
    },
    reporter: {
      email: incident.email,
      phone: incident.phone
    }
  };

  console.log('saga sends', payload);

  try {
    const result = yield call(request, requestURL, {
      method: 'POST',
      body: JSON.stringify(payload),
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

/*
{
  "source": "string",
  "text": "string",
  "text_extra": "string",
  "status": {
    "text": "string",
    "user": "user@example.com",
    "target_api": "string",
    "state": "m",
    "extern": true,
    "extra_properties": "string"
  },
  "location": {
    "stadsdeel": "A",
    "buurt_code": "string",
    "address": "string",
    "geometrie": "string",
    "extra_properties": "string"
  },
  "category": {
    "main": "string",
    "sub": "string",
    "department": "string",
    "priority": 0
  },
  "reporter": {
    "email": "user@example.com",
    "phone": "string",
    "remove_at": "2018-07-03T13:49:38.737Z",
    "extra_properties": "string"
  },
  "created_at": "2018-07-03T13:49:38.737Z",
  "updated_at": "2018-07-03T13:49:38.737Z",
  "incident_date_start": "2018-07-03T13:49:38.737Z",
  "incident_date_end": "2018-07-03T13:49:38.737Z",
  "operational_date": "2018-07-03T13:49:38.737Z"
}
*/
