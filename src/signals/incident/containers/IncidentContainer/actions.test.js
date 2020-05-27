import { testActionCreator } from 'test/utils';

import {
  UPDATE_INCIDENT,
  RESET_INCIDENT,
  CREATE_INCIDENT,
  CREATE_INCIDENT_SUCCESS,
  CREATE_INCIDENT_ERROR,
  GET_CLASSIFICATION,
  GET_CLASSIFICATION_SUCCESS,
  GET_CLASSIFICATION_ERROR,
  RESET_EXTRA_STATE,
} from './constants';

import {
  updateIncident,
  resetIncident,
  createIncident,
  createIncidentSuccess,
  createIncidentError,
  getClassification,
  getClassificationSuccess,
  getClassificationError,
  resetExtraState,
} from './actions';

describe('Incident container actions', () => {
  const incident = {
    text: 'foo',
    category: 'bar',
  };

  it('should dispatch update incident action', () => {
    testActionCreator(updateIncident, UPDATE_INCIDENT, incident);
  });

  it('should dispatch reset incident action', () => {
    testActionCreator(resetIncident, RESET_INCIDENT);
  });

  it('should dispatch create incident action', () => {
    testActionCreator(createIncident, CREATE_INCIDENT, incident);
  });

  it('should dispatch create incident success action', () => {
    testActionCreator(createIncidentSuccess, CREATE_INCIDENT_SUCCESS, incident);
  });

  it('should dispatch create incident error action', () => {
    testActionCreator(createIncidentError, CREATE_INCIDENT_ERROR);
  });

  it('should dispatch get classification action', () => {
    testActionCreator(getClassification, GET_CLASSIFICATION, 'poep');
  });

  it('should dispatch classification success action', () => {
    const payload = {
      category: {
        main: [],
        sub: [],
      },
    };
    testActionCreator(getClassificationSuccess, GET_CLASSIFICATION_SUCCESS, payload);
  });

  it('should dispatch classification error action', () => {
    testActionCreator(getClassificationError, GET_CLASSIFICATION_ERROR);
  });

  test('resetExtraState', () => {
    expect(resetExtraState()).toEqual({
      type: RESET_EXTRA_STATE,
    });
  });
});
