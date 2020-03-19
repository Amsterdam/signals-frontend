import { takeLatest } from 'redux-saga/effects';
import { replace } from 'connected-react-router/immutable';
import { expectSaga, testSaga } from 'redux-saga-test-plan';
import * as matchers from 'redux-saga-test-plan/matchers';
import { throwError } from 'redux-saga-test-plan/providers';

import request from 'utils/request';
import incidentJSON from 'utils/__tests__/fixtures/incident.json';
import postIncidentJSON from 'utils/__tests__/fixtures/postIncident.json';

import configuration from 'shared/services/configuration/configuration';
import resolveClassification from 'shared/services/resolveClassification';
import * as auth from 'shared/services/auth/auth';
import { authPostCall, postCall } from 'shared/services/api/api';

import { uploadFile } from 'containers/App/saga';

import mapControlsToParams from '../../services/map-controls-to-params';

import * as constants from './constants';
import watchIncidentContainerSaga, {
  getClassification,
  createIncident,
  postIncident as postIncidentSaga,
  getPostData,
} from './saga';
import { createIncidentSuccess, createIncidentError } from './actions';

jest.mock('shared/services/auth/auth', () => ({
  __esModule: true,
  ...jest.requireActual('shared/services/auth/auth'),
}));

// POST incident API response
const incident = JSON.stringify(incidentJSON);

// POST incident request body
const postIncident = JSON.stringify(postIncidentJSON);

const category = 'afval';
const subcategory = 'veeg-zwerfvuil';

const predictionResponse = {
  hoofdrubriek: [
    [`https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/${category}`],
    [0.810301985712628],
  ],
  subrubriek: [
    [`https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/afval/sub_categories/${subcategory}`],
    [0.5757328735244648],
  ],
};

const wizard = {
  label: 'foo bar',
  form: {
    controls: {},
  },
};

const payloadIncident = {
  text: 'Foo Baz',
  priority: {
    id: 'low',
  },
  type: {
    id: 'SIG',
  },
  category,
  subcategory,
};

const action = {
  type: 'CREATE_INCIDENT',
  payload: {
    incident: payloadIncident,
    wizard,
  },
};

const sub_category = predictionResponse.subrubriek[0][0];
const handling_message = 'zork';
const categoryResponse = {
  handling_message,
  _links: {
    self: { href: sub_category },
  },
};

