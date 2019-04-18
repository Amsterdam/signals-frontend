import {
  REQUEST_INCIDENT, REQUEST_INCIDENT_SUCCESS, REQUEST_INCIDENT_ERROR,
  DISMISS_SPLIT_NOTIFICATION,
  PATCH_INCIDENT, PATCH_INCIDENT_SUCCESS, PATCH_INCIDENT_ERROR
} from './constants';

export function requestIncident(id) {
  return {
    type: REQUEST_INCIDENT,
    payload: id
  };
}

export function requestIncidentSuccess(incident) {
  return {
    type: REQUEST_INCIDENT_SUCCESS,
    payload: incident
  };
}

export function requestIncidentError(error) {
  return {
    type: REQUEST_INCIDENT_ERROR,
    payload: error
  };
}

export function dismissSplitNotification() {
  return {
    type: DISMISS_SPLIT_NOTIFICATION
  };
}

export function patchIncident(patch) {
  return {
    type: PATCH_INCIDENT,
    payload: patch
  };
}

export function patchIncidentSuccess(patching) {
  return {
    type: PATCH_INCIDENT_SUCCESS,
    payload: patching
  };
}

export function patchIncidentError(error) {
  return {
    type: PATCH_INCIDENT_ERROR,
    payload: error
  };
}
