import straatverlichtingKlokkenControls from './straatverlichting-klokken'

describe('definition straatverlichting-klokken', () => {
  it('has a defined set of controls', () => {
    const keys = Object.keys(straatverlichtingKlokkenControls)

    expect(keys).toStrictEqual([
      // 'extra_kerstverlichting',
      'extra_straatverlichting_nummer',
      'extra_straatverlichting_probleem',
      'extra_straatverlichting',
      'extra_straatverlichting_gevaar',
      'extra_klok_nummer',
      'extra_klok_alert',
      'extra_klok',
      'extra_klok_gevaar',
      'extra_klok_probleem',
      'extra_klok_toelichting_overig',
    ])
  })
})
