import overlastBedrijvenEnHoreca from './overlast-bedrijven-en-horeca'

describe('definition overlast-bedrijven-en-horeca', () => {
  it('has a defined set of controls', () => {
    const keys = Object.keys(overlastBedrijvenEnHoreca)

    expect(keys).toStrictEqual([
      'locatie',
      'dateTime',
      'extra_bedrijven_horeca_wat',
      'extra_bedrijven_horeca_naam',
      'extra_bedrijven_horeca_adres',
      'extra_bedrijven_horeca_muziek_direct_naast',
      'extra_bedrijven_horeca_muziek_ramen_dicht',
      'extra_bedrijven_horeca_muziek_ramen_dicht_onderneming',
      'extra_bedrijven_horeca_muziek_ramen_dicht_onderneming_lang',
      'extra_bedrijven_horeca_muziek_evenement',
      'extra_bedrijven_horeca_muziek_evenement_einde',
      'extra_bedrijven_horeca_installaties',
      'extra_bedrijven_horeca_personen',
      'extra_bedrijven_horeca_terrassen',
      'extra_bedrijven_horeca_stank',
      'extra_bedrijven_horeca_stank_oorzaak',
      'extra_bedrijven_horeca_stank_weer',
      'extra_bedrijven_horeca_stank_ramen',
      'extra_bedrijven_horeca_vaker',
      'extra_bedrijven_horeca_tijdstippen',
      'extra_bedrijven_horeca_muziek_geluidmeting_muziek',
      'extra_bedrijven_horeca_muziek_geluidmeting_installaties',
      'extra_bedrijven_horeca_muziek_geluidmeting_overige',
      'extra_bedrijven_horeca_muziek_geluidmeting_caution',
      'extra_bedrijven_horeca_muziek_geluidmeting_ja',
      'extra_bedrijven_horeca_muziek_geluidmeting_ja_nietnu',
      'extra_bedrijven_horeca_muziek_geluidmeting_nee',
      'extra_bedrijven_horeca_caution',
    ])
  })
})
