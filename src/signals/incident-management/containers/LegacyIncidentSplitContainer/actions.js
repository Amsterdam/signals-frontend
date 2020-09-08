import {
  SPLIT_INCIDENT,
  SPLIT_INCIDENT_SUCCESS,
  SPLIT_INCIDENT_ERROR,
} from './constants';

export function splitIncident(payload) {
  return {
    type: SPLIT_INCIDENT,
    payload,
  };
}

export function splitIncidentSuccess(result) {
  return {
    type: SPLIT_INCIDENT_SUCCESS,
    payload: result,
  };
}

export function splitIncidentError(error) {
  return {
    type: SPLIT_INCIDENT_ERROR,
    payload: error,
  };
}
