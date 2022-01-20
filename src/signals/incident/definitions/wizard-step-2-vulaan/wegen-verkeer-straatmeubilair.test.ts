import wegenVerkeerStraatMeubilair from './wegen-verkeer-straatmeubilair'

describe('definition wegen-verkeer-straatmeubilair', () => {
  it('has a defined set of controls', () => {
    const keys = Object.keys(wegenVerkeerStraatMeubilair)

    expect(keys).toStrictEqual([
      'location',
      'extra_onderhoud_stoep_straat_en_fietspad',
      'extra_wegen_gladheid',
      'extra_verkeerslicht_welk',
      'extra_verkeerslicht',
      'extra_verkeerslicht_gevaar',
      'extra_verkeerslicht_probleem_voetganger',
      'extra_verkeerslicht_probleem_fiets_auto',
      'extra_verkeerslicht_probleem_bus_tram',
      'extra_verkeerslicht_nummer',
      'extra_fietsrek_aanvragen',
      'extra_fietsrek_aanvraag',
    ])
  })
})
