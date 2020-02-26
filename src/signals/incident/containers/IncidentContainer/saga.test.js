import { takeLatest } from 'redux-saga/effects';
import { replace } from 'connected-react-router/immutable';
import { expectSaga, testSaga } from 'redux-saga-test-plan';
import * as matchers from 'redux-saga-test-plan/matchers';
import { throwError } from 'redux-saga-test-plan/providers';

import request from 'utils/request';
import CONFIGURATION from 'shared/services/configuration/configuration';
import { authPostCall, postCall } from 'shared/services/api/api';
import incident from 'utils/__tests__/fixtures/incident.json';
import postIncident from 'utils/__tests__/fixtures/postIncident.json';
import priority from 'utils/__tests__/fixtures/priority.json';
import { showGlobalNotification } from 'containers/App/actions';
import { UPLOAD_REQUEST } from 'containers/App/constants';
import { VARIANT_ERROR } from 'containers/Notification/constants';
import resolveClassification from 'shared/services/resolveClassification';
import mapControlsToParams from '../../services/map-controls-to-params';

import {
  GET_CLASSIFICATION_SUCCESS,
  GET_CLASSIFICATION_ERROR,
  CREATE_INCIDENT,
  GET_CLASSIFICATION,
  SET_PRIORITY,
} from './constants';
import watchIncidentContainerSaga, {
  getClassification,
  createIncident,
  setPriorityHandler,
} from './saga';
import {
  createIncidentSuccess,
  createIncidentError,
  setPriority,
  setPriorityError,
  setPrioritySuccess,
} from './actions';

