import incidentContainerReducer, { initialState } from './reducer';

import {
  UPDATE_INCIDENT,
  RESET_INCIDENT,
  CREATE_INCIDENT,
  CREATE_INCIDENT_SUCCESS,
  CREATE_INCIDENT_ERROR,
  GET_CLASSIFICATION_SUCCESS,
  GET_CLASSIFICATION_ERROR,
  SET_PRIORITY,
  SET_PRIORITY_SUCCESS,
  SET_PRIORITY_ERROR,
} from './constants';

describe('incidentContainerReducer', () => {
  it('returns the initial state', () => {
    expect(incidentContainerReducer(undefined, {})).toEqual(initialState);
  });

  it('default wizard state should contain date, time, and priority', () => {
    expect(initialState.incident).toEqual({
      incident_date: 'Vandaag',
      incident_time_hours: 9,
      incident_time_minutes: 0,
      priority: {
        id: 'normal',
        label: 'Normaal',
      },
    });
  });

  describe('UPDATE_INCIDENT', () => {
    it('sets new properties and keeps the old ones', () => {
      expect(
        incidentContainerReducer(
          {
            incident: {
              category: 'bar',
            },
          },
          {
            type: UPDATE_INCIDENT,
            payload: {
              subcategory: 'foo',
            },
          },
        ),
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
          {
            incident: {
              category: 'foo',
            },
          },
          {
            type: RESET_INCIDENT,
          },
        ),
      ).toEqual({
        incident: initialState.incident,
      });
    });
  });

  describe('CREATE_INCIDENT', () => {
    it('resets error and loading and id', () => {
      expect(
        incidentContainerReducer(
          { incident: {} },
          {
            type: CREATE_INCIDENT,
          },
        ),
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
    it('sets incident and loading and id but keeps the handling_message', () => {
      expect(
        incidentContainerReducer(
          {
            incident: {
              handling_message: 'baz',
            },
          },
          {
            type: CREATE_INCIDENT_SUCCESS,
            payload: {
              id: 666,
              category: {
                main_slug: 'foo',
                sub_slug: 'bar',
              },
            },
          },
        ),
      ).toEqual({
        loading: false,
        incident: {
          ...initialState.incident,
          id: 666,
          handling_message: 'baz',
        },
      });
    });
  });

  describe('CREATE_INCIDENT_ERROR', () => {
    it('sets error and loading', () => {
      expect(
        incidentContainerReducer(
          {},
          {
            type: CREATE_INCIDENT_ERROR,
          },
        ),
      ).toEqual({
        error: true,
        loading: false,
      });
    });
  });

  describe('GET_CLASSIFICATION_SUCCESS', () => {
    it('sets category and subcategory', () => {
      expect(
        incidentContainerReducer(
          {
            incident: {},
          },
          {
            type: GET_CLASSIFICATION_SUCCESS,
            payload: {
              category: 'Overlast in de openbare ruimte',
              subcategory: 'Honden(poep)',
            },
          },
        ),
      ).toEqual({
        incident: {
          category: 'Overlast in de openbare ruimte',
          subcategory: 'Honden(poep)',
        },
      });
    });
  });

  describe('GET_CLASSIFICATION_ERROR', () => {
    it('sets category and subcategory', () => {
      expect(
        incidentContainerReducer(
          {
            incident: {},
          },
          {
            type: GET_CLASSIFICATION_ERROR,
            payload: {
              category: 'Overlast in de openbare ruimte',
              subcategory: 'Honden(poep)',
            },
          },
        ),
      ).toEqual({
        incident: {
          category: 'Overlast in de openbare ruimte',
          subcategory: 'Honden(poep)',
        },
      });
    });
  });

  describe('SET_PRIORITY', () => {
    it('sets priority', () => {
      expect(
        incidentContainerReducer(
          {},
          {
            type: SET_PRIORITY,
            payload: {
              _signal: 666,
              priority: 'normal',
            },
          },
        ),
      ).toEqual({
        priority: {
          _signal: 666,
          priority: 'normal',
        },
      });
    });
  });

  describe('SET_PRIORITY_SUCCESS', () => {
    it('sets priority', () => {
      expect(
        incidentContainerReducer(
          {},
          {
            type: SET_PRIORITY_SUCCESS,
          },
        ),
      ).toEqual({
        priority: {},
      });
    });
  });

  describe('SET_PRIORITY_ERROR', () => {
    it('sets priority', () => {
      expect(
        incidentContainerReducer(
          {},
          {
            type: SET_PRIORITY_ERROR,
          },
        ),
      ).toEqual({
        priority: {},
      });
    });
  });
});
