// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 Gemeente Amsterdam
import fetchMock from 'jest-fetch-mock'
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'

import incidentFixture from 'utils/__tests__/fixtures/incident.json'
import incidentHistoryFixture from 'utils/__tests__/fixtures/incidentHistory.json'

import * as API from './api'
import incidentAttachmentsFixture from '../mocks/fixtures/attachments.json'
import autocompleteUsernames from '../mocks/fixtures/autocomplete-usernames.json'
import incidentChildrenFixture from '../mocks/fixtures/children.json'
import incidentContextFixture from '../mocks/fixtures/context.json'
import departmentsFixture from '../mocks/fixtures/departments.json'
import incidentContextNearGeographyFixture from '../mocks/fixtures/incident-context-near-geography.json'
import publicIncidentFixture from '../mocks/fixtures/public-incident.json'
import qaAnswerFixture from '../mocks/fixtures/qa-answer.json'
import qaForwardToExternalQuestionnaireFixture from '../mocks/fixtures/qa-forward-to-external-questionnaire.json'
import qaQuestionnaireFixture from '../mocks/fixtures/qa-questionnaire.json'
import qaSessionFixture from '../mocks/fixtures/qa-session.json'
import qaSubmitFixture from '../mocks/fixtures/qa-submit.json'
import openSignalsReportFixture from '../mocks/fixtures/report_signals-open.json'
import reopenRequestedSignalsReportFixture from '../mocks/fixtures/report_signals-reopen-requested.json'
import incidentReporterFixture from '../mocks/fixtures/reporter.json'
import reportsFixture from '../mocks/fixtures/reports.json'
import signalReporterFixture from '../mocks/fixtures/signal_reporter.json'
import {
  activeFilter,
  detail,
  detailPost,
  multicaseFilter,
  noResult,
  page2,
  standardTexts,
  statusFilter,
} from '../mocks/fixtures/standard-texts'
import statusMessageTemplatesFixture from '../mocks/fixtures/status-message-templates.json'
import usersFixture from '../mocks/fixtures/users.json'

const [, userAscAeg, userAsc, userAeg, userTho] = usersFixture.results
const departmentAscCode = departmentsFixture.results[0].code
const departmentAegCode = departmentsFixture.results[1].code
const departmentThoCode = departmentsFixture.results[11].code

interface MockRequestHandlerArgs {
  status?: number
  body: any
  url?: string | RegExp
  method?: 'get' | 'patch' | 'post' | 'head'
}

export const mockRequestHandler = ({
  status = 200,
  url = /localhost/,
  method = 'get',
  body,
}: MockRequestHandlerArgs) => {
  server.use(
    http[method](url, () => HttpResponse.json(body, { status: status }))
  )
}

const getUsersFilteredByDepartmentCodes = (departmentCodes: string[]) => {
  if (
    JSON.stringify(departmentCodes) ===
    JSON.stringify([departmentAscCode, departmentAegCode])
  ) {
    return [userAscAeg, userAsc, userAeg]
  }
  if (JSON.stringify(departmentCodes) == JSON.stringify([departmentAscCode])) {
    return [userAscAeg, userAsc]
  }
  if (JSON.stringify(departmentCodes) == JSON.stringify([departmentThoCode])) {
    return [userTho]
  }
  if (departmentCodes.length) {
    return []
  }
  return usersFixture.results
}

// TODO
const handleNotImplemented = ({ request }) => {
  const message = `Msw - not implemented: ${request.method} to ${request.url}`

  console.error(message)
  return HttpResponse.json(message, { status: 500 })
}

