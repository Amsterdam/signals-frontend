import {
  SPLIT_INCIDENT
} from './constants';

export function splitIncident(id) {
  return {
    type: SPLIT_INCIDENT,
    payload: id
  };
}

// export function requestIncidentSuccess(incident) {
//   return {
//     type: REQUEST_INCIDENT_SUCCESS,
//     payload: incident
//   };
// }

// export function requestIncidentError(error) {
//   return {
//     type: REQUEST_INCIDENT_ERROR,
//     payload: error
//   };
// }
