// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 Gemeente Amsterdam
import fetchMock from 'jest-fetch-mock'
import type { MockedRequest, ResponseResolver } from 'msw'
import { rest } from 'msw'
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
    rest[method](url, async (_req, res, ctx) =>
      res(ctx.status(status), ctx.json(body))
    )
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

const handleNotImplemented: ResponseResolver = (req, res, ctx) => {
  const message = `Msw - not implemented: ${req.method} to ${req.url.href}`

  console.error(message)
  res(ctx.status(500, message))
}

const handlers = [
  // GET
  rest.get(API.AUTOCOMPLETE_USERNAMES, (req, res, ctx) => {
    const departmentCodes = req.url.searchParams.getAll(
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

    return res(ctx.status(200), ctx.json(data))
  }),

  rest.get(API.USERS, (req, res, ctx) => {
    const departmentCodes = req.url.searchParams.getAll(
      'profile_department_code'
    )
    const filtered = getUsersFilteredByDepartmentCodes(departmentCodes)
    const page = parseInt(req.url.searchParams.get('page') ?? '1')
    const pageSize = parseInt(req.url.searchParams.get('page_size') ?? '5')
    const start = (page - 1) * pageSize
    const end = start + pageSize
    const results = filtered.slice(start, end)
    const response = {
      ...usersFixture,
      count: usersFixture.count,
      results,
    }

    return res(ctx.status(200), ctx.json(response))
  }),

  rest.get(API.INCIDENT, (_req, res, ctx) =>
    res(ctx.status(200), ctx.json(incidentFixture))
  ),

  rest.get(API.INCIDENT_ATTACHMENTS, (_req, res, ctx) =>
    res(ctx.status(200), ctx.json(incidentAttachmentsFixture))
  ),

  rest.get(API.INCIDENT_CHILDREN, (_req, res, ctx) =>
    res(ctx.status(200), ctx.json(incidentChildrenFixture))
  ),

  rest.get(API.INCIDENT_HISTORY, (_req, res, ctx) =>
    res(ctx.status(200), ctx.json(incidentHistoryFixture))
  ),

  rest.get(API.INCIDENT_CONTEXT_GEOGRAPHY, (_req, res, ctx) =>
    res(ctx.status(200), ctx.json(incidentContextNearGeographyFixture))
  ),

  rest.get(API.INCIDENT_CONTEXT_REPORTER, (_req, res, ctx) =>
    res(ctx.status(200), ctx.json(incidentReporterFixture))
  ),

  rest.get(API.INCIDENT_CONTEXT, (_req, res, ctx) =>
    res(ctx.status(200), ctx.json(incidentContextFixture))
  ),

  rest.get(API.REPORTS, (_req, res, ctx) =>
    res(ctx.status(200), ctx.json(reportsFixture))
  ),

  rest.get(API.SIGNAL_REPORTER, (_req, res, ctx) =>
    res(ctx.status(200), ctx.json(signalReporterFixture))
  ),

  rest.get(API.STANDARD_TEXTS_SEARCH_ENDPOINT, (req, res, ctx) => {
    const queryString = req.url.searchParams.get('q')
    const pageNumber = req.url.searchParams.get('page')
    const status = req.url.searchParams.get('state')
    const isActive = req.url.searchParams.get('active')

    switch (status && isActive) {
      case 'm' && 'true':
        return res(ctx.status(200), ctx.json(multicaseFilter))
    }

    switch (status) {
      case 'm':
        return res(ctx.status(200), ctx.json(statusFilter))
    }

    switch (isActive) {
      case 'true':
        return res(ctx.status(200), ctx.json(activeFilter))
    }

    switch (queryString) {
      case '15':
        return res(ctx.status(200), ctx.json(page2))
      case 'qwerty':
        return res(ctx.status(200), ctx.json(noResult))
    }

    switch (pageNumber) {
      case '2':
        return res(ctx.status(200), ctx.json(page2))
      default:
        return res(ctx.status(200), ctx.json(standardTexts))
    }
  }),

  rest.get(API.STANDARD_TEXTS_ENDPOINT, (_, res, ctx) => {
    return res(ctx.status(200), ctx.json(standardTexts))
  }),

  rest.get(API.QA_SESSIONS, (req, res, ctx) => {
    switch (req.params.uuid) {
      case 'locked':
        return res(
          ctx.status(410),
          ctx.json({
            detail: 'Already used!',
          })
        )

      case 'invalidated':
        return res(
          ctx.status(500),
          ctx.json({
            detail:
              'Session invalidated is invalidated, associated signal not in state REACTIE_GEVRAAGD.',
          })
        )

      case 'expired':
        return res(ctx.status(410), ctx.json({ detail: 'Expired!' }))

      case 'invalid-uuid':
        return res(
          ctx.status(500),
          ctx.json({ detail: "['invalid-uuid’ is geen geldige UUID.']" })
        )
      case 'forward-to-external-questionnaire':
        return res(
          ctx.status(200),
          ctx.json(qaForwardToExternalQuestionnaireFixture)
        )

      default:
        return res(ctx.status(200), ctx.json(qaSessionFixture))
    }
  }),

  rest.get(API.QA_QUESTIONNAIRES, (_req, res, ctx) =>
    res(ctx.status(200), ctx.json(qaQuestionnaireFixture))
  ),

  rest.get(API.PUBLIC_INCIDENT, (_req, res, ctx) =>
    res(ctx.status(200), ctx.json(publicIncidentFixture))
  ),

  rest.get(API.REPORTS_OPEN, (_req, res, ctx) =>
    res(ctx.status(200), ctx.json(openSignalsReportFixture))
  ),

  rest.get(API.REPORTS_REOPEN_REQUESTED, (_req, res, ctx) =>
    res(ctx.status(200), ctx.json(reopenRequestedSignalsReportFixture))
  ),

  rest.get(API.STATUS_MESSAGE_TEMPLATES, (_req, res, ctx) =>
    res(ctx.status(200), ctx.json(statusMessageTemplatesFixture))
  ),

  rest.get(API.STANDARD_TEXTS_DETAIL_ENDPOINT, (_req, res, ctx) =>
    res(ctx.status(200), ctx.json(detail))
  ),

  // PATCH

  rest.patch(API.INCIDENT, (_req, res, ctx) =>
    res(ctx.status(200), ctx.json(incidentFixture))
  ),

  rest.patch(API.STANDARD_TEXTS_DETAIL_ENDPOINT, (_req, res, ctx) =>
    res(ctx.status(200), ctx.json(detail))
  ),

  // POST

  rest.post(API.EMAIL_VERIFICATION_ENDPOINT, (_req, res, ctx) =>
    res(ctx.status(200), ctx.json(null))
  ),

  rest.post(API.STANDARD_TEXTS_DETAIL_ENDPOINT, (_req, res, ctx) =>
    res(ctx.status(200), ctx.json(detail))
  ),

  rest.post(API.STANDARD_TEXTS_ENDPOINT, (_req, res, ctx) =>
    res(ctx.status(201), ctx.json(detailPost))
  ),

  rest.post(API.QA_ANSWER, (_req, res, ctx) =>
    res(ctx.status(200), ctx.json(qaAnswerFixture))
  ),

  rest.post(API.QA_ANSWERS, (_req, res, ctx) =>
    res(ctx.status(200), ctx.json(null))
  ),

  rest.post(API.QA_SESSIONS_ATTACHMENTS, (_req, res, ctx) =>
    res(ctx.status(200), ctx.json(null))
  ),

  rest.post(API.QA_SUBMIT, (_req, res, ctx) =>
    res(ctx.status(200), ctx.json(qaSubmitFixture))
  ),

  rest.post(API.PUBLIC_INCIDENT_ATTACHMENTS, (_req, res, ctx) =>
    res(ctx.status(200))
  ),

  rest.post(API.SIGNAL_REPORTER, (_req, res, ctx) => res(ctx.status(200))),

  rest.post(API.CANCEL_SIGNAL_REPORTER, (_req, res, ctx) =>
    res(ctx.status(200))
  ),

  // DELETE

  rest.delete(API.STANDARD_TEXTS_DETAIL_ENDPOINT, (_req, res, ctx) =>
    res(ctx.status(204), ctx.json(null))
  ),

  rest.delete(API.CATEGORIES_PRIVATE_ENDPOINT_ICON, (_req, res, ctx) =>
    res(ctx.status(204))
  ),

  // FALLBACK
  rest.get('*', handleNotImplemented),
  rest.patch('*', handleNotImplemented),
  rest.post('*', handleNotImplemented),
  rest.put('*', handleNotImplemented),
  rest.delete('*', handleNotImplemented),
]

const server = setupServer(...handlers)

export { server, rest, fetchMock }
export type { MockedRequest }
