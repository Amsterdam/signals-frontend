import overlastInDeOpenbareRuimte from './overlast-in-de-openbare-ruimte'

describe('definition overlast-in-de-openbare-ruimte', () => {
  it('has a defined set of controls', () => {
    const keys = Object.keys(overlastInDeOpenbareRuimte)

    expect(keys).toStrictEqual([
      'locatie',
      'dateTime',
      'extra_auto_scooter_bromfietswrak',
      'extra_fietswrak',
      'extra_parkeeroverlast',
    ])
  })
})
