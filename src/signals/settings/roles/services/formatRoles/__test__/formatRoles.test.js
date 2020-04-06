import roles from 'utils/__tests__/fixtures/roles.json';

import formatRoles from '..';

describe('formatRoles service', () => {
  it('should format roles', () => {
    expect(formatRoles(roles.list)).toEqual([
      {
        id: 2,
        Naam: 'Behandelaar',
        Rechten: 'Can read from SIA, Can change the status of a signal, Can create new signals, Can create notes for signals, Can split a signal into a parent with X children, Can write to SIA',
      },
      {
        id: 3,
        Naam: 'Coördinator',
        Rechten: 'Can read from SIA, Can change the category of a signal, Can change the status of a signal, Can create new signals, Can create notes for signals, Can split a signal into a parent with X children, Can write to SIA',
      },
      {
        id: 20,
        Naam: 'Extern Systeem',
        Rechten: 'Can read from SIA, Can change the status of a signal, Can create new signals, Can create notes for signals, Can write to SIA',
      },
      {
        id: 30,
        Naam: 'Hele beperkte rol',
        Rechten: 'Can create new signals',
      },
      {
        id: 1,
        Naam: 'Monitor',
        Rechten: 'View all categories (this will override the category permission based on the user/department relation), Can read from SIA, Can create notes for signals, Can write to SIA',
      },
      {
        id: 26,
        Naam: 'Nieuwe rollen, nieuwe kansen',
        Rechten: 'Can add note, Can add priority, Can read from SIA, Can create new signals, Can export signals, Can write to SIA, Push to Sigmax/CityControl',
      },
      {
        id: 19,
        Naam: 'Regievoerder',
        Rechten: 'View all categories (this will override the category permission based on the user/department relation), Can read from SIA, Can change the category of a signal, Can change the status of a signal, Can create new signals, Can create notes for signals, Can split a signal into a parent with X children, Can write to SIA, Push to Sigmax/CityControl',
      },
      {
        id: 22,
        Naam: 'Regievoerder Plus',
        Rechten: 'Can read from SIA, Can change the category of a signal, Can change the status of a signal, Can create new signals, Can create notes for signals, Can export signals, Can create reports for signals, Can split a signal into a parent with X children, Can write to SIA, Push to Sigmax/CityControl, Can write StatusMessageTemplates to SIA',
      },
      { id: 28, Naam: 'Test', Rechten: 'Can create notes for signals' },
    ]
    );
  });
});
