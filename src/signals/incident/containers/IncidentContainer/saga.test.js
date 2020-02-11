import { select, takeLatest } from 'redux-saga/effects';
import { replace } from 'connected-react-router/immutable';
import { expectSaga, testSaga } from 'redux-saga-test-plan';
import * as matchers from 'redux-saga-test-plan/matchers';
import { throwError } from 'redux-saga-test-plan/providers';

import CONFIGURATION from 'shared/services/configuration/configuration';
import { authPostCall, postCall } from 'shared/services/api/api';
import categories from 'utils/__tests__/fixtures/categories.json';
import incident from 'utils/__tests__/fixtures/incident.json';
import priority from 'utils/__tests__/fixtures/priority.json';
import { showGlobalNotification } from 'containers/App/actions';
import { UPLOAD_REQUEST } from 'containers/App/constants';
import { VARIANT_ERROR } from 'containers/Notification/constants';
import mapControlsToParams from '../../services/map-controls-to-params';

import {
  GET_CLASSIFICATION_SUCCESS,
  GET_CLASSIFICATION_ERROR,
  CREATE_INCIDENT,
  GET_CLASSIFICATION,
  SET_PRIORITY,
} from './constants';
import watchIncidentContainerSaga, {
  retryFetchClassification,
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
import { makeSelectCategories } from '../../../../containers/App/selectors';

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

  describe('retryFetchClassification', () => {
    it('should return API response', () => {
      const text = 'Foo bar bazzzz';

      return expectSaga(retryFetchClassification, text, 100)
        .provide([[matchers.call.fn(postCall), predictionResponse]])
        .call(postCall, CONFIGURATION.PREDICTION_ENDPOINT, { text })
        .silentRun(250);
    });

    it('should retry', async () => {
      global.console.error = jest.fn();
      const text = 'Foo bar bazzzz';
      const error = new Error('whoops!!!1!');

      await expectSaga(retryFetchClassification, text, 100)
        .provide([
          [matchers.call.fn(postCall), throwError(error)],
          [matchers.call.fn(postCall), predictionResponse],
        ])
        .call(postCall, CONFIGURATION.PREDICTION_ENDPOINT, { text })
        .delay(100)
        .silentRun(150);

      global.console.error.mockRestore();
    });

    it('should throw', async () => {
      const text = 'Bar qux bazzzz';
      const error = new Error('Uhoh!!!1!');

      await expectSaga(retryFetchClassification, text, 100)
        .provide([
          [matchers.call.fn(postCall), throwError(error)],
          [matchers.call.fn(postCall), throwError(error)],
          [matchers.call.fn(postCall), predictionResponse],
        ])
        .call(postCall, CONFIGURATION.PREDICTION_ENDPOINT, { text })
        .delay(100)
        .call(postCall, CONFIGURATION.PREDICTION_ENDPOINT, { text })
        .delay(100)
        .call(postCall, CONFIGURATION.PREDICTION_ENDPOINT, { text })
        .delay(100)
        .throws('API request failed')
        .silentRun(350);
    });
  });

  describe('getClassification', () => {
    const payload = 'Grof vuil op straat';
    const action = { payload };

    it('should dispatch success', () =>
      expectSaga(getClassification, action)
        .provide([
          [select(makeSelectCategories), categories],
          [matchers.call.fn(postCall), predictionResponse],
        ])
        .call(retryFetchClassification, payload)
        .put.like({ action: { type: GET_CLASSIFICATION_SUCCESS } })
        .run());

    it('should dispatch error', () =>
      expectSaga(getClassification, action)
        .provide([
          [select(makeSelectCategories), categories],
          [matchers.call.fn(postCall), throwError(new Error('whoops!!!1!'))],
        ])
        .call(retryFetchClassification, payload)
        .call(postCall, CONFIGURATION.PREDICTION_ENDPOINT, { text: payload })
        .put.like({ action: { type: GET_CLASSIFICATION_ERROR } })
        .silentRun(3250)); // make sure it runs long enough for the postCall generator to throw
  });

  describe('createIncident', () => {
    const payload = {
      incident: {},
      wizard: {},
    };

    it('should dispatch success', () => {
      const action = { payload };

      return expectSaga(createIncident, action)
        .provide([[matchers.call.fn(postCall), incident]])
        .call.like({ fn: postCall })
        .put(createIncidentSuccess(incident))
        .run();
    });

    it('should success with file upload', () => {
      const action = {
        payload: {
          ...payload,
          incident: {
            images: [{ name: 'some-file' }, { name: 'some-other-file' }],
          },
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
        .put.like({ action: { type: UPLOAD_REQUEST } })
        .put.like({ action: { type: UPLOAD_REQUEST } })
        .put(createIncidentSuccess(incident))
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


    it('should success when logged in and setting low priority', () => {
      const priorityId = 'low';
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
      .put(showGlobalNotification({ variant: VARIANT_ERROR, title: 'Het zetten van de urgentie van deze melding is niet gelukt' }))
      .run());
});
