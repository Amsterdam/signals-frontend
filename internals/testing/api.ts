const API_BASE_URL = 'http://localhost:8000/signals/v1'

export const AUTOCOMPLETE_USERNAMES = `${API_BASE_URL}/private/autocomplete/usernames`
export const USERS = `${API_BASE_URL}/private/users`
export const STATUS_MESSAGE_TEMPLATES = /status-message-templates/

export const QA_SESSIONS = `${API_BASE_URL}/public/qa/sessions/:uuid`
export const QA_SUBMIT = `${API_BASE_URL}/public/qa/sessions/:uuid/submit`
export const QA_SESSIONS_ATTACHMENTS = `${API_BASE_URL}/public/qa/sessions/:uuid/attachments`
export const QA_ANSWERS = `${API_BASE_URL}/public/qa/sessions/:uuid/answers`
export const QA_ANSWER = `${API_BASE_URL}/public/qa/questions/:uuid/answer`
export const QA_QUESTIONNAIRES = `${API_BASE_URL}/public/qa/questionnaires/:uuid`

export const REPORTS = `${API_BASE_URL}/private/reports/signals/*`
export const REPORTS_OPEN = /reports\/signals\/open/
export const REPORTS_REOPEN_REQUESTED = /reports\/signals\/reopen-requested/

export const PUBLIC_INCIDENT = `${API_BASE_URL}/public/signals/:uuid`
export const PUBLIC_INCIDENT_ATTACHMENTS = `${PUBLIC_INCIDENT}/attachments`

export const INCIDENT = `${API_BASE_URL}/private/signals/:incidentId`
export const INCIDENT_ATTACHMENTS = `${INCIDENT}/attachments`
export const INCIDENT_CHILDREN = `${INCIDENT}/children`
export const INCIDENT_HISTORY = `${INCIDENT}/history`
export const INCIDENT_CONTEXT = `${INCIDENT}/context`
export const INCIDENT_CONTEXT_GEOGRAPHY = `${INCIDENT}/context/near/geography`
export const INCIDENT_CONTEXT_REPORTER = `${INCIDENT}/context/reporter`
