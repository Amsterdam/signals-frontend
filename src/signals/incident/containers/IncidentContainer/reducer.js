// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2021 Gemeente Amsterdam
import { fromJS, Seq } from 'immutable'
import configuration from 'shared/services/configuration/configuration'
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
  RESET_EXTRA_STATE,
  GET_QUESTIONS_SUCCESS,
  REMOVE_QUESTION_DATA,
  GET_QUESTIONS_ERROR,
  SET_LOADING_DATA,
  SHOW_MAP,
  CLOSE_MAP,
} from './constants'
import { getIncidentClassification } from './services'

export const initialState = fromJS({
  incident: {
    dateTime: undefined,
    category: '',
    subcategory: '',
    classification: null,
    description: '',
    email: '',
    handling_message: '',
    images_previews: [],
    images: [],
    location: undefined,
    phone: undefined,
    priority: {
      id: 'normal',
      label: 'Normaal',
    },
    questions: [],
    source: undefined,
    type: {
      id: 'SIG',
      label: 'Melding',
    },
  },
  loading: false,
  loadingData: false,
  mapActive: false,
  usePredictions: true,
  classificationPrediction: null,
})

const getIncidentWithoutExtraProps = (
  incident,
  { category, subcategory } = {}
) => {
  const prevCategory = incident.get('category')
  const prevSubcategory = incident.get('subcategory')
  const hasChanged =
    prevCategory !== category || prevSubcategory !== subcategory

  if (!hasChanged && category && subcategory) return incident
  const seq = Seq(incident).filter((val, key) => !key.startsWith('extra'))

  return seq.toMap()
}

export default (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_INCIDENT:
      return state.set(
        'incident',
        fromJS({
          ...state.get('incident').toJS(),
          ...action.payload,
        })
      )

    case RESET_INCIDENT:
      return initialState

    case CREATE_INCIDENT:
      return state
        .set('loading', true)
        .set('error', false)
        .set('incident', state.get('incident').set('id', null))

    case CREATE_INCIDENT_SUCCESS:
      return state.set('loading', false).set('incident', fromJS(action.payload))

    case CREATE_INCIDENT_ERROR:
      return state.set('error', true).set('loading', false)

    case GET_CLASSIFICATION:
      return state.set('loadingData', true)

    case GET_CLASSIFICATION_SUCCESS: {
      const { classification } = action.payload
      return state
        .set(
          'loadingData',
          configuration.featureFlags.fetchQuestionsFromBackend
        )
        .set(
          'incident',
          fromJS({
            ...getIncidentWithoutExtraProps(
              state.get('incident'),
              action.payload
            ).toJS(),
            ...getIncidentClassification(state.toJS(), action.payload),
          })
        )
        .set('classificationPrediction', fromJS(classification))
    }

    case GET_CLASSIFICATION_ERROR: {
      const { category, subcategory, handling_message, classification } =
        action.payload
      return state
        .set('loadingData', false)
        .set(
          'incident',
          state
            .get('incident')
            .set('category', category)
            .set('subcategory', subcategory)
            .set(
              'classification',
              fromJS(getIncidentClassification(state.toJS(), classification))
            )
            .set('handling_message', handling_message)
        )
        .set('classificationPrediction', fromJS(classification))
    }

    case SET_CLASSIFICATION: {
      const { category, subcategory, handling_message, classification } =
        action.payload
      return state
        .set(
          'incident',
          state
            .get('incident')
            .set('category', category)
            .set('subcategory', subcategory)
            .set(
              'classification',
              fromJS(getIncidentClassification(state.toJS(), classification))
            )
            .set('handling_message', handling_message)
        )
        .set('usePredictions', false)
    }

    case RESET_EXTRA_STATE:
      return state.set(
        'incident',
        getIncidentWithoutExtraProps(state.get('incident'), action.payload)
      )

    case REMOVE_QUESTION_DATA: {
      return state.set(
        'incident',
        Seq(state.get('incident')).filter(
          (val, key) => !action.payload.includes(key)
        )
      )
    }

    case GET_QUESTIONS_SUCCESS:
      return state
        .set(
          'incident',
          state.get('incident').set('questions', action.payload.questions)
        )
        .set('loadingData', false)

    case GET_QUESTIONS_ERROR:
      return state.set('loadingData', false)

    case SET_LOADING_DATA:
      return state.set('loadingData', action.payload)

    case SHOW_MAP:
      return state.set('mapActive', true)

    case CLOSE_MAP:
      return state.set('mapActive', false)

    default:
      return state
  }
}
