// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2021 Gemeente Amsterdam
import { takeLatest, select } from 'redux-saga/effects'
import { replace } from 'connected-react-router/immutable'
import { expectSaga, testSaga } from 'redux-saga-test-plan'
import * as matchers from 'redux-saga-test-plan/matchers'
import { throwError } from 'redux-saga-test-plan/providers'

import request from 'utils/request'
import incidentJSON from 'utils/__tests__/fixtures/incident.json'
import postIncidentJSON from 'utils/__tests__/fixtures/postIncident.json'

import configuration from 'shared/services/configuration/configuration'
import * as auth from 'shared/services/auth/auth'
import { authPostCall, postCall } from 'shared/services/api/api'

import { uploadFile } from 'containers/App/saga'

import { subCategories } from 'utils/__tests__/fixtures'

import * as mapControlsToParams from '../../services/map-controls-to-params'

import * as constants from './constants'
import watchIncidentContainerSaga, {
  getClassification,
  getQuestionsSaga,
  createIncident,
  postIncident as postIncidentSaga,
  getPostData,
} from './saga'
import { resolveQuestions } from './services'
import { createIncidentSuccess, createIncidentError } from './actions'
import { getClassificationData, makeSelectIncidentContainer } from './selectors'

jest.mock('shared/services/auth/auth', () => ({
  __esModule: true,
  ...jest.requireActual('shared/services/auth/auth'),
}))

jest.mock('shared/services/configuration/configuration')

// POST incident API response
const incident = JSON.stringify(incidentJSON)

// POST incident request body
const postIncident = JSON.stringify(postIncidentJSON)

const category = 'afval'
const subcategory = 'asbest-accu'
export const mockCategoryData = subCategories.find(
  (s) => s.slug === subcategory
)

const predictionResponse = {
  hoofdrubriek: [
    [
      `https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/${category}`,
    ],
    [0.810301985712628],
  ],
  subrubriek: [
    [
      `https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/afval/sub_categories/${subcategory}`,
    ],
    [0.5757328735244648],
  ],
}

const resolvedPrediction = {
  category,
  subcategory,
}

const questionsUrl = `${configuration.QUESTIONS_ENDPOINT}?main_slug=${category}&sub_slug=${subcategory}`

const questionsResponse = [
  {
    key: 'key1',
    meta: 'meta1',
    options: 'options1',
    field_type: 'field_type1',
  },
  {
    key: 'key2',
    meta: 'meta2',
    options: 'options2',
    field_type: 'field_type2',
  },
]

const resolvedQuestions = {
  key1: {
    meta: 'meta1',
    options: 'options1',
    render: 'field_type1',
  },
  key2: {
    meta: 'meta2',
    options: 'options2',
    render: 'field_type2',
  },
}

const wizard = {
  label: 'foo bar',
  form: {
    controls: {},
  },
}

const { handling_message, classification } = getClassificationData(
  category,
  subcategory,
  mockCategoryData
)

const payloadIncident = {
  text: 'Foo Baz',
  priority: {
    id: 'low',
  },
  type: {
    id: 'SIG',
  },
  handling_message,
  category,
  subcategory,
  classification,
}

const action = {
  type: 'CREATE_INCIDENT',
  payload: {
    incident: payloadIncident,
    wizard,
  },
}

const categoryResponse = {
  ...mockCategoryData,
}