describe('IncidentContainer saga', () => {
  it('should watchAppSaga', () => {
    testSaga(watchIncidentContainerSaga)
      .next()
      .all([
        takeLatest(constants.GET_CLASSIFICATION, getClassification),
        takeLatest(constants.CREATE_INCIDENT, createIncident),
      ]);
  });

  describe('getClassification', () => {
    const payload = 'Grof vuil op straat';

    it('should dispatch success', () =>
      expectSaga(getClassification, { payload })
        .provide([[matchers.call.fn(postCall), predictionResponse]])
        .call(resolveClassification, predictionResponse)
        .put.like({ action: { type: constants.GET_CLASSIFICATION_SUCCESS } })
        .run());

    it('should dispatch error', () => {
      const errorResponse = { foo: 'bar' };

      return expectSaga(getClassification, { payload })
        .provide([
          [matchers.call.fn(resolveClassification), errorResponse],
          [matchers.call.fn(postCall), throwError(new Error('whoops!!!1!'))],
        ])
        .call(postCall, configuration.PREDICTION_ENDPOINT, { text: payload })
        .call(resolveClassification)
        .put({ type: constants.GET_CLASSIFICATION_ERROR, payload: errorResponse })
        .run();
    });
  });

  describe('postIncident', () => {
    it('should perform postCall', () => {
      jest.spyOn(auth, 'isAuthenticated').mockImplementation(() => false);

      return expectSaga(postIncidentSaga, postIncident)
        .provide([[matchers.call.fn(postCall), incident]])
        .call(postCall, configuration.INCIDENT_PUBLIC_ENDPOINT, postIncident)
        .returns(incident)
        .run();
    });

    it('should perform authPostCall', () => {
      jest.spyOn(auth, 'isAuthenticated').mockImplementation(() => true);

      return expectSaga(postIncidentSaga, postIncident)
        .provide([[matchers.call.fn(authPostCall), incident]])
        .call(authPostCall, configuration.INCIDENT_PRIVATE_ENDPOINT, postIncident)
        .returns(incident)
        .run();
    });
  });

  describe('getPostData', () => {
    it('returns data for unauthenticated users', () => {
      jest.spyOn(auth, 'isAuthenticated').mockImplementation(() => false);

      const mapControlsToParamsResponse = {
        text: payloadIncident.text,
        category: payloadIncident.category,
        subcategory: payloadIncident.subcategory,
      };

      const postData = {
        text: payloadIncident.text,
        category: {
          sub_category,
        },
        subcategory: payloadIncident.subcategory,
        handling_message,
      };

      return expectSaga(getPostData, action)
        .provide([
          [matchers.call.fn(request), categoryResponse],
          [matchers.call.fn(mapControlsToParams), mapControlsToParamsResponse],
        ])
        .call(request, `${configuration.CATEGORIES_ENDPOINT}${category}/sub_categories/${subcategory}`)
        .call(mapControlsToParams, action.payload.incident, action.payload.wizard)
        .returns(postData)
        .run();
    });

    it('returns data for authenticated users', () => {
      jest.spyOn(auth, 'isAuthenticated').mockImplementation(() => true);

      const mapControlsToParamsResponse = {
        text: payloadIncident.text,
        priority: payloadIncident.priority.id,
        category: payloadIncident.category,
        subcategory: payloadIncident.subcategory,
      };

      const postData = {
        text: payloadIncident.text,
        category: {
          sub_category,
        },
        subcategory: payloadIncident.subcategory,
        handling_message,
        priority: {
          priority: payloadIncident.priority.id,
        },
        type: {
          code: payloadIncident.type.id,
        },
      };

      return expectSaga(getPostData, action)
        .provide([
          [matchers.call.fn(request), categoryResponse],
          [matchers.call.fn(mapControlsToParams), mapControlsToParamsResponse],
        ])
        .call(request, `${configuration.CATEGORIES_ENDPOINT}${category}/sub_categories/${subcategory}`)
        .call(mapControlsToParams, action.payload.incident, action.payload.wizard)
        .returns(postData)
        .run();
    });
  });

  describe('createIncident', () => {
    const postData = {
      text: payloadIncident.text,
      category: {
        sub_category,
      },
      subcategory: payloadIncident.subcategory,
    };

    it('should POST incident', () =>
      expectSaga(createIncident, action)
        .provide([
          [matchers.call.fn(getPostData), { handling_message, ...postData }],
          [matchers.call.fn(postIncidentSaga), incident],
        ])
        .call(getPostData, action)
        .call(postIncidentSaga, postData)
        .put(createIncidentSuccess({ handling_message, ...incident }))
        .run());

    it('should dispatch error', () =>
      expectSaga(createIncident, action)
        .provide([
          [matchers.call.fn(getPostData), { handling_message, ...postData }],
          [matchers.call.fn(postIncidentSaga), throwError(new Error('whoops!!!1!'))],
        ])
        .call(getPostData, action)
        .put(createIncidentError())
        .put(replace('/incident/fout'))
        .run());

    it('should run blocking file upload calls', () => {
      const actionWithFiles = {
        ...action,
      };

      const image1 = {
        name: 'foobarbaz.jpg',
        lastModified: 1579597089586,
        size: 4718960,
        type: 'image/jpeg',
      };

      const image2 = {
        name: 'omgwtfbbq.jpg',
        lastModified: 1579597057799,
        size: 2886977,
        type: 'image/jpeg',
      };

      actionWithFiles.payload.incident.images = [image1, image2];

      return expectSaga(createIncident, action)
        .provide([
          [matchers.call.fn(getPostData), { handling_message, ...postData }],
          [matchers.call.fn(postIncidentSaga), incident],
        ])
        .call(getPostData, action)
        .call(postIncidentSaga, postData)
        .call(uploadFile, { payload: { file: image1, id: incident.signal_id } })
        .call(uploadFile, { payload: { file: image2, id: incident.signal_id } })
        .run();
    });
  });
});