describe('IncidentContainer saga', () => {
  const predictionResponse = {
    hoofdrubriek: [
      [
        'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/afval',
      ],
      [0.810301985712628],
    ],
    subrubriek: [
      [
        'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/afval/sub_categories/veeg-zwerfvuil',
      ],
      [0.5757328735244648],
    ],
  };
  it('should watchAppSaga', () => {
    testSaga(watchIncidentContainerSaga)
      .next()
      .all([
        takeLatest(GET_CLASSIFICATION, getClassification),
        takeLatest(CREATE_INCIDENT, createIncident),
        takeLatest(SET_PRIORITY, setPriorityHandler),
      ]);
  });

  describe('getClassification', () => {
    const payload = 'Grof vuil op straat';
    const action = { payload };

    it('should dispatch success', () =>
      expectSaga(getClassification, action)
        .provide([[matchers.call.fn(postCall), predictionResponse]])
        .call(resolveClassification, predictionResponse)
        .put.like({ action: { type: GET_CLASSIFICATION_SUCCESS } })
        .run());

    it('should dispatch error', () => {
      const errorResponse = { foo: 'bar' };

      return expectSaga(getClassification, action)
        .provide([
          [matchers.call.fn(resolveClassification), errorResponse],
          [matchers.call.fn(postCall), throwError(new Error('whoops!!!1!'))],
        ])
        .call(postCall, CONFIGURATION.PREDICTION_ENDPOINT, { text: payload })
        .call(resolveClassification)
        .put({ type: GET_CLASSIFICATION_ERROR, payload: errorResponse })
        .run();
    });
  });

  describe('createIncident', () => {
    const category = 'afval';
    const subcategory = 'some-afval-subcategory';
    const payload = {
      incident: {
        category,
        subcategory,
      },
      wizard: {},
    };
    const handling_message = 'Here be a message';
    const subCatResponse = {
      handling_message,
      _links: {
        self: { href: 'https://this-is-a-url' },
      },
    };
    const incidentWithHandlingMessage = { ...incident, handling_message };

    it('should dispatch success', () => {
      const action = { payload };

      return expectSaga(createIncident, action)
        .provide([
          [matchers.call.fn(request), subCatResponse],
          [matchers.call.fn(postCall), incident],
        ])
        .call(
          request,
          `${CONFIGURATION.CATEGORIES_ENDPOINT}${category}/sub_categories/${subcategory}`
        )
        .call(
          postCall,
          CONFIGURATION.INCIDENT_ENDPOINT,
          mapControlsToParams(postIncident, action.payload.wizard)
        )
        .put(createIncidentSuccess(incidentWithHandlingMessage))
        .run();
    });

    it('should success with file upload', () => {
      const action = {
        payload: {
          incident: {
            ...postIncident,
            images: [{ name: 'some-file' }, { name: 'some-other-file' }],
            category,
            subcategory,
          },
          wizard: {},
        },
      };

      return expectSaga(createIncident, action)
        .provide([
          [matchers.call.fn(request), subCatResponse],
          [matchers.call.fn(postCall), incident],
        ])
        .call(
          request,
          `${CONFIGURATION.CATEGORIES_ENDPOINT}${category}/sub_categories/${subcategory}`
        )
        .call(
          postCall,
          CONFIGURATION.INCIDENT_ENDPOINT,
          mapControlsToParams(action.payload.incident, action.payload.wizard)
        )
        .put.like({ action: { type: UPLOAD_REQUEST } })
        .put.like({ action: { type: UPLOAD_REQUEST } })
        .put(createIncidentSuccess(incidentWithHandlingMessage))
        .run();
    });

    it('should success when logged in and setting normal priority', () => {
      const priorityId = 'normal';
      const action = {
        payload: {
          isAuthenticated: true,
          incident: { priority: { id: priorityId }, category, subcategory },
          wizard: {},
        },
      };

      return expectSaga(createIncident, action)
        .provide([
          [matchers.call.fn(request), subCatResponse],
          [matchers.call.fn(postCall), incident],
        ])
        .call(
          request,
          `${CONFIGURATION.CATEGORIES_ENDPOINT}${category}/sub_categories/${subcategory}`
        )
        .call(
          postCall,
          CONFIGURATION.INCIDENT_ENDPOINT,
          mapControlsToParams(postIncident, action.payload.wizard)
        )
        .not.put(setPriority({ priority: priorityId, _signal: incident.id }))
        .put(createIncidentSuccess(incidentWithHandlingMessage))
        .run();
    });

    it('should success when logged in and setting high priority', () => {
      const priorityId = 'high';
      const action = {
        payload: {
          ...payload,
          isAuthenticated: true,
          incident: { priority: { id: priorityId }, category, subcategory },
        },
      };

      return expectSaga(createIncident, action)
        .provide([
          [matchers.call.fn(request), subCatResponse],
          [matchers.call.fn(postCall), incident],
        ])
        .call(
          request,
          `${CONFIGURATION.CATEGORIES_ENDPOINT}${category}/sub_categories/${subcategory}`
        )
        .call(
          postCall,
          CONFIGURATION.INCIDENT_ENDPOINT,
          mapControlsToParams(postIncident, action.payload.wizard)
        )
        .put(setPriority({ priority: priorityId, _signal: incident.id }))
        .put(createIncidentSuccess(incidentWithHandlingMessage))
        .run();
    });

    it('should success when logged in and setting low priority', () => {
      const priorityId = 'low';
      const action = {
        payload: {
          ...payload,
          isAuthenticated: true,
          incident: { priority: { id: priorityId }, category, subcategory },
        },
      };

      return expectSaga(createIncident, action)
        .provide([
          [matchers.call.fn(request), subCatResponse],
          [matchers.call.fn(postCall), incident],
        ])
        .call(
          request,
          `${CONFIGURATION.CATEGORIES_ENDPOINT}${category}/sub_categories/${subcategory}`
        )
        .call(
          postCall,
          CONFIGURATION.INCIDENT_ENDPOINT,
          mapControlsToParams(postIncident, action.payload.wizard)
        )
        .put(setPriority({ priority: priorityId, _signal: incident.id }))
        .put(createIncidentSuccess(incidentWithHandlingMessage))
        .run();
    });

    it('should dispatch error', () => {
      const action = { payload };

      return expectSaga(createIncident, action)
        .provide([
          [matchers.call.fn(request), subCatResponse],
          [matchers.call.fn(postCall), throwError(new Error('whoops!!!1!'))],
        ])
        .call.like({ fn: postCall })
        .put(createIncidentError())
        .put(replace('/incident/fout'))
        .run();
    });
  });
});

describe('setPriorityHandler', () => {
  const payload = { priority: { id: 'normal', label: 'Normaal' } };
  const action = { payload };

  it('should dispatch success', () =>
    expectSaga(setPriorityHandler, action)
      .provide([[matchers.call.fn(authPostCall), priority]])
      .call(authPostCall, CONFIGURATION.PRIORITY_ENDPOINT, payload)
      .put(setPrioritySuccess(priority))
      .run());

  it('should dispatch error', () =>
    expectSaga(setPriorityHandler, action)
      .provide([
        [
          matchers.call.fn(authPostCall),
          throwError(new Error('Nope. Not possible')),
        ],
      ])
      .call(authPostCall, CONFIGURATION.PRIORITY_ENDPOINT, payload)
      .put(setPriorityError())
      .put(
        showGlobalNotification({
          variant: VARIANT_ERROR,
          title: 'Het zetten van de urgentie van deze melding is niet gelukt',
        })
      )
      .run());
});