describe('IncidentContainer saga', () => {
  afterEach(() => {
    configuration.__reset()
  })

  it('should watchAppSaga', () => {
    testSaga(watchIncidentContainerSaga)
      .next()
      .all([
        takeLatest(constants.GET_CLASSIFICATION, getClassification),
        takeLatest(
          [constants.GET_CLASSIFICATION_SUCCESS, constants.UPDATE_INCIDENT],
          getQuestionsSaga
        ),
        takeLatest(constants.CREATE_INCIDENT, createIncident),
      ])
  })

  describe('getClassification', () => {
    const payload = 'Grof vuil op straat'

    it('should dispatch success without fetching questions', () =>
      expectSaga(getClassification, { payload })
        .provide([
          [matchers.call.fn(request), categoryResponse],
          [matchers.call.fn(postCall), predictionResponse],
        ])
        .call(
          request,
          `${configuration.CATEGORIES_ENDPOINT}${category}/sub_categories/${subcategory}`
        )
        .put.actionType(constants.GET_CLASSIFICATION_SUCCESS)
        .run())

    it('should dispatch error', () => {
      const errorResponse = {
        category: 'overig',
        subcategory: 'overig',
        handling_message,
        classification,
      }

      return expectSaga(getClassification, { payload })
        .provide([
          [matchers.call.fn(postCall), throwError(new Error('whoops!!!1!'))],
          [matchers.call.fn(request), categoryResponse],
        ])
        .call(postCall, configuration.PREDICTION_ENDPOINT, { text: payload })
        .call(
          request,
          `${configuration.CATEGORIES_ENDPOINT}overig/sub_categories/overig`
        )
        .put({
          type: constants.GET_CLASSIFICATION_ERROR,
          payload: errorResponse,
        })
        .run()
    })
  })

  describe('getQuestionsSaga', () => {
    const payload = resolvedPrediction

    it('should do nothing when fetchQuestionsFromBackend disabled', () =>
      expectSaga(getQuestionsSaga, { type: constants.UPDATE_INCIDENT, payload })
        .not.put.actionType(constants.GET_QUESTIONS_SUCCESS)
        .run())

    it('should dispatch success on UPDATE_INCIDENT', () => {
      configuration.featureFlags.fetchQuestionsFromBackend = true

      return expectSaga(getQuestionsSaga, {
        type: constants.UPDATE_INCIDENT,
        payload,
      })
        .provide([
          [select(makeSelectIncidentContainer), {}],
          [matchers.call.fn(request), { results: questionsResponse }],
          [matchers.call.fn(resolveQuestions), resolvedQuestions],
        ])
        .select(makeSelectIncidentContainer)
        .call(request, questionsUrl)
        .call(resolveQuestions, questionsResponse)
        .put({
          type: constants.GET_QUESTIONS_SUCCESS,
          payload: { questions: resolvedQuestions },
        })
        .run()
    })

    it('should dispatch error', () => {
      configuration.featureFlags.fetchQuestionsFromBackend = true

      return expectSaga(getQuestionsSaga, {
        type: constants.UPDATE_INCIDENT,
        payload,
      })
        .provide([
          [select(makeSelectIncidentContainer), {}],
          [matchers.call.fn(request), throwError(new Error('whoops!!!1!'))],
        ])
        .call(request, questionsUrl)
        .put.actionType(constants.GET_QUESTIONS_ERROR)
        .run()
    })

    describe('GET_CLASSIFICATION_SUCCESS', () => {
      it('should do nothing when fetchQuestionsFromBackend disabled', () =>
        expectSaga(getQuestionsSaga, {
          type: constants.GET_CLASSIFICATION_SUCCESS,
          payload,
        })
          .not.put.actionType(constants.GET_QUESTIONS_SUCCESS)
          .run())

      it('should do nothing when category is falsy', () => {
        configuration.featureFlags.fetchQuestionsFromBackend = true
        return expectSaga(getQuestionsSaga, {
          type: constants.GET_CLASSIFICATION_SUCCESS,
          payload: { subcategory: 'subcategory' },
        })
          .not.put.actionType(constants.GET_QUESTIONS_SUCCESS)
          .run()
      })

      it('should do nothing when subcategory is falsy', () => {
        configuration.featureFlags.fetchQuestionsFromBackend = true
        return expectSaga(getQuestionsSaga, {
          type: constants.GET_CLASSIFICATION_SUCCESS,
          payload: { category: 'category' },
        })
          .not.put.actionType(constants.GET_QUESTIONS_SUCCESS)
          .run()
      })

      it('should dispatch success without classification prediction', () => {
        configuration.featureFlags.fetchQuestionsFromBackend = true

        return expectSaga(getQuestionsSaga, {
          type: constants.GET_CLASSIFICATION_SUCCESS,
          payload,
        })
          .provide([
            [
              select(makeSelectIncidentContainer),
              {
                classificationPrediction: null,
                incident: { classification: { slug: 'slug' } },
              },
            ],
            [matchers.call.fn(request), { results: questionsResponse }],
            [matchers.call.fn(resolveQuestions), resolvedQuestions],
          ])
          .call(request, questionsUrl)
          .call(resolveQuestions, questionsResponse)
          .put({
            type: constants.GET_QUESTIONS_SUCCESS,
            payload: { questions: resolvedQuestions },
          })
          .run()
      })

      it('should dispatch success without incident classification', () => {
        configuration.featureFlags.fetchQuestionsFromBackend = true

        return expectSaga(getQuestionsSaga, {
          type: constants.GET_CLASSIFICATION_SUCCESS,
          payload,
        })
          .provide([
            [
              select(makeSelectIncidentContainer),
              {
                classificationPrediction: { slug: 'slug' },
                incident: { classification: null },
              },
            ],
            [matchers.call.fn(request), { results: questionsResponse }],
            [matchers.call.fn(resolveQuestions), resolvedQuestions],
          ])
          .call(request, questionsUrl)
          .call(resolveQuestions, questionsResponse)
          .put({
            type: constants.GET_QUESTIONS_SUCCESS,
            payload: { questions: resolvedQuestions },
          })
          .run()
      })

      it('should dispatch success with matching classification prediction and incident classification', () => {
        configuration.featureFlags.fetchQuestionsFromBackend = true

        return expectSaga(getQuestionsSaga, {
          type: constants.GET_CLASSIFICATION_SUCCESS,
          payload,
        })
          .provide([
            [
              select(makeSelectIncidentContainer),
              {
                classificationPrediction: { slug: 'slug' },
                incident: { classification: { slug: 'slug' } },
              },
            ],
            [matchers.call.fn(request), { results: questionsResponse }],
            [matchers.call.fn(resolveQuestions), resolvedQuestions],
          ])
          .call(request, questionsUrl)
          .call(resolveQuestions, questionsResponse)
          .put({
            type: constants.GET_QUESTIONS_SUCCESS,
            payload: { questions: resolvedQuestions },
          })
          .run()
      })

      it('should dispatch error', () => {
        configuration.featureFlags.fetchQuestionsFromBackend = true

        return expectSaga(getQuestionsSaga, {
          type: constants.GET_CLASSIFICATION_SUCCESS,
          payload,
        })
          .provide([
            [
              select(makeSelectIncidentContainer),
              {
                classificationPrediction: null,
                incident: { classification: null },
              },
            ],
            [matchers.call.fn(request), throwError(new Error('whoops!!!1!'))],
          ])
          .call(request, questionsUrl)
          .put.actionType(constants.GET_QUESTIONS_ERROR)
          .run()
      })
    })
  })

  describe('postIncident', () => {
    it('should perform postCall', () => {
      jest.spyOn(auth, 'isAuthenticated').mockImplementation(() => false)

      return expectSaga(postIncidentSaga, postIncident)
        .provide([[matchers.call.fn(postCall), incident]])
        .call(postCall, configuration.INCIDENT_PUBLIC_ENDPOINT, postIncident)
        .returns(incident)
        .run()
    })

    it('should perform authPostCall', () => {
      jest.spyOn(auth, 'isAuthenticated').mockImplementation(() => true)

      return expectSaga(postIncidentSaga, postIncident)
        .provide([[matchers.call.fn(authPostCall), incident]])
        .call(
          authPostCall,
          configuration.INCIDENT_PRIVATE_ENDPOINT,
          postIncident
        )
        .returns(incident)
        .run()
    })
  })

  describe('getPostData', () => {
    it('returns data that is valid', () => {
      jest.spyOn(auth, 'isAuthenticated').mockImplementation(() => false)

      const description = 'description'
      const datetime = 'datetime'

      const invalidPostData = { ...payloadIncident, description, datetime }
      const invalidAction = {
        ...action,
        payload: { ...action.payload, incident: invalidPostData },
      }

      const postData = {
        text: payloadIncident.text,
        handling_message,
        category: { sub_category: payloadIncident.classification.id },
        reporter: {
          sharing_allowed: false,
        },
      }

      return expectSaga(getPostData, invalidAction).returns(postData).run(false)
    })

    it('returns data for unauthenticated users', () => {
      jest.spyOn(auth, 'isAuthenticated').mockImplementation(() => false)

      const postData = {
        text: payloadIncident.text,
        handling_message,
        category: { sub_category: payloadIncident.classification.id },
        reporter: {
          sharing_allowed: false,
        },
      }

      return expectSaga(getPostData, action).returns(postData).run()
    })

    it('returns data for authenticated users', () => {
      jest.spyOn(auth, 'isAuthenticated').mockImplementation(() => true)

      const postData = {
        text: payloadIncident.text,
        handling_message,
        category: { sub_category: payloadIncident.classification.id },
        priority: {
          priority: payloadIncident.priority.id,
        },
        type: {
          code: payloadIncident.type.id,
        },
        reporter: {
          sharing_allowed: false,
        },
      }

      return expectSaga(getPostData, action).returns(postData).run()
    })

    it('converts values into a supported format', () => {
      const mapControlsToParamsResponse = {
        reporter: {
          email: 'me@domain.com',
          phone: '14020',
          sharing_allowed: {
            label: 'Foo',
            value: true,
          },
        },
      }
      jest
        .spyOn(mapControlsToParams, 'default')
        .mockImplementation(() => mapControlsToParamsResponse)
      jest.spyOn(auth, 'isAuthenticated').mockImplementation(() => true)

      const postData = {
        text: payloadIncident.text,
        category: { sub_category: payloadIncident.classification.id },
        handling_message,
        priority: {
          priority: payloadIncident.priority.id,
        },
        type: {
          code: payloadIncident.type.id,
        },
        reporter: {
          ...mapControlsToParamsResponse.reporter,
          sharing_allowed:
            mapControlsToParamsResponse.reporter.sharing_allowed.value,
        },
      }

      return expectSaga(getPostData, action).returns(postData).run()
    })
  })

  describe('createIncident', () => {
    const postData = {
      text: payloadIncident.text,
      category: mockCategoryData,
    }

    it('should POST incident', () =>
      expectSaga(createIncident, action)
        .provide([
          [matchers.call.fn(getPostData), { handling_message, ...postData }],
          [matchers.call.fn(postIncidentSaga), incident],
        ])
        .call(getPostData, action)
        .call(postIncidentSaga, postData)
        .put(createIncidentSuccess({ handling_message, ...incident }))
        .put(replace('/incident/bedankt'))
        .run())

    it('should dispatch error', () =>
      expectSaga(createIncident, action)
        .provide([
          [matchers.call.fn(getPostData), { handling_message, ...postData }],
          [
            matchers.call.fn(postIncidentSaga),
            throwError(new Error('whoops!!!1!')),
          ],
        ])
        .call(getPostData, action)
        .put(createIncidentError())
        .put(replace('/incident/fout'))
        .run())

    it('should run blocking file upload calls', () => {
      const actionWithFiles = {
        ...action,
      }

      const image1 = {
        name: 'foobarbaz.jpg',
        lastModified: 1579597089586,
        size: 4718960,
        type: 'image/jpeg',
      }

      const image2 = {
        name: 'omgwtfbbq.jpg',
        lastModified: 1579597057799,
        size: 2886977,
        type: 'image/jpeg',
      }

      actionWithFiles.payload.incident.images = [image1, image2]

      return expectSaga(createIncident, action)
        .provide([
          [matchers.call.fn(getPostData), { handling_message, ...postData }],
          [matchers.call.fn(postIncidentSaga), incident],
        ])
        .call(getPostData, action)
        .call(postIncidentSaga, postData)
        .call(uploadFile, { payload: { file: image1, id: incident.signal_id } })
        .call(uploadFile, { payload: { file: image2, id: incident.signal_id } })
        .run()
    })
  })
})
