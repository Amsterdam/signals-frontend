// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2021 Gemeente Amsterdam
import { fromJS, Seq } from 'immutable'
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
} from './constants'
import { getIncidentClassification } from './services'

export const initialState = fromJS({
  incident: {
    priority: {
      id: 'normal',
      label: 'Normaal',
    },
    sharing_allowed: {
      label:
        'Ja, ik geef de gemeenten Amsterdam en Weesp toestemming om mijn melding door te sturen naar andere organisaties als de melding niet voor de gemeente is bestemd.',
      value: true,
    },
    classification: {
      id: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/afval/sub_categories/container-is-vol',
      name: 'Container is vol',
      slug: 'container-is-vol',
    },
    incident_time_hours: 9,
    questions: [],
    handling_message:
      'We laten u binnen 3 werkdagen weten wat we hebben gedaan. En anders hoort u wanneer wij uw melding kunnen oppakken.\nWe houden u op de hoogte via e-mail.',
    phone: '14020',
    extra_container: {
      id: '232432',
      type: 'not-on-map',
    },
    images_previews: [],
    location: {
      coordinates: {
        lat: 52.373381808290645,
        lng: 4.893622741484086,
      },
      address: {
        openbare_ruimte: 'Dam',
        huisnummer: '1',
        postcode: '1012JS',
        woonplaats: 'Amsterdam',
      },
    },
    images: [],
    type: {
      id: 'SIG',
      label: 'Melding',
    },
    incident_time_minutes: 0,
    source: 'online',
    incident_date: 'Vandaag',
    datetime: {
      id: 'Nu',
      label: 'Nu',
      info: '',
    },
    email: 'janjaap.van.deursen@amsterdam.nl',
    description: 'container is vol',
    category: 'afval',
    subcategory: 'container-is-vol',
  },
  loadingClassification: false,
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
      return state.set('loadingClassification', true)

    case GET_CLASSIFICATION_SUCCESS: {
      const { classification } = action.payload
      return state
        .set('loadingClassification', false)
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
        .set('loadingClassification', false)
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
      return state.set(
        'incident',
        state.get('incident').set('questions', action.payload.questions)
      )

    default:
      return state
  }
}
