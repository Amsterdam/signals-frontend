// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2022 Gemeente Amsterdam
import { has, fromJS } from 'immutable'
import configuration from 'shared/services/configuration/configuration'
import incidentContainerReducer, { initialState } from './reducer'

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
  GET_QUESTIONS_SUCCESS,
  RESET_EXTRA_STATE,
  REMOVE_QUESTION_DATA,
  GET_QUESTIONS_ERROR,
  SET_LOADING_DATA,
  ADD_TO_SELECTION,
  REMOVE_FROM_SELECTION,
} from './constants'

jest.mock('shared/services/configuration/configuration')

const address = {
  openbare_ruimte: 'Rokin',
  huisnummer: '12',
  postcode: '1012KR',
  woonplaat: 'Amsterdam',
}
const coordinates = {
  lat: 52.372146435414884,
  lng: 4.892930321735494,
}
const selection = [
  {
    id: 'Inleverpunt Textiel Fashion for Good',
    type: 'Textiel',
    description: 'Textiel container',
    label: 'Textiel container - Inleverpunt Textiel Fashion for Good',
    coordinates,
    address,
  },
]

const location = { coordinates, address }

describe('signals/incident/containers/IncidentContainer/reducer', () => {
  afterEach(() => {
    configuration.__reset()
  })

  it('returns the initial state', () => {
    expect(incidentContainerReducer(undefined, {})).toEqual(
      fromJS(initialState)
    )
  })

  it('default wizard state should contain date, time, and priority', () => {
    expect(initialState.get('incident').toJS()).toEqual(
      expect.objectContaining({
        dateTime: undefined,
        priority: {
          id: 'normal',
          label: 'Normaal',
        },
        type: {
          id: 'SIG',
          label: 'Melding',
        },
        category: '',
        subcategory: '',
        handling_message: '',
      })
    )
  })

  describe('UPDATE_INCIDENT', () => {
    it('sets new properties and keeps the old ones', () => {
      expect(
        incidentContainerReducer(
          fromJS({
            incident: {
              category: 'bar',
            },
          }),
          {
            type: UPDATE_INCIDENT,
            payload: {
              subcategory: 'foo',
            },
          }
        ).toJS()
      ).toEqual({
        incident: {
          category: 'bar',
          subcategory: 'foo',
        },
      })
    })
  })

  describe('ADD_TO_SELECTION', () => {
    it('adds an item to the selection of an incident', () => {
      expect(
        incidentContainerReducer(
          fromJS({
            incident: {
              extra_container: { location },
              category: 'bar',
              subcategory: 'foo',
            },
          }),
          {
            type: ADD_TO_SELECTION,
            payload: {
              extra_container: { selection, location },
              location,
              meta_name: 'extra_container',
            },
          }
        ).toJS()
      ).toEqual({
        incident: {
          category: 'bar',
          subcategory: 'foo',
          extra_container: { selection, location },
        },
      })
    })
    it('does not add an item to the selection when the max number of assets has been reached', () => {
      expect(
        incidentContainerReducer(
          fromJS({
            incident: {
              extra_container: { location, selection },
              category: 'bar',
              subcategory: 'foo',
            },
          }),
          {
            type: ADD_TO_SELECTION,
            payload: {
              extra_container: {
                selection: [
                  {
                    id: 'GL-365',
                    type: 'Glas',
                    description: 'Glas container',
                    label: 'Glas container',
                    coordinates,
                    address,
                  },
                ],
                maxNumberOfAssets: 1,
              },
              location,
              meta_name: 'extra_container',
            },
          }
        ).toJS()
      ).toEqual({
        incident: {
          category: 'bar',
          subcategory: 'foo',
          extra_container: { selection, location },
        },
      })
    })

    it('does not add an item to the selection of an incident when the item is already in the selection', () => {
      expect(
        incidentContainerReducer(
          fromJS({
            incident: {
              extra_container: { location, selection },
              category: 'bar',
              subcategory: 'foo',
            },
          }),
          {
            type: ADD_TO_SELECTION,
            payload: {
              extra_container: { selection, location },
              location,
              meta_name: 'extra_container',
            },
          }
        ).toJS()
      ).toEqual({
        incident: {
          category: 'bar',
          subcategory: 'foo',
          extra_container: { selection, location },
        },
      })
    })
  })

  describe('REMOVE_FROM_SELECTION', () => {
    it('removes an item from the selection of an incident', () => {
      expect(
        incidentContainerReducer(
          fromJS({
            incident: {
              extra_container: { selection, location },
              category: 'bar',
              subcategory: 'foo',
            },
          }),
          {
            type: REMOVE_FROM_SELECTION,
            payload: {
              extra_container: { selection: undefined },
              meta_name: 'extra_container',
            },
          }
        ).toJS()
      ).toEqual({
        incident: {
          category: 'bar',
          subcategory: 'foo',
          extra_container: { selection: undefined, location: undefined },
        },
      })
    })
  })

  describe('RESET_INCIDENT', () => {
    it('sets new properties and keeps the old ones', () => {
      expect(
        incidentContainerReducer(
          fromJS({
            incident: {
              category: 'foo',
            },
          }),
          {
            type: RESET_INCIDENT,
          }
        )
      ).toEqual(initialState)
    })
  })

  describe('CREATE_INCIDENT', () => {
    it('resets error and loading and id', () => {
      expect(
        incidentContainerReducer(fromJS({ incident: {} }), {
          type: CREATE_INCIDENT,
        }).toJS()
      ).toEqual({
        error: false,
        loading: true,
        incident: {
          id: null,
        },
      })
    })
  })

  describe('CREATE_INCIDENT_SUCCESS', () => {
    const handling_message = 'baz'
    const id = 666
    const category = {
      main_slug: 'foo',
      sub_slug: 'bar',
    }
    it('sets incident and loading and id but keeps the handling_message', () => {
      expect(
        incidentContainerReducer(initialState, {
          type: CREATE_INCIDENT_SUCCESS,
          payload: {
            id,
            category,
            handling_message,
          },
        }).toJS()
      ).toEqual({
        ...initialState.toJS(),
        loading: false,
        incident: {
          id,
          category,
          handling_message,
        },
      })
    })
  })

  describe('CREATE_INCIDENT_ERROR', () => {
    it('sets error and loading', () => {
      expect(
        incidentContainerReducer(fromJS({}), {
          type: CREATE_INCIDENT_ERROR,
        }).toJS()
      ).toEqual({
        error: true,
        loading: false,
      })
    })
  })

  describe('Classification ', () => {
    const payload = {
      category: 'wegen-verkeer-straatmeubilair',
      subcategory: 'onderhoud-stoep-straat-en-fietspad',
      handling_message: 'the handling message',
      classification: null,
    }
    const { category, subcategory, handling_message, classification } = payload

    describe('GET_CLASSIFICATION', () => {
      it('resets error and loading and id', () => {
        expect(
          incidentContainerReducer(fromJS({ incident: {} }), {
            type: GET_CLASSIFICATION,
          }).toJS()
        ).toEqual({
          incident: {},
          loadingData: true,
        })
      })
    })

    describe('GET_CLASSIFICATION_SUCCESS', () => {
      const intermediateState = initialState.set(
        'incident',
        initialState
          .get('incident')
          .set('extra_something', 'foo bar')
          .set('extra_something_else', 'baz qux')
      )

      it('sets the classification properties', () => {
        expect(
          incidentContainerReducer(
            fromJS({
              incident: {},
            }),
            {
              type: GET_CLASSIFICATION_SUCCESS,
              payload,
            }
          ).toJS()
        ).toEqual({
          incident: {
            category,
            subcategory,
            classification,
            handling_message,
          },
          loadingData: false,
          classificationPrediction: classification,
        })
      })

      it('sets loadingData when feature flag enabled', () => {
        configuration.featureFlags.fetchQuestionsFromBackend = true

        const newState = incidentContainerReducer(intermediateState, {
          type: GET_CLASSIFICATION_SUCCESS,
          payload,
        })

        expect(newState.get('loadingData')).toEqual(true)
      })

      it('removes all extra_ props', () => {
        const newState = incidentContainerReducer(intermediateState, {
          type: GET_CLASSIFICATION_SUCCESS,
          payload,
        })

        expect(has(newState.get('incident'), 'extra_something')).toEqual(false)
        expect(has(newState.get('incident'), 'extra_something_else')).toEqual(
          false
        )
      })

      it('only removes all extra_ props when category has changed', () => {
        const type = GET_CLASSIFICATION_SUCCESS

        const newState = incidentContainerReducer(intermediateState, {
          type,
          payload,
        }).toJS()
        newState.incident.extra_something = 'qux'

        const updatedState = incidentContainerReducer(fromJS(newState), {
          type,
          payload,
        })

        expect(has(updatedState.get('incident'), 'extra_something')).toEqual(
          true
        )

        const changedPayload = {
          ...payload,
          category: 'zork',
          subcategory: 'zork',
        }

        const updatedStateDiff = incidentContainerReducer(updatedState, {
          type,
          payload: changedPayload,
        })

        expect(
          has(updatedStateDiff.get('incident'), 'extra_something')
        ).toEqual(false)
      })

      it('only changes the category when this is not modified by the user', () => {
        const type = GET_CLASSIFICATION_SUCCESS
        const classificationPrediction = {
          id: 'tork',
          name: 'tork',
          slug: 'tork',
        }

        const newPrediction = {
          ...payload,
          category: 'zork',
          subcategory: 'zork',
        }

        const testState = initialState.toJS()
        testState.incident.category = payload
        testState.classificationPrediction = classificationPrediction
        const newState = incidentContainerReducer(fromJS(testState), {
          type,
          payload: newPrediction,
        }).toJS()
        expect(newState.incident.category.slug).toEqual(payload.slug)
      })
    })

    describe('GET_CLASSIFICATION_ERROR', () => {
      it('sets category ', () => {
        expect(
          incidentContainerReducer(
            fromJS({
              incident: {},
            }),
            {
              type: GET_CLASSIFICATION_ERROR,
              payload,
            }
          ).toJS()
        ).toEqual({
          incident: {
            category,
            subcategory,
            classification,
            handling_message,
          },
          loadingData: false,
          classificationPrediction: null,
        })
      })
    })

    describe('SET_CLASSIFICATION', () => {
      it('sets category and disables the predictions', () => {
        expect(
          incidentContainerReducer(
            fromJS({
              incident: {},
            }),
            {
              type: SET_CLASSIFICATION,
              payload,
            }
          ).toJS()
        ).toEqual({
          incident: {
            category,
            subcategory,
            classification,
            handling_message,
          },
          usePredictions: false,
        })
      })
    })
  })

  describe('GET_QUESTIONS_SUCCESS', () => {
    it('sets questions', () => {
      expect(
        incidentContainerReducer(
          fromJS({
            incident: {},
            loadingData: true,
          }),
          {
            type: GET_QUESTIONS_SUCCESS,
            payload: {
              questions: {
                key1: {},
              },
            },
          }
        ).toJS()
      ).toEqual({
        incident: {
          questions: {
            key1: {},
          },
        },
        loadingData: false,
      })
    })
  })

  describe('GET_QUESTIONS_ERROR', () => {
    it('resets loading state', () => {
      expect(
        incidentContainerReducer(
          fromJS({
            incident: {},
            loadingData: true,
          }),
          {
            type: GET_QUESTIONS_ERROR,
            payload: {
              questions: {
                key1: {},
              },
            },
          }
        ).toJS()
      ).toEqual({
        incident: {},
        loadingData: false,
      })
    })
  })

  describe('SET_LOADING_DATA', () => {
    it('sets loading state', () => {
      expect(
        incidentContainerReducer(
          fromJS({
            incident: {},
            loadingData: false,
          }),
          {
            type: SET_LOADING_DATA,
            payload: true,
          }
        ).toJS()
      ).toEqual({
        incident: {},
        loadingData: true,
      })

      expect(
        incidentContainerReducer(
          fromJS({
            incident: {},
            loadingData: true,
          }),
          {
            type: SET_LOADING_DATA,
            payload: false,
          }
        ).toJS()
      ).toEqual({
        incident: {},
        loadingData: false,
      })
    })
  })

  describe('REMOVE_QUESTION_DATA', () => {
    it('returns reset state', () => {
      const intermediateState = initialState.set(
        'incident',
        initialState
          .get('incident')
          .set('extra_something', 'foo bar')
          .set('extra_something_else', 'baz qux')
      )

      const newState = incidentContainerReducer(intermediateState, {
        type: REMOVE_QUESTION_DATA,
        payload: ['extra_something'],
      })

      expect(has(newState.get('incident'), 'extra_something')).toEqual(false)
      expect(has(newState.get('incident'), 'extra_something_else')).toEqual(
        true
      )
    })
  })

  describe('RESET_EXTRA_STATE', () => {
    const intermediateState = initialState.set(
      'incident',
      initialState
        .get('incident')
        .set('extra_something', 'foo bar')
        .set('extra_something_else', 'baz qux')
    )

    it('returns partially reset state', () => {
      const newState = incidentContainerReducer(intermediateState, {
        type: RESET_EXTRA_STATE,
      })

      expect(has(newState.get('incident'), 'extra_something')).toEqual(false)
      expect(has(newState.get('incident'), 'extra_something_else')).toEqual(
        false
      )
    })
  })
})
