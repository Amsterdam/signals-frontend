import {
  REQUEST_INCIDENTS,
  REQUEST_INCIDENTS_SUCCESS,
  REQUEST_INCIDENTS_ERROR,
  INCIDENT_SELECTED,
  FILTER_INCIDENTS_CHANGED
} from './constants';

import {
  requestIncidents,
  requestIncidentsSuccess,
  requestIncidentsError,
  incidentSelected,
  filterIncidentsChanged
} from './actions';


const TestActionCreator = (action, actionType, payload) => {
  const expected = {
    type: actionType,
    payload
  };
  expect(action(payload)).toEqual(expected);
};

describe.only('OverviewPage actions', () => {
  it.only('has a type of DEFAULT_ACTION', () => {
    const payload = { prop: {} };
    TestActionCreator(requestIncidents, REQUEST_INCIDENTS, payload);
    TestActionCreator(requestIncidentsSuccess, REQUEST_INCIDENTS_SUCCESS, payload);
    TestActionCreator(requestIncidentsError, REQUEST_INCIDENTS_ERROR, payload);
    TestActionCreator(incidentSelected, INCIDENT_SELECTED, payload);
    TestActionCreator(filterIncidentsChanged, FILTER_INCIDENTS_CHANGED, payload);
  });
});