const handlers = [
  // GET
  http.get(API.AUTOCOMPLETE_USERNAMES, ({ request }) => {
    const reqUrl = new URL(request.url)

    const departmentCodes = reqUrl.searchParams.getAll(
      'profile_department_code'
    )
    const results = autocompleteUsernames.results.filter(({ username }) =>
      departmentCodes.find((code) => username.includes(code.toLowerCase()))
    )
    const data: typeof autocompleteUsernames = {
      ...autocompleteUsernames,
      results,
      count: results.length,
    }

    return HttpResponse.json(data)
  }),

  http.get(API.USERS, ({ request }) => {
    const reqUrl = new URL(request.url)

    const departmentCodes = reqUrl.searchParams.getAll(
      'profile_department_code'
    )
    const filtered = getUsersFilteredByDepartmentCodes(departmentCodes)
    const page = parseInt(reqUrl.searchParams.get('page') ?? '1')
    const pageSize = parseInt(reqUrl.searchParams.get('page_size') ?? '5')
    const start = (page - 1) * pageSize
    const end = start + pageSize
    const results = filtered.slice(start, end)
    const response = {
      ...usersFixture,
      count: usersFixture.count,
      results,
    }

    return HttpResponse.json(response)
  }),

  http.get(API.INCIDENT, () => HttpResponse.json(incidentFixture)),

  http.get(API.INCIDENT_ATTACHMENTS, () =>
    HttpResponse.json(incidentAttachmentsFixture)
  ),

  http.get(API.INCIDENT_CHILDREN, () =>
    HttpResponse.json(incidentChildrenFixture)
  ),

  http.get(API.INCIDENT_HISTORY, () =>
    HttpResponse.json(incidentHistoryFixture)
  ),

  http.get(API.INCIDENT_CONTEXT_GEOGRAPHY, () =>
    HttpResponse.json(incidentContextNearGeographyFixture)
  ),

  http.get(API.INCIDENT_CONTEXT_REPORTER, () =>
    HttpResponse.json(incidentReporterFixture)
  ),

  http.get(API.INCIDENT_CONTEXT, () =>
    HttpResponse.json(incidentContextFixture)
  ),

  http.get(API.REPORTS, () => HttpResponse.json(reportsFixture)),

  http.get(API.SIGNAL_REPORTER, () => HttpResponse.json(signalReporterFixture)),

  http.get(API.STANDARD_TEXTS_SEARCH_ENDPOINT, ({ request }) => {
    const reqUrl = new URL(request.url)

    const queryString = reqUrl.searchParams.get('q')
    const pageNumber = reqUrl.searchParams.get('page')
    const status = reqUrl.searchParams.get('state')
    const isActive = reqUrl.searchParams.get('active')

    switch (status && isActive) {
      case 'm' && 'true':
        return HttpResponse.json(multicaseFilter)
    }

    switch (status) {
      case 'm':
        return HttpResponse.json(statusFilter)
    }

    switch (isActive) {
      case 'true':
        return HttpResponse.json(activeFilter)
    }

    switch (queryString) {
      case '15':
        return HttpResponse.json(page2)
      case 'qwerty':
        return HttpResponse.json(noResult)
    }

    switch (pageNumber) {
      case '2':
        return HttpResponse.json(page2)
      default:
        return HttpResponse.json(standardTexts)
    }
  }),

  http.get(API.STANDARD_TEXTS_ENDPOINT, () => HttpResponse.json(standardTexts)),

  http.get(API.QA_SESSIONS, ({ params }) => {
    switch (params.uuid) {
      case 'locked':
        return HttpResponse.json(
          {
            detail: 'Already used!',
          },
          { status: 410 }
        )

      case 'invalidated':
        return HttpResponse.json(
          {
            detail:
              'Session invalidated is invalidated, associated signal not in state REACTIE_GEVRAAGD.',
          },
          { status: 500 }
        )

      case 'expired':
        return HttpResponse.json({ detail: 'Expired!' }, { status: 410 })

      case 'invalid-uuid':
        return HttpResponse.json(
          { detail: "['invalid-uuid’ is geen geldige UUID.']" },
          { status: 500 }
        )

      case 'forward-to-external-questionnaire':
        return HttpResponse.json(qaForwardToExternalQuestionnaireFixture)

      default:
        return HttpResponse.json(qaSessionFixture)
    }
  }),

  http.get(API.QA_QUESTIONNAIRES, () =>
    HttpResponse.json(qaQuestionnaireFixture)
  ),

  http.get(API.PUBLIC_INCIDENT, () => HttpResponse.json(publicIncidentFixture)),

  http.get(API.REPORTS_OPEN, () => HttpResponse.json(openSignalsReportFixture)),

  http.get(API.REPORTS_REOPEN_REQUESTED, () =>
    HttpResponse.json(reopenRequestedSignalsReportFixture)
  ),

  http.get(API.STATUS_MESSAGE_TEMPLATES, () =>
    HttpResponse.json(statusMessageTemplatesFixture)
  ),

  http.get(API.STANDARD_TEXTS_DETAIL_ENDPOINT, () => HttpResponse.json(detail)),

  // PATCH

  http.patch(API.INCIDENT, () => HttpResponse.json(incidentFixture)),

  http.patch(API.STANDARD_TEXTS_DETAIL_ENDPOINT, () =>
    HttpResponse.json(detail)
  ),

  // POST

  http.post(API.EMAIL_VERIFICATION_ENDPOINT, () => HttpResponse.json(null)),

  http.post(API.STANDARD_TEXTS_DETAIL_ENDPOINT, () =>
    HttpResponse.json(detail)
  ),

  http.post(API.STANDARD_TEXTS_ENDPOINT, () => HttpResponse.json(detailPost)),

  http.post(API.QA_ANSWER, () => HttpResponse.json(qaAnswerFixture)),

  http.post(API.QA_ANSWERS, () => HttpResponse.json(null)),

  http.post(API.QA_SESSIONS_ATTACHMENTS, () => HttpResponse.json(null)),

  http.post(API.QA_SUBMIT, () => HttpResponse.json(qaSubmitFixture)),

  http.post(API.PUBLIC_INCIDENT_ATTACHMENTS, () => HttpResponse.json()),

  http.post(API.SIGNAL_REPORTER, () => HttpResponse.json()),

  http.post(API.CANCEL_SIGNAL_REPORTER, () => HttpResponse.json()),

  // DELETE

  http.delete(API.STANDARD_TEXTS_DETAIL_ENDPOINT, () =>
    HttpResponse.json(null)
  ),

  http.delete(API.CATEGORIES_PRIVATE_ENDPOINT_ICON, () =>
    HttpResponse.json(null)
  ),

  // FALLBACK
  http.get('*', handleNotImplemented),
  http.patch('*', handleNotImplemented),
  http.post('*', handleNotImplemented),
  http.put('*', handleNotImplemented),
  http.delete('*', handleNotImplemented),
]

const server = setupServer(...handlers)

export { server, fetchMock }
