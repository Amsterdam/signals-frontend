import { rest, MockedRequest } from 'msw'
import { setupServer } from 'msw/node'
import fetchMock from 'jest-fetch-mock';

export const mockGet = <T>({ status, body }: {status: number, body: T}) => {
  server.use(
    rest.get(/localhost/, async (_req, res, ctx) => res(ctx.status(status), ctx.json(body)))
  );
};

import usersJSON from '../mocks/fixtures/users.json';

const apiBaseUrl = "http://localhost:8000";

const handlers = [
  rest.get(`${apiBaseUrl}/signals/v1/private/users?page=:page`, (req, res, ctx) => {
    const page = ((req.url.searchParams.get('page') as unknown) as number) ?? 1;
    const pageSize =  5;
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const response = {
      ...usersJSON,
      results: usersJSON.results.slice(start, end),
    };

    return res(ctx.status(200), ctx.json(response));
  }),
];

const server = setupServer(...handlers)

export { server, rest, MockedRequest, fetchMock }
