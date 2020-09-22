import { has, fromJS } from 'immutable';
import incidentContainerReducer, { initialState } from './reducer';

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
} from './constants';

describe('signals/incident/containers/IncidentContainer/reducer', () => {
  it('returns the initial state', () => {
    expect(incidentContainerReducer(undefined, {})).toEqual(fromJS(initialState));
  });

  it('default wizard state should contain date, time, and priority', () => {
    expect(initialState.get('incident').toJS()).toEqual(
      expect.objectContaining({
        incident_date: 'Vandaag',
        incident_time_hours: 9,
        incident_time_minutes: 0,
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
    );
  });

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
      });
    });
  });

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
      ).toEqual(initialState);
    });
  });

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
      });
    });
  });

  describe('CREATE_INCIDENT_SUCCESS', () => {
    const handling_message = 'baz';
    const id = 666;
    const category = {
      main_slug: 'foo',
      sub_slug: 'bar',
    };
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
      });
    });
  });

  describe('CREATE_INCIDENT_ERROR', () => {
    it('sets error and loading', () => {
      expect(
        incidentContainerReducer(fromJS({}), {
          type: CREATE_INCIDENT_ERROR,
        }).toJS()
      ).toEqual({
        error: true,
        loading: false,
      });
    });
  });

  describe('GET_CLASSIFICATION', () => {
    it('resets error and loading and id', () => {
      expect(
        incidentContainerReducer(fromJS({ incident: {} }), {
          type: GET_CLASSIFICATION,
        }).toJS()
      ).toEqual({
        incident: {},
        loadingClassification: true,
      });
    });
  });

  describe('GET_CLASSIFICATION_SUCCESS', () => {
    const intermediateState = initialState.set(
      'incident',
      initialState
        .get('incident')
        .set('extra_something', 'foo bar')
        .set('extra_something_else', 'baz qux')
    );

    it('sets category and subcategory', () => {
      expect(
        incidentContainerReducer(
          fromJS({
            incident: {},
          }),
          {
            type: GET_CLASSIFICATION_SUCCESS,
            payload: {
              category: 'Overlast in de openbare ruimte',
              subcategory: 'Honden(poep)',
            },
          }
        ).toJS()
      ).toEqual({
        incident: {
          category: 'Overlast in de openbare ruimte',
          subcategory: 'Honden(poep)',
        },
        loadingClassification: false,
      });
    });

    it('removes all extra_ props', () => {
      const newState = incidentContainerReducer(intermediateState, {
        type: GET_CLASSIFICATION_SUCCESS,
        payload: {
          category: 'Overlast in de openbare ruimte',
          subcategory: 'Honden(poep)',
        },
      });

      expect(has(newState.get('incident'), 'extra_something')).toEqual(false);
      expect(has(newState.get('incident'), 'extra_something_else')).toEqual(false);
    });

    it('only removes all extra_ props when category has changed', () => {
      const type = GET_CLASSIFICATION_SUCCESS;
      const payload = {
        category: 'foo',
        subcategory: 'bar',
      };

      const newState = incidentContainerReducer(intermediateState, { type, payload }).toJS();
      newState.incident.extra_something = 'qux';

      const updatedState = incidentContainerReducer(fromJS(newState), { type, payload });

      expect(has(updatedState.get('incident'), 'extra_something')).toEqual(true);

      const changedPayload = {
        category: 'zork',
        subcategory: 'bar',
      };

      const updatedStateDiff = incidentContainerReducer(updatedState, { type, payload: changedPayload });

      expect(has(updatedStateDiff.get('incident'), 'extra_something')).toEqual(false);
    });

    it('only removes all extra_ props when subcategory has changed', () => {
      const type = GET_CLASSIFICATION_SUCCESS;
      const payload = {
        category: 'foo',
        subcategory: 'bar',
      };

      const newState = incidentContainerReducer(intermediateState, { type, payload }).toJS();
      newState.incident.extra_something = 'qux';

      const updatedState = incidentContainerReducer(fromJS(newState), { type, payload });

      expect(has(updatedState.get('incident'), 'extra_something')).toEqual(true);

      const changedPayload = {
        category: 'foo',
        subcategory: 'bazzz',
      };

      const updatedStateDiff = incidentContainerReducer(updatedState, { type, payload: changedPayload });

      expect(has(updatedStateDiff.get('incident'), 'extra_something')).toEqual(false);
    });
  });

  describe('GET_CLASSIFICATION_ERROR', () => {
    it('sets category and subcategory', () => {
      expect(
        incidentContainerReducer(
          fromJS({
            incident: {},
          }),
          {
            type: GET_CLASSIFICATION_ERROR,
            payload: {
              category: 'overig',
              subcategory: 'overig(poep)',
            },
          }
        ).toJS()
      ).toEqual({
        incident: {
          category: 'overig',
          subcategory: 'overig(poep)',
        },
        loadingClassification: false,
      });
    });
  });

  describe('SET_CLASSIFICATION', () => {
    it('sets category and subcategory and disables the predictions', () => {
      expect(
        incidentContainerReducer(
          fromJS({
            incident: {},
          }),
          {
            type: SET_CLASSIFICATION,
            payload: {
              category: 'overig',
              subcategory: 'overig(poep)',
            },
          }
        ).toJS()
      ).toEqual({
        incident: {
          category: 'overig',
          subcategory: 'overig(poep)',
        },
        usePredictions: false,
      });
    });
  });

  describe('GET_QUESTIONS_SUCCESS', () => {
    it('sets questions', () => {
      expect(
        incidentContainerReducer(
          fromJS({
            incident: {},
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
      });
    });
  });

  describe('RESET_EXTRA_STATE', () => {
    const intermediateState = initialState.set(
      'incident',
      initialState
        .get('incident')
        .set('extra_something', 'foo bar')
        .set('extra_something_else', 'baz qux')
    );

    it('returns partially reset state', () => {
      const newState = incidentContainerReducer(intermediateState, {
        type: RESET_EXTRA_STATE,
      });

      expect(has(newState.get('incident'), 'extra_something')).toEqual(false);
      expect(has(newState.get('incident'), 'extra_something_else')).toEqual(false);
    });
  });
});
