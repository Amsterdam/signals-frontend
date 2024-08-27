import overlastVanEnDoorPersonenOfGroepen from './overlast-van-en-door-personen-of-groepen'

describe('definition overlast-van-en-door-personen-of-groepen', () => {
  it('has a defined set of controls', () => {
    const keys = Object.keys(overlastVanEnDoorPersonenOfGroepen)

    expect(keys).toStrictEqual([
      'locatie',
      'dateTime',
      'extra_drugs_verkoop',
      'extra_drugs_verkoop_ja',
      'extra_personen_overig',
      'extra_personen_overig_vaker_momenten',
    ])
  })
})
