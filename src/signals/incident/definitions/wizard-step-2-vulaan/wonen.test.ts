import wonen from './wonen'

describe('definition wonen', () => {
  it('has a defined set of controls', () => {
    const keys = Object.keys(wonen)

    expect(keys).toStrictEqual([
      'locatie',
      'wonen_overig',
      'extra_wonen_woningdelen_vermoeden',
      'extra_wonen_woningdelen_eigenaar',
      'extra_wonen_woningdelen_adres_huurder',
      'extra_wonen_woningdelen_aantal_personen',
      'extra_wonen_woningdelen_bewoners_familie',
      'extra_wonen_woningdelen_samenwonen',
      'extra_wonen_woningdelen_wisselende_bewoners',
      'extra_wonen_woningdelen_iemand_aanwezig',
      'extra_wonen_onderhuur_aantal_personen',
      'extra_wonen_onderhuur_bewoners_familie',
      'extra_wonen_onderhuur_naam_bewoners',
      'extra_wonen_onderhuur_woon_periode',
      'extra_wonen_onderhuur_iemand_aanwezig',
      'extra_wonen_onderhuur_naam_huurder',
      'extra_wonen_onderhuur_huurder_woont',
      'extra_wonen_onderhuur_adres_huurder',
      'extra_wonen_leegstand_naam_eigenaar',
      'extra_wonen_leegstand_periode',
      'extra_wonen_leegstand_woning_gebruik',
      'extra_wonen_leegstand_naam_persoon',
      'extra_wonen_leegstand_activiteit_in_woning',
      'extra_wonen_leegstand_iemand_aanwezig',
      'dateTime',
      'extra_wonen_vakantieverhuur_toeristen_aanwezig',
      'extra_wonen_vakantieverhuur_aantal_mensen',
      'extra_wonen_vakantieverhuur_hoe_vaak',
      'extra_wonen_vakantieverhuur_wanneer',
      'extra_wonen_vakantieverhuur_bewoning',
      'extra_wonen_vakantieverhuur_naam_bewoner',
      'extra_wonen_vakantieverhuur_online_aangeboden',
      'extra_wonen_vakantieverhuur_link_advertentie',
      'extra_wonen_vakantieverhuur_footer',
      'extra_wonen_woonkwaliteit_direct_gevaar',
      'extra_wonen_woonkwaliteit_direct_gevaar_alert',
      'extra_wonen_woonkwaliteit_gemeld_bij_eigenaar',
      'extra_wonen_woonkwaliteit_direct_gevaar_ja',
      'extra_wonen_woonkwaliteit_bewoner',
      'extra_wonen_woonkwaliteit_namens_bewoner',
      'extra_wonen_woonkwaliteit_toestemming_contact',
      'extra_wonen_woonkwaliteit_toestemming_contact_ja',
      'extra_wonen_woonkwaliteit_geen_contact',
    ])
  })
})
