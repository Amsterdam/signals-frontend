import formatRoles from '..'

describe('formatRoles service', () => {
  const roles = [
    {
      _display: 'behandelaars',
      id: 2,
      name: 'behandelaars',
      permissions: [
        {
          _display: 'signals | signal | Can read from SIA',
          codename: 'sia_read',
        },
        {
          _display: 'signals | signal | Can change the status of a signal',
          codename: 'sia_signal_change_status',
        },
      ],
    },
    {
      _display: 'coordinatoren',
      id: 3,
      name: 'coordinatoren',
      permissions: [],
    },
  ];

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