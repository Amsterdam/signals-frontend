import overlastBedrijvenEnHoreca from './overlast-bedrijven-en-horeca'

describe('definition overlast-bedrijven-en-horeca', () => {
  it('has a defined set of controls', () => {
    const keys = Object.keys(overlastBedrijvenEnHoreca)

    expect(keys).toStrictEqual([
      'locatie',
      'dateTime',
      'dateTimePersonenOverlast',
      'extra_personen_overig',
      'extra_bedrijven_horeca_frequentie',
      'extra_bedrijven_horeca_moment',
      'extra_bedrijven_horeca_wat',
      'extra_bedrijven_horeca_naam_bedrijf',
      'extra_bedrijven_horeca_naam_evenemet',
      'extra_bedrijven_horeca_wie_of_wat',
      'extra_bedrijven_horeca_adres',
      'extra_bedrijven_horeca_muziek_direct_naast',
      'extra_bedrijven_horeca_muziek_ramen_dicht_onderneming',
      'extra_bedrijven_horeca_muziek_evenement',
      'extra_bedrijven_horeca_personen',
      'extra_bedrijven_horeca_stank_ramen',
      'extra_bedrijven_horeca_doorsturen_melding',
      'extra_bedrijven_horeca_caution',
      'extra_bedrijven_horeca_doorsturen_melding_geluidsoverlast_muziek',
      'extra_bedrijven_horeca_caution_geluidsoverlast_muziek',
    ])
  })
})
