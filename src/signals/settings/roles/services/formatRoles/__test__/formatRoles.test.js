import roles from 'utils/__tests__/fixtures/roles.json';

import formatRoles from '..'

describe('formatRoles service', () => {
  it('should format roles', () => {
    expect(formatRoles(roles)).toEqual([{
      id: 2,
      Naam: 'behandelaars',
      Rechten: 'signals | signal | Can read from SIA, signals | signal | Can change the status of a signal',
    }, {
      id: 3,
      Naam: 'coordinatoren',
      Rechten: '',
    }]);
  });
});