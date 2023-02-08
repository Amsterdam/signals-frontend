// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2021 Gemeente Amsterdam
import { testActionCreator } from 'test/utils'

import {
  updateIncident,
  resetIncident,
  createIncident,
  createIncidentSuccess,
  createIncidentError,
  getClassification,
  getClassificationSuccess,
  getClassificationError,
  setClassification,
  getQuestions,
  getQuestionsSuccess,
  getQuestionsError,
  resetExtraState,
  removeQuestionData,
  addToSelection,
  removeFromSelection,
} from './actions'
import {
  UPDATE_INCIDENT,
  RESET_INCIDENT,
  CREATE_INCIDENT,
  CREATE_INCIDENT_SUCCESS,
  CREATE_INCIDENT_ERROR,
  GET_CLASSIFICATION,
  GET_CLASSIFICATION_SUCCESS,
  GET_CLASSIFICATION_ERROR,
  SET_CLASSIFICATION,
  GET_QUESTIONS,
  GET_QUESTIONS_SUCCESS,
  GET_QUESTIONS_ERROR,
  RESET_EXTRA_STATE,
  REMOVE_QUESTION_DATA,
  ADD_TO_SELECTION,
  REMOVE_FROM_SELECTION,
} from './constants'

describe('Incident container actions', () => {
  const incident = {
    text: 'foo',
    category: 'bar',
  }

  const category = {
    sub_category: 'uitwerpselen',
    name: 'Uitwerpselen',
    slug: 'uitwerpselen',
    handling_message: 'Handling message.',
  }

  const selectionPayload = {
    location: {},
    meta_name: 'bla',
    ['bla']: { selection: [{ id: '123', description: 'container' }] },
  }

  it('should dispatch update incident action', () => {
    testActionCreator(updateIncident, UPDATE_INCIDENT, incident)
  })

  it('should dispatch reset incident action', () => {
    testActionCreator(resetIncident, RESET_INCIDENT)
  })

  it('should dispatch add to selection action', () => {
    testActionCreator(addToSelection, ADD_TO_SELECTION, selectionPayload)
  })

  it('should dispatch remove from selection action', () => {
    testActionCreator(
      removeFromSelection,
      REMOVE_FROM_SELECTION,
      selectionPayload
    )
  })

  it('should dispatch remove question action', () => {
    testActionCreator(removeQuestionData, REMOVE_QUESTION_DATA)
  })

  it('should dispatch create incident action', () => {
    testActionCreator(createIncident, CREATE_INCIDENT, incident)
  })

  it('should dispatch create incident success action', () => {
    testActionCreator(createIncidentSuccess, CREATE_INCIDENT_SUCCESS, incident)
  })

  it('should dispatch create incident error action', () => {
    testActionCreator(createIncidentError, CREATE_INCIDENT_ERROR)
  })

  it('should dispatch get classification action', () => {
    testActionCreator(getClassification, GET_CLASSIFICATION, 'poep')
  })

  it('should dispatch classification success action', () => {
    testActionCreator(
      getClassificationSuccess,
      GET_CLASSIFICATION_SUCCESS,
      category
    )
  })

  it('should dispatch classification error action', () => {
    testActionCreator(
      getClassificationError,
      GET_CLASSIFICATION_ERROR,
      category
    )
  })

  it('should dispatch set classification', () => {
    testActionCreator(setClassification, SET_CLASSIFICATION, category)
  })

  it('should dispatch get questions action', () => {
    testActionCreator(getQuestions, GET_QUESTIONS, {
      category: 'overig',
      subcategory: 'overig',
    })
  })

  it('should dispatch questions success action', () => {
    const payload = {
      key1: {
        meta: 'meta1',
        options: 'options1',
        render: 'field_type1',
      },
    }
    testActionCreator(getQuestionsSuccess, GET_QUESTIONS_SUCCESS, payload)
  })

  it('should dispatch questions error action', () => {
    testActionCreator(getQuestionsError, GET_QUESTIONS_ERROR)
  })

  test('resetExtraState', () => {
    expect(resetExtraState()).toEqual({
      type: RESET_EXTRA_STATE,
    })
  })
})
