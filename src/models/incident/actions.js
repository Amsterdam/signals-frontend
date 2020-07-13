import {
  REQUEST_INCIDENT, REQUEST_INCIDENT_SUCCESS, REQUEST_INCIDENT_ERROR,
  DISMISS_ERROR,
  REQUEST_ATTACHMENTS, REQUEST_ATTACHMENTS_SUCCESS, REQUEST_ATTACHMENTS_ERROR,
  REQUEST_DEFAULT_TEXTS, REQUEST_DEFAULT_TEXTS_SUCCESS, REQUEST_DEFAULT_TEXTS_ERROR,
} from './constants';

export function requestIncident(id) {
  return {
    type: REQUEST_INCIDENT,
    payload: id,
  };
}

export function requestIncidentSuccess(incident) {
  return {
    type: REQUEST_INCIDENT_SUCCESS,
    payload: incident,
  };
}

export function requestIncidentError(error) {
  return {
    type: REQUEST_INCIDENT_ERROR,
    payload: error,
  };
}

export function dismissError() {
  return {
    type: DISMISS_ERROR,
  };
}

export function requestAttachments(id) {
  return {
    type: REQUEST_ATTACHMENTS,
    payload: id,
  };
}

export function requestAttachmentsSuccess(files) {
  return {
    type: REQUEST_ATTACHMENTS_SUCCESS,
    payload: files,
  };
}

export function requestAttachmentsError(error) {
  return {
    type: REQUEST_ATTACHMENTS_ERROR,
    payload: error,
  };
}

export function requestDefaultTexts(payload) {
  return {
    type: REQUEST_DEFAULT_TEXTS,
    payload,
  };
}

export function requestDefaultTextsSuccess(payload) {
  return {
    type: REQUEST_DEFAULT_TEXTS_SUCCESS,
    payload,
  };
}

export function requestDefaultTextsError(error) {
  return {
    type: REQUEST_DEFAULT_TEXTS_ERROR,
    payload: error,
  };
}
