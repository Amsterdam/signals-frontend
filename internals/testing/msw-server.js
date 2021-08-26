// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 Gemeente Amsterdam
const { rest, MockedRequest } = require('msw')
const { setupServer } = require('msw/node')
const incidentFixture = require('utils/__tests__/fixtures/incident.json')
const incidentHistoryFixture = require('utils/__tests__/fixtures/incidentHistory.json')

const incidentContextFixture = require('../mocks/fixtures/context.json')
const incidentAttachmentsFixture = require('../mocks/fixtures/attachments.json')
const incidentChildrenFixture = require('../mocks/fixtures/children.json')
const incidentReporterFixture = require('../mocks/fixtures/reporter.json')
const usersFixture = require('../mocks/fixtures/users.json')
const departmentsFixture = require('../mocks/fixtures/departments.json')
const autocompleteUsernames = require('../mocks/fixtures/autocomplete-usernames.json')
const statusMessageTemplatesFixture = require('../mocks/fixtures/status-message-templates.json')
const incidentContextNearGeographyFixture = require('../mocks/fixtures/incident-context-near-geography.json')
const reportsFixture = require('../mocks/fixtures/reports.json')
const qaSessionFixture = require('../mocks/fixtures/qa-session.json')
const qaQuestionnaireFixture = require('../mocks/fixtures/qa-questionnaire.json')
const qaAnswerFixture = require('../mocks/fixtures/qa-answer.json')
const qaSubmitFixture = require('../mocks/fixtures/qa-submit.json')
const publicIncidentFixture = require('../mocks/fixtures/public-incident.json')

const [, userAscAeg, userAsc, userAeg, userTho] = usersFixture.results
const departmentAscCode = departmentsFixture.results[0].code
const departmentAegCode = departmentsFixture.results[1].code
const departmentThoCode = departmentsFixture.results[11].code

// interface MockRequestHandlerArgs {
//   status?: number
//   body: any
//   url?: string | RegExp
//   method?: 'get' | 'patch' | 'post'
// }

const mockRequestHandler = ({
  status = 200,
  url = /localhost/,
  method = 'get',
  body,
}) => {
  server.use(
    rest[method](url, async (_req, res, ctx) =>
      res(ctx.status(status), ctx.json(body))
    )
  )
}

const apiBaseUrl = 'http://localhost:8000'

const getUsersFilteredByDepartmentCodes = (departmentCodes) => {
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

const handleNotImplemented = (req, res, ctx) => {
  const message = `Msw - not implemented: ${req.method} to ${req.url.href}`

  console.error(message)
  res(ctx.status(500, message))
}

const handlers = [
  // GET
  rest.get(
    `${apiBaseUrl}/signals/v1/private/autocomplete/usernames`,
    (req, res, ctx) => {
      const departmentCodes = req.url.searchParams.getAll(
        'profile_department_code'
      )
      const results = autocompleteUsernames.results.filter(({ username }) =>
        departmentCodes.find((code) => username.includes(code.toLowerCase()))
      )
      const data = {
        ...autocompleteUsernames,
        results,
        count: results.length,
      }

      return res(ctx.status(200), ctx.json(data))
    }
  ),

  rest.get(`${apiBaseUrl}/signals/v1/private/users`, (req, res, ctx) => {
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

  rest.get(
    `${apiBaseUrl}/signals/v1/private/signals/:incidentId`,
    (_req, res, ctx) => res(ctx.status(200), ctx.json(incidentFixture))
  ),

  rest.get(
    `${apiBaseUrl}/signals/v1/private/signals/:incidentId/attachments`,
    (_req, res, ctx) =>
      res(ctx.status(200), ctx.json(incidentAttachmentsFixture))
  ),

  rest.get(
    `${apiBaseUrl}/signals/v1/private/signals/:incidentId/children`,
    (_req, res, ctx) => res(ctx.status(200), ctx.json(incidentChildrenFixture))
  ),

  rest.get(
    `${apiBaseUrl}/signals/v1/private/signals/:incidentId/history`,
    (_req, res, ctx) => res(ctx.status(200), ctx.json(incidentHistoryFixture))
  ),

  rest.get(
    `${apiBaseUrl}/signals/v1/private/signals/:incidentId/context/near/geography`,
    (_req, res, ctx) =>
      res(ctx.status(200), ctx.json(incidentContextNearGeographyFixture))
  ),

  rest.get(
    `${apiBaseUrl}/signals/v1/private/signals/:incidentId/context/reporter`,
    (_req, res, ctx) => res(ctx.status(200), ctx.json(incidentReporterFixture))
  ),

  rest.get(
    `${apiBaseUrl}/signals/v1/private/signals/:incidentId/context`,
    (_req, res, ctx) => res(ctx.status(200), ctx.json(incidentContextFixture))
  ),

  rest.get(
    `${apiBaseUrl}/signals/v1/private/reports/signals/*`,
    (_req, res, ctx) => res(ctx.status(200), ctx.json(reportsFixture))
  ),

  rest.get(
    `${apiBaseUrl}/signals/v1/public/qa/sessions/:uuid`,
    (req, res, ctx) => {
      switch (req.params.uuid) {
        case 'locked-session':
          return res(
            ctx.status(410),
            ctx.json({
              detail: 'Already used!',
            })
          )

        case 'expired-session':
          return res(ctx.status(410), ctx.json({ detail: 'Expired!' }))

        case 'invalid-session':
          return res(
            ctx.status(500),
            ctx.json({ detail: "['‘incident-session’ is geen geldige UUID.']" })
          )

        default:
          return res(ctx.status(200), ctx.json(qaSessionFixture))
      }
    }
  ),

  rest.get(
    `${apiBaseUrl}/signals/v1/public/qa/questionnaires/:uuid`,
    (_req, res, ctx) => res(ctx.status(200), ctx.json(qaQuestionnaireFixture))
  ),

  rest.get(`${apiBaseUrl}/signals/v1/public/signals/:uuid`, (_req, res, ctx) =>
    res(ctx.status(200), ctx.json(publicIncidentFixture))
  ),

  rest.get(/status-message-templates/, (_req, res, ctx) =>
    res(ctx.status(200), ctx.json(statusMessageTemplatesFixture))
  ),

  // PATCH
  rest.patch(
    `${apiBaseUrl}/signals/v1/private/signals/${incidentFixture.id}`,
    (_req, res, ctx) => res(ctx.status(200), ctx.json(incidentFixture))
  ),

  // POST
  rest.post(
    `${apiBaseUrl}/signals/v1/public/qa/questions/:uuid/answer`,
    (_req, res, ctx) => res(ctx.status(200), ctx.json(qaAnswerFixture))
  ),

  rest.post(
    `${apiBaseUrl}/signals/v1/public/qa/sessions/:uuid/submit`,
    (_req, res, ctx) => res(ctx.status(200), ctx.json(qaSubmitFixture))
  ),

  rest.post(
    `${apiBaseUrl}/signals/v1/public/signals/:uuid/attachments`,
    (_req, res, ctx) => res(ctx.status(200))
  ),

  // FALLBACK
  rest.get('*', handleNotImplemented),
  rest.patch('*', handleNotImplemented),
  rest.post('*', handleNotImplemented),
  rest.put('*', handleNotImplemented),
  rest.delete('*', handleNotImplemented),
]

const server = setupServer(...handlers)

module.exports = {
  server,
  rest,
  MockedRequest,
  apiBaseUrl,
  mockRequestHandler,
}
