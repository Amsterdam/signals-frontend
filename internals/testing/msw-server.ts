// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 Gemeente Amsterdam
import { rest, MockedRequest, ResponseResolver } from 'msw'
import { setupServer } from 'msw/node'
import fetchMock from 'jest-fetch-mock'

import incidentFixture from 'utils/__tests__/fixtures/incident.json'
import incidentHistoryFixture from 'utils/__tests__/fixtures/incidentHistory.json'

import incidentContextFixture from '../mocks/fixtures/context.json'
import incidentAttachmentsFixture from '../mocks/fixtures/attachments.json'
import incidentChildrenFixture from '../mocks/fixtures/children.json'
import incidentReporterFixture from '../mocks/fixtures/reporter.json'
import usersFixture from '../mocks/fixtures/users.json'
import departmentsFixture from '../mocks/fixtures/departments.json'
import autocompleteUsernames from '../mocks/fixtures/autocomplete-usernames.json'
import statusMessageTemplatesFixture from '../mocks/fixtures/status-message-templates.json'
import incidentContextNearGeographyFixture from '../mocks/fixtures/incident-context-near-geography.json'
import reportsFixture from '../mocks/fixtures/reports.json'
import qaSessionFixture from '../mocks/fixtures/qa-session.json'
import qaQuestionnaireFixture from '../mocks/fixtures/qa-questionnaire.json'
import qaAnswerFixture from '../mocks/fixtures/qa-answer.json'
import qaSubmitFixture from '../mocks/fixtures/qa-submit.json'
import publicIncidentFixture from '../mocks/fixtures/public-incident.json'

const [, userAscAeg, userAsc, userAeg, userTho] = usersFixture.results
const departmentAscCode = departmentsFixture.results[0].code
const departmentAegCode = departmentsFixture.results[1].code
const departmentThoCode = departmentsFixture.results[11].code

interface MockRequestHandlerArgs {
  status?: number
  body: any
  url?: string | RegExp
  method?: 'get' | 'patch' | 'post'
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

export const apiBaseUrl = 'http://localhost:8000'

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
  rest.get(
    `${apiBaseUrl}/signals/v1/private/autocomplete/usernames`,
    (req, res, ctx) => {
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

export { server, rest, MockedRequest, fetchMock }
