import { fromJS } from 'immutable';
import incidentContainerReducer, { initialState } from './reducer';

import {
  SET_INCIDENT,

  CREATE_INCIDENT,
  CREATE_INCIDENT_SUCCESS,
  CREATE_INCIDENT_ERROR,

  GET_CLASSIFICATION_SUCCESS,
  GET_CLASSIFICATION_ERROR,

  SET_PRIORITY,
  SET_PRIORITY_SUCCESS
} from './constants';

describe('incidentContainerReducer', () => {
  it('returns the initial state', () => {
    expect(incidentContainerReducer(undefined, {})).toEqual(fromJS(initialState));
  });

  describe('SET_INCIDENT', () => {
    it('sets new properties and keeps the old ones', () => {
      expect(
        incidentContainerReducer(fromJS({
          incident: {
            category: 'bar'
          }
        }), {
          type: SET_INCIDENT,
          payload: {
            subcategory: 'foo'
          }
        }).toJS()
      ).toEqual({
        incident: {
          category: 'bar',
          subcategory: 'foo'
        }
      });
    });
  });

  describe('CREATE_INCIDENT', () => {
    it('resets error and loading and id', () => {
      expect(
        incidentContainerReducer(fromJS({ incident: {} }), {
          type: CREATE_INCIDENT
        }).toJS()
      ).toEqual({
        error: false,
        loading: true,
        incident: {
          id: null
        }
      });
    });
  });

  describe('CREATE_INCIDENT_SUCCESS', () => {
    it('sets incident and loading and id', () => {
      expect(
        incidentContainerReducer(fromJS({}), {
          type: CREATE_INCIDENT_SUCCESS,
          payload: {
            id: 666,
            category: {
              main: 'foo',
              sub: 'bar'
            }
          }
        }).toJS()
      ).toEqual({
        loading: false,
        incident: {
          ...initialState.get('incident').toJS(),
          id: 666,
          category: 'foo',
          subcategory: 'bar'
        }
      });
    });
  });

  describe('CREATE_INCIDENT_ERROR', () => {
    it('sets error and loading', () => {
      expect(
        incidentContainerReducer(fromJS({}), {
          type: CREATE_INCIDENT_ERROR
        }).toJS()
      ).toEqual({
        error: true,
        loading: false
      });
    });
  });

  describe('GET_CLASSIFICATION_SUCCESS', () => {
    it('sets category and subcategory', () => {
      expect(
        incidentContainerReducer(fromJS({
          incident: {}
        }), {
          type: GET_CLASSIFICATION_SUCCESS,
          payload: {
            category: 'Overlast in de openbare ruimte',
            subcategory: 'Honden(poep)'
          }
        }).toJS()
      ).toEqual({
        incident: {
          category: 'Overlast in de openbare ruimte',
          subcategory: 'Honden(poep)'
        }
      });
    });
  });

  describe('GET_CLASSIFICATION_ERROR', () => {
    it('sets category and subcategory', () => {
      expect(
        incidentContainerReducer(fromJS({
          incident: {}
        }), {
          type: GET_CLASSIFICATION_ERROR,
          payload: {
            category: 'Overlast in de openbare ruimte',
            subcategory: 'Honden(poep)'
          }
        }).toJS()
      ).toEqual({
        incident: {
          category: 'Overlast in de openbare ruimte',
          subcategory: 'Honden(poep)'
        }
      });
    });
  });

  describe('SET_PRIORITY', () => {
    it('sets priority', () => {
      expect(
        incidentContainerReducer(fromJS({}), {
          type: SET_PRIORITY,
          payload: {
            _signal: 666,
            priority: 'normal'
          }
        }).toJS()
      ).toEqual({
        priority: {
          _signal: 666,
          priority: 'normal'
        }
      });
    });
  });

  describe('SET_PRIORITY_SUCCESS', () => {
    it('sets priority', () => {
      expect(
        incidentContainerReducer(fromJS({}), {
          type: SET_PRIORITY_SUCCESS
        }).toJS()
      ).toEqual({
        priority: {}
      });
    });
  });
});
