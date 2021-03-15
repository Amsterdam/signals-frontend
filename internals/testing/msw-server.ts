import { rest, MockedRequest } from 'msw';
import { setupServer } from 'msw/node';
import fetchMock from 'jest-fetch-mock';

import usersFixture from '../mocks/fixtures/users.json';
import departmentsFixture from '../mocks/fixtures/departments.json';
import autocompleteUsernames from '../mocks/fixtures/autocomplete-usernames.json';

const [, userAscAeg, userAsc, userAeg, userTho] = usersFixture.results;
const departmentAscCode = departmentsFixture.results[0].code;
const departmentAegCode = departmentsFixture.results[1].code;
const departmentThoCode = departmentsFixture.results[11].code;

export const mockGet = <T>(status: number, body: T) => {
  server.use(rest.get(/localhost/, async (_req, res, ctx) => res(ctx.status(status), ctx.json(body))));
};

const apiBaseUrl = 'http://localhost:8000';

const getUsersFilteredByDepartmentCodes = (departmentCodes: string[]) => {
  if (JSON.stringify(departmentCodes) === JSON.stringify([departmentAscCode, departmentAegCode])) {
    return [userAscAeg, userAsc, userAeg];
  }
  if (JSON.stringify(departmentCodes) == JSON.stringify([departmentAscCode])) {
    return [userAscAeg, userAsc];
  }
  if (JSON.stringify(departmentCodes) == JSON.stringify([departmentThoCode])) {
    return [userTho];
  }
  if (departmentCodes.length) {
    return [];
  }
  return usersFixture.results;
};

const handlers = [
  rest.get(`${apiBaseUrl}/signals/v1/private/autocomplete/usernames`, (req, res, ctx) => {
    const departmentCodes = req.url.searchParams.getAll('profile_department_code');
    const results = autocompleteUsernames.results.filter(({ username }) =>
      departmentCodes.find(code => username.includes(code.toLowerCase()))
    );
    const data: typeof autocompleteUsernames = { ...autocompleteUsernames, results, count: results.length };

    return res(ctx.status(200), ctx.json(data));
  }),

  rest.get(`${apiBaseUrl}/signals/v1/private/users`, (req, res, ctx) => {
    const departmentCodes = req.url.searchParams.getAll('profile_department_code');
    const filtered = getUsersFilteredByDepartmentCodes(departmentCodes);
    const page = parseInt(req.url.searchParams.get('page') ?? '1');
    const pageSize = parseInt(req.url.searchParams.get('page_size') ?? '5');
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const results = filtered.slice(start, end);
    const response = {
      ...usersFixture,
      count: usersFixture.count,
      results,
    };

    return res(ctx.status(200), ctx.json(response));
  }),
];

const server = setupServer(...handlers);

export { server, rest, MockedRequest, fetchMock };
