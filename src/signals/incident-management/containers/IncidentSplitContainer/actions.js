import {
  SPLIT_INCIDENT,
  SPLIT_INCIDENT_SUCCESS,
  SPLIT_INCIDENT_ERROR
} from './constants';

export function splitIncident(id) {
  return {
    type: SPLIT_INCIDENT,
    payload: id
  };
}

export function splitIncidentSuccess(incident) {
  return {
    type: SPLIT_INCIDENT_SUCCESS,
    payload: incident
  };
}

export function splitIncidentError(error) {
  return {
    type: SPLIT_INCIDENT_ERROR,
    payload: error
  };
}
