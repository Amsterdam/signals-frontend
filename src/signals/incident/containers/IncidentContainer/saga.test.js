import { takeLatest } from 'redux-saga/effects';
import { replace } from 'connected-react-router/immutable';
import { expectSaga, testSaga } from 'redux-saga-test-plan';
import * as matchers from 'redux-saga-test-plan/matchers';
import { throwError } from 'redux-saga-test-plan/providers';

import request from 'utils/request';
import CONFIGURATION from 'shared/services/configuration/configuration';
import { authPostCall, postCall } from 'shared/services/api/api';
import incident from 'utils/__tests__/fixtures/incident.json';
import priority from 'utils/__tests__/fixtures/priority.json';
import { showGlobalNotification } from 'containers/App/actions';
import { UPLOAD_REQUEST } from 'containers/App/constants';
import { VARIANT_ERROR } from 'containers/Notification/constants';
import mapControlsToParams from '../../services/map-controls-to-params';
import resolveClassification from '../../services/resolveClassification';

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

    it('should dispatch error', () =>
      expectSaga(getClassification, action)
        .provide([
          [matchers.call.fn(postCall), throwError(new Error('whoops!!!1!'))],
        ])
        .call(postCall, CONFIGURATION.PREDICTION_ENDPOINT, { text: payload })
        .put({ type: GET_CLASSIFICATION_ERROR })
        .run(3250)); // make sure it runs long enough for the postCall generator to throw
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
    const subCatResponse = {
      handling_message: 'Here be a message',
      _links: {
        self: { href: 'https://this-is-a-url' },
      },
    };
    const postIncident = {
      ...incident,
      category: {
        sub_category: subCatResponse._links.self.href,
      },
    };

    it('should dispatch success', () => {
      const action = { payload };

      return expectSaga(createIncident, action)
        .provide([
          [matchers.call.fn(request), subCatResponse],
          [matchers.call.fn(postCall), postIncident],
        ])
        .call(
          request,
          `${CONFIGURATION.CATEGORIES_ENDPOINT}${category}/sub_categories/${subcategory}`
        )
        .call(
          postCall,
          CONFIGURATION.INCIDENT_ENDPOINT,
          mapControlsToParams(
            {
              ...postIncident,
              handling_message: subCatResponse.handling_message,
            },
            action.payload.wizard
          )
        )
        .put(createIncidentSuccess(postIncident))
        .run();
    });

    it.only('should success with file upload', () => {
      const action = {
        payload: {
          ...payload,
          incident: {
            ...incident,
            images: [{ name: 'some-file' }, { name: 'some-other-file' }],
          },
          wizard: {},
        },
      };

      console.log(action.payload.incident);

      return expectSaga(createIncident, action)
        .provide([
          [matchers.call.fn(request), subCatResponse],
          [matchers.call.fn(postCall), postIncident],
        ])
        .call(
          request,
          `${CONFIGURATION.CATEGORIES_ENDPOINT}${category}/sub_categories/${subcategory}`
        )
        .call(
          postCall,
          CONFIGURATION.INCIDENT_ENDPOINT,
          mapControlsToParams(
            {
              ...action.payload.incident,
              handling_message: subCatResponse.handling_message,
            },
            action.payload.wizard
          )
        )
        .put.like({ action: { type: UPLOAD_REQUEST } })
        .put.like({ action: { type: UPLOAD_REQUEST } })
        .put(createIncidentSuccess(postIncident))
        .run();
    });

    it('should success when logged in and setting normal priority', () => {
      const priorityId = 'normal';
      const action = {
        payload: {
          ...payload,
          isAuthenticated: true,
          incident: { priority: { id: priorityId } },
          wizard: {},
        },
      };

      return expectSaga(createIncident, action)
        .provide([[matchers.call.fn(postCall), incident]])
        .call(
          postCall,
          CONFIGURATION.INCIDENT_ENDPOINT,
          mapControlsToParams(action.payload.incident, action.payload.wizard)
        )
        .not.put(setPriority({ priority: priorityId, _signal: incident.id }))
        .put(createIncidentSuccess(incident))
        .run();
    });

    it('should success when logged in and setting high priority', () => {
      const priorityId = 'high';
      const action = {
        payload: {
          ...payload,
          isAuthenticated: true,
          incident: { priority: { id: priorityId } },
        },
      };

      return expectSaga(createIncident, action)
        .provide([[matchers.call.fn(postCall), incident]])
        .call.like({ fn: postCall })
        .put(setPriority({ priority: priorityId, _signal: incident.id }))
        .put(createIncidentSuccess(incident))
        .run();
    });

    it('should dispatch error', () => {
      const action = { payload };

      return expectSaga(createIncident, action)
        .provide([
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
