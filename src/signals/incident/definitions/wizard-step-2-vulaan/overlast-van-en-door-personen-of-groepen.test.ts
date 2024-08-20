import overlastVanEnDoorPersonenOfGroepen from './overlast-van-en-door-personen-of-groepen'

describe('definition overlast-van-en-door-personen-of-groepen', () => {
  it('has a defined set of controls', () => {
    const keys = Object.keys(overlastVanEnDoorPersonenOfGroepen)

    expect(keys).toStrictEqual([
      'locatie',
      'dateTime',
      'dateTime_Thor',
      'extra_drugs_verkoop',
      'extra_drugs_verkoop_ja',
      'extra_jongeren_text',
      'extra_personen_overig',
      'extra_personen_overig_vaker',
      'extra_personen_overig_vaker_momenten',
    ])
  })
})
