import { rest, MockedRequest } from 'msw';
import { setupServer } from 'msw/node';
import fetchMock from 'jest-fetch-mock';

import usersJSON from '../mocks/fixtures/users.json';

export const mockGet = <T>({ status, body }: { status: number; body: T }) => {
  server.use(rest.get(/localhost/, async (_req, res, ctx) => res(ctx.status(status), ctx.json(body))));
};

const apiBaseUrl = 'http://localhost:8000';

const handlers = [
  rest.get(`${apiBaseUrl}/signals/v1/private/users`, (req, res, ctx) => {
    const page = parseInt(req.url.searchParams.get('page') ?? '1');
    const pageSize = parseInt(req.url.searchParams.get('page_size') ?? '5');
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const results = usersJSON.results.slice(start, end);
    const response = {
      ...usersJSON,
      count: results.length,
      results,
    };

    return res(ctx.status(200), ctx.json(response));
  }),
];

const server = setupServer(...handlers);

export { server, rest, MockedRequest, fetchMock };
