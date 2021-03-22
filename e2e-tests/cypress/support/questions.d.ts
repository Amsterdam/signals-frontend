declare namespace questions {

  export interface ExtraAfval {
    label: string;
    shortLabel: string;
  }

  export interface ExtraContainerKind {
    subtitle: string;
    label: string;
    shortLabel: string;
  }

  export interface ExtraContainerNumber {
    label: string;
    shortLabel: string;
  }

  export interface Afval {
    extra_afval: ExtraAfval;
    extra_container_kind: ExtraContainerKind;
    extra_container_number: ExtraContainerNumber;
  }

  export interface Values {
    horecabedrijf: string;
    ander_soort_bedrijf: string;
    evenement_festival_markt: string;
    iets_anders: string;
  }

  export interface Answers {
    horecabedrijf: string;
    ander_soort_bedrijf: string;
    evenement_festival_markt: string;
    iets_anders: string;
  }

  export interface ExtraBedrijvenHorecaWat {
    label: string;
    shortLabel: string;
    values: Values;
    answers: Answers;
  }

  export interface ExtraBedrijvenHorecaNaam {
    label: string;
    shortLabel: string;
  }

  export interface ExtraBedrijvenHorecaAdres {
    label: string;
    shortLabel: string;
  }

  export interface Values2 {
    naast: string;
    boven: string;
    onder: string;
    nee: string;
  }

  export interface Answers2 {
    naast: string;
    boven: string;
    onder: string;
    nee: string;
  }

  export interface ExtraBedrijvenHorecaMuziekDirectNaast {
    label: string;
    shortLabel: string;
    values: Values2;
    answers: Answers2;
  }

  export interface Values3 {
    ja: string;
    nee: string;
  }

  export interface Answers3 {
    ja: string;
    nee: string;
  }

  export interface ExtraBedrijvenHorecaMuziekRamenDicht {
    label: string;
    shortLabel: string;
    values: Values3;
    answers: Answers3;
  }

  export interface Values4 {
    ja: string;
    nee: string;
  }

  export interface Answers4 {
    ja: string;
    nee: string;
  }

  export interface ExtraBedrijvenHorecaMuziekRamenDichtOnderneming {
    label: string;
    shortLabel: string;
    values: Values4;
    answers: Answers4;
  }

  export interface Values5 {
    kort: string;
    lang: string;
  }

  export interface Answers5 {
    kort: string;
    lang: string;
  }

  export interface ExtraBedrijvenHorecaMuziekRamenDichtOndernemingLang {
    label: string;
    shortLabel: string;
    values: Values5;
    answers: Answers5;
  }

  export interface Values6 {
    ja: string;
    nee: string;
  }

  export interface Answers6 {
    ja: string;
    nee: string;
  }

  export interface ExtraBedrijvenHorecaMuziekEvenement {
    label: string;
    shortLabel: string;
    values: Values6;
    answers: Answers6;
  }

  export interface ExtraBedrijvenHorecaMuziekEvenementEinde {
    label: string;
    shortLabel: string;
  }

  export interface ExtraBedrijvenHorecaInstallaties {
    subtitle: string;
    label: string;
    shortLabel: string;
  }

  export interface Values7 {
    dronken_bezoekers: string;
    schreeuwende_bezoekers: string;
    rokende_bezoekers: string;
    teveel_fietsen: string;
    wildplassen: string;
    overgeven: string;
  }

  export interface Answers7 {
    dronken_bezoekers: string;
    schreeuwende_bezoekers: string;
    rokende_bezoekers: string;
    teveel_fietsen: string;
    wildplassen: string;
    overgeven: string;
  }

  export interface ExtraBedrijvenHorecaPersonen {
    label: string;
    shortLabel: string;
    values: Values7;
    answers: Answers7;
  }

  export interface Values8 {
    uitgewaaierd_terras: string;
    doorloop: string;
    stoep_in_beslag: string;
    bezoekers_op_straat: string;
    bezoekers_op_terras: string;
    opruimen_meubels: string;
  }

  export interface Answers8 {
    uitgewaaierd_terras: string;
    doorloop: string;
    stoep_in_beslag: string;
    bezoekers_op_straat: string;
    bezoekers_op_terras: string;
    opruimen_meubels: string;
  }

  export interface ExtraBedrijvenHorecaTerrassen {
    label: string;
    shortLabel: string;
    values: Values8;
    answers: Answers8;
  }

  export interface ExtraBedrijvenHorecaStank {
    subtitle: string;
    label: string;
    shortLabel: string;
  }

  export interface ExtraBedrijvenHorecaStankOorzaak {
    subtitle: string;
    label: string;
    shortLabel: string;
  }

  export interface ExtraBedrijvenHorecaStankWeer {
    label: string;
    shortLabel: string;
  }

  export interface Values9 {
    ja: string;
    nee: string;
  }

  export interface Answers9 {
    ja: string;
    nee: string;
  }

  export interface ExtraBedrijvenHorecaStankRamen {
    label: string;
    shortLabel: string;
    values: Values9;
    answers: Answers9;
  }

  export interface Values10 {
    ja: string;
    nee: string;
  }

  export interface Answers10 {
    ja: string;
    nee: string;
  }

  export interface ExtraBedrijvenHorecaVaker {
    subtitle: string;
    label: string;
    shortLabel: string;
    values: Values10;
    answers: Answers10;
  }

  export interface ExtraBedrijvenHorecaTijdstippen {
    label: string;
    shortLabel: string;
  }

  export interface Values11 {
    ja: string;
    nee: string;
  }

  export interface Answers11 {
    ja: string;
    nee: string;
  }

  export interface ExtraBedrijvenHorecaMuziekGeluidmetingMuziek {
    subtitle: string;
    label: string;
    shortLabel: string;
    values: Values11;
    answers: Answers11;
  }

  export interface Values12 {
    ja: string;
    nee: string;
  }

  export interface Answers12 {
    ja: string;
    nee: string;
  }

  export interface ExtraBedrijvenHorecaMuziekGeluidmetingInstallaties {
    subtitle: string;
    label: string;
    shortLabel: string;
    values: Values12;
    answers: Answers12;
  }

  export interface Values13 {
    ja: string;
    nee: string;
  }

  export interface Answers13 {
    ja: string;
    nee: string;
  }

  export interface ExtraBedrijvenHorecaMuziekGeluidmetingOverige {
    subtitle: string;
    label: string;
    shortLabel: string;
    values: Values13;
    answers: Answers13;
  }

  export interface ExtraBedrijvenHorecaMuziekGeluidmetingCaution {
    value: string;
  }

  export interface Values14 {
    within_30_minutes: string;
    within_1_hour: string;
    not_now: string;
  }

  export interface Answers14 {
    within_30_minutes: string;
    within_1_hour: string;
    not_now: string;
  }

  export interface ExtraBedrijvenHorecaMuziekGeluidmetingJa {
    label: string;
    shortLabel: string;
    values: Values14;
    answers: Answers14;
  }

  export interface ExtraBedrijvenHorecaMuziekGeluidmetingJaNietnu {
    label: string;
    shortLabel: string;
  }

  export interface ExtraBedrijvenHorecaMuziekGeluidmetingNee {
    label: string;
    shortLabel: string;
  }

  export interface ExtraBedrijvenHorecaCaution {
    answers: string;
  }

  export interface OverlastBedrijvenEnHoreca {
    extra_bedrijven_horeca_wat: ExtraBedrijvenHorecaWat;
    extra_bedrijven_horeca_naam: ExtraBedrijvenHorecaNaam;
    extra_bedrijven_horeca_adres: ExtraBedrijvenHorecaAdres;
    extra_bedrijven_horeca_muziek_direct_naast: ExtraBedrijvenHorecaMuziekDirectNaast;
    extra_bedrijven_horeca_muziek_ramen_dicht: ExtraBedrijvenHorecaMuziekRamenDicht;
    extra_bedrijven_horeca_muziek_ramen_dicht_onderneming: ExtraBedrijvenHorecaMuziekRamenDichtOnderneming;
    extra_bedrijven_horeca_muziek_ramen_dicht_onderneming_lang: ExtraBedrijvenHorecaMuziekRamenDichtOndernemingLang;
    extra_bedrijven_horeca_muziek_evenement: ExtraBedrijvenHorecaMuziekEvenement;
    extra_bedrijven_horeca_muziek_evenement_einde: ExtraBedrijvenHorecaMuziekEvenementEinde;
    extra_bedrijven_horeca_installaties: ExtraBedrijvenHorecaInstallaties;
    extra_bedrijven_horeca_personen: ExtraBedrijvenHorecaPersonen;
    extra_bedrijven_horeca_terrassen: ExtraBedrijvenHorecaTerrassen;
    extra_bedrijven_horeca_stank: ExtraBedrijvenHorecaStank;
    extra_bedrijven_horeca_stank_oorzaak: ExtraBedrijvenHorecaStankOorzaak;
    extra_bedrijven_horeca_stank_weer: ExtraBedrijvenHorecaStankWeer;
    extra_bedrijven_horeca_stank_ramen: ExtraBedrijvenHorecaStankRamen;
    extra_bedrijven_horeca_vaker: ExtraBedrijvenHorecaVaker;
    extra_bedrijven_horeca_tijdstippen: ExtraBedrijvenHorecaTijdstippen;
    extra_bedrijven_horeca_muziek_geluidmeting_muziek: ExtraBedrijvenHorecaMuziekGeluidmetingMuziek;
    extra_bedrijven_horeca_muziek_geluidmeting_installaties: ExtraBedrijvenHorecaMuziekGeluidmetingInstallaties;
    extra_bedrijven_horeca_muziek_geluidmeting_overige: ExtraBedrijvenHorecaMuziekGeluidmetingOverige;
    extra_bedrijven_horeca_muziek_geluidmeting_caution: ExtraBedrijvenHorecaMuziekGeluidmetingCaution;
    extra_bedrijven_horeca_muziek_geluidmeting_ja: ExtraBedrijvenHorecaMuziekGeluidmetingJa;
    extra_bedrijven_horeca_muziek_geluidmeting_ja_nietnu: ExtraBedrijvenHorecaMuziekGeluidmetingJaNietnu;
    extra_bedrijven_horeca_muziek_geluidmeting_nee: ExtraBedrijvenHorecaMuziekGeluidmetingNee;
    extra_bedrijven_horeca_caution: ExtraBedrijvenHorecaCaution;
  }

  export interface ExtraAutoScooterBromfietswrak {
    subtitle: string;
    label: string;
    shortLabel: string;
  }

  export interface ExtraFietswrak {
    subtitle: string;
    label: string;
    shortLabel: string;
  }

  export interface ExtraParkeeroverlast {
    subtitle: string;
    label: string;
    shortLabel: string;
  }

  export interface OverlastInDeOpenbareRuimte {
    extra_auto_scooter_bromfietswrak: ExtraAutoScooterBromfietswrak;
    extra_fietswrak: ExtraFietswrak;
    extra_parkeeroverlast: ExtraParkeeroverlast;
  }

  export interface ExtraBotenSnelheidTypeboot {
    label: string;
    shortLabel: string;
    values: Values16;
  }

  export interface Values16 {
    pleziervaart: string;
    rondvaartboot_of_salonboot: string;
    vrachtschip_of_binnenvaartschip: string;
    overig: string;
  }

  export interface ExtraBotenSnelheidRederij {
    label: string;
    shortLabel: string;
  }

  export interface ExtraBotenSnelheidNaamboot {
    label: string;
    shortLabel: string;
  }

  export interface ExtraBotenSnelheidMeer {
    subtitle: string;
    label: string;
    shortLabel: string;
  }

  export interface ExtraBotenGeluidMeer {
    subtitle: string;
    label: string;
    shortLabel: string;
  }

  export interface ExtraBotenGezonkenMeer {
    subtitle: string;
    label: string;
    shortLabel: string;
  }

  export interface OverlastOpHetWater {
    extra_boten_snelheid_typeboot: ExtraBotenSnelheidTypeboot;
    extra_boten_snelheid_rederij: ExtraBotenSnelheidRederij;
    extra_boten_snelheid_naamboot: ExtraBotenSnelheidNaamboot;
    extra_boten_snelheid_meer: ExtraBotenSnelheidMeer;
    extra_boten_geluid_meer: ExtraBotenGeluidMeer;
    extra_boten_gezonken_meer: ExtraBotenGezonkenMeer;
  }

  export interface ExtraDierenText {
    answers: string[];
  }

  export interface OverlastVanDieren {
    extra_dieren_text: ExtraDierenText;
  }

  export interface ExtraJongerenText {
    answers: string;
  }

  export interface ExtraPersonenOverig {
    label: string;
    shortLabel: string;
    values: string;
    answers: string;
  }

  export interface Values18 {
    nee: string;
    ja: string;
  }

  export interface Answers18 {
    nee: string;
    ja: string;
  }

  export interface ExtraPersonenOverigVaker {
    label: string;
    shortLabel: string;
    values: Values18;
    answers: Answers18;
  }

  export interface ExtraPersonenOverigVakerMomenten {
    label: string;
    shortLabel: string;
  }

  export interface OverlastPersonenEnGroepen {
    extra_jongeren_text: ExtraJongerenText;
    extra_personen_overig: ExtraPersonenOverig;
    extra_personen_overig_vaker: ExtraPersonenOverigVaker;
    extra_personen_overig_vaker_momenten: ExtraPersonenOverigVakerMomenten;
  }

  export interface ExtraBrug {
    label: string;
    shortLabel: string;
  }

  export interface ExtraOnderhoudStoepStraatEnFietspad {
    subtitle: string;
    label: string;
    shortLabel: string;
  }

  export interface ExtraWegenGladheid {
    answers: string[];
  }

  export interface Values19 {
    lamp_doet_het_niet: string;
    lamp_brandt_overdag: string;
    geeft_lichthinder: string;
    lamp_is_zichtbaar_beschadigd: string;
    overig: string;
  }

  export interface Answers19 {
    lamp_doet_het_niet: string;
    lamp_brandt_overdag: string;
    geeft_lichthinder: string;
    lamp_is_zichtbaar_beschadigd: string;
    overig: string;
  }

  export interface ExtraStraatverlichtingProbleem {
    label: string;
    shortLabel: string;
    values: Values19;
    answers: Answers19;
  }

  export interface Values20 {
    drie_of_meer_kapot: string;
    is_gevolg_van_aanrijding: string;
    lamp_op_grond_of_scheef: string;
    deurtje_weg_of_open: string;
    losse_kabels_zichtbaar_of_lamp_los: string;
    niet_gevaarlijk: string;
  }

  export interface Answers20 {
    drie_of_meer_kapot: string;
    is_gevolg_van_aanrijding: string;
    lamp_op_grond_of_scheef: string;
    deurtje_weg_of_open: string;
    losse_kabels_zichtbaar_of_lamp_los: string;
    niet_gevaarlijk: string;
  }

  export interface ExtraStraatverlichting {
    label: string;
    shortLabel: string;
    values: Values20;
    answers: Answers20;
  }

  export interface ExtraStraatverlichtingGevaar {
    answers: string;
  }

  export interface ExtraStraatverlichtingNummer {
    subtitle: string;
    label: string;
    shortLabel: string;
  }

  export interface ExtraStraatverlichtingNietOpKaart {
    shortLabel: string;
    value: string;
  }

  export interface ExtraStraatverlichtingNietOpKaartNummer {
    label: string;
    shortLabel: string;
  }

  export interface Values21 {
    is_gevolg_van_aanrijding: string;
    klok_op_grond_of_scheef: string;
    deurtje_weg_of_open: string;
    losse_kabels_zichtbaar_of_lamp_los: string;
    niet_gevaarlijk: string;
  }

  export interface Answers21 {
    is_gevolg_van_aanrijding: string;
    klok_op_grond_of_scheef: string;
    deurtje_weg_of_open: string;
    losse_kabels_zichtbaar_of_lamp_los: string;
    niet_gevaarlijk: string;
  }

  export interface ExtraKlok {
    label: string;
    shortLabel: string;
    values: Values21;
    answers: Answers21;
  }

  export interface ExtraKlokGevaar {
    answers: string;
  }

  export interface Values22 {
    klok_staat_niet_op_tijd_of_stil: string;
    klok_is_zichtbaar_beschadigd: string;
    overig: string;
  }

  export interface Answers22 {
    klok_staat_niet_op_tijd_of_stil: string;
    klok_is_zichtbaar_beschadigd: string;
    overig: string;
  }

  export interface ExtraKlokProbleem {
    label: string;
    shortLabel: string;
    values: Values22;
    answers: Answers22;
  }

  export interface ExtraKlokNummer {
    label: string;
    shortLabel: string;
  }

  export interface ExtraKlokNietOpKaart {
    shortLabel: string;
    value: string;
  }

  export interface ExtraKlokNietOpKaartNummer {
    label: string;
    shortLabel: string;
  }

  export interface Values23 {
    is_gevolg_van_aanrijding: string;
    verkeerslicht_op_grond_of_scheef: string;
    deurtje_weg_of_open: string;
    losse_kabels_zichtbaar_of_lamp_los: string;
    niet_gevaarlijk: string;
  }

  export interface Answers23 {
    is_gevolg_van_aanrijding: string;
    verkeerslicht_op_grond_of_scheef: string;
    deurtje_weg_of_open: string;
    losse_kabels_zichtbaar_of_lamp_los: string;
    niet_gevaarlijk: string;
  }

  export interface ExtraVerkeerslicht {
    label: string;
    shortLabel: string;
    values: Values23;
    answers: Answers23;
  }

  export interface ExtraVerkeerslichtGevaar {
    answers: string;
  }

  export interface Values24 {
    voetganger: string;
    fiets: string;
    auto: string;
    tram_bus: string;
  }

  export interface Answers24 {
    voetganger: string;
    fiets: string;
    auto: string;
    tram_bus: string;
  }

  export interface ExtraVerkeerslichtWelk {
    label: string;
    shortLabel: string;
    values: Values24;
    answers: Answers24;
  }

  export interface Values25 {
    rood_werkt_niet: string;
    groen_werkt_niet: string;
    blindentikker_werkt_niet: string;
    groen_duurt_te_lang: string;
    anders: string;
  }

  export interface Answers25 {
    rood_werkt_niet: string;
    groen_werkt_niet: string;
    blindentikker_werkt_niet: string;
    groen_duurt_te_lang: string;
    anders: string;
  }

  export interface ExtraVerkeerslichtProbleemVoetganger {
    label: string;
    shortLabel: string;
    values: Values25;
    answers: Answers25;
  }

  export interface Values26 {
    rood_werkt_niet: string;
    oranje_werkt_niet: string;
    groen_werkt_niet: string;
    groen_duurt_te_lang: string;
    anders: string;
  }

  export interface Answers26 {
    rood_werkt_niet: string;
    oranje_werkt_niet: string;
    groen_werkt_niet: string;
    groen_duurt_te_lang: string;
    anders: string;
  }

  export interface ExtraVerkeerslichtProbleemFietsAuto {
    label: string;
    shortLabel: string;
    values: Values26;
    answers: Answers26;
  }

  export interface Values27 {
    rood_werkt_niet: string;
    oranje_werkt_niet: string;
    wit_werkt_niet: string;
    waarschuwingslicht_tram_werkt_niet: string;
    anders: string;
  }

  export interface Answers27 {
    rood_werkt_niet: string;
    oranje_werkt_niet: string;
    wit_werkt_niet: string;
    waarschuwingslicht_tram_werkt_niet: string;
    anders: string;
  }

  export interface ExtraVerkeerslichtProbleemBusTram {
    label: string;
    shortLabel: string;
    values: Values27;
    answers: Answers27;
  }

  export interface ExtraVerkeerslichtRijrichting {
    subtitle: string;
    label: string;
    shortLabel: string;
  }

  export interface ExtraVerkeerslichtNummer {
    subtitle: string;
    label: string;
    shortLabel: string;
  }

  export interface Values28 {
    ja: string;
    nee: string;
  }

  export interface Answers28 {
    ja: string;
    nee: string;
  }

  export interface ExtraFietsrekAanvragen {
    label: string;
    shortLabel: string;
    values: Values28;
    answers: Answers28;
  }

  export interface ExtraFietsrekText {
    answers: string[];
  }

  export interface ExtraFietsrekAanvraag {
    label: string;
    shortLabel: string;
  }

  export interface WegenVerkeerStraatmeubilair {
    extra_brug: ExtraBrug;
    extra_onderhoud_stoep_straat_en_fietspad: ExtraOnderhoudStoepStraatEnFietspad;
    extra_wegen_gladheid: ExtraWegenGladheid;
    extra_straatverlichting_probleem: ExtraStraatverlichtingProbleem;
    extra_straatverlichting: ExtraStraatverlichting;
    extra_straatverlichting_gevaar: ExtraStraatverlichtingGevaar;
    extra_straatverlichting_nummer: ExtraStraatverlichtingNummer;
    extra_straatverlichting_niet_op_kaart: ExtraStraatverlichtingNietOpKaart;
    extra_straatverlichting_niet_op_kaart_nummer: ExtraStraatverlichtingNietOpKaartNummer;
    extra_klok: ExtraKlok;
    extra_klok_gevaar: ExtraKlokGevaar;
    extra_klok_probleem: ExtraKlokProbleem;
    extra_klok_nummer: ExtraKlokNummer;
    extra_klok_niet_op_kaart: ExtraKlokNietOpKaart;
    extra_klok_niet_op_kaart_nummer: ExtraKlokNietOpKaartNummer;
    extra_verkeerslicht: ExtraVerkeerslicht;
    extra_verkeerslicht_gevaar: ExtraVerkeerslichtGevaar;
    extra_verkeerslicht_welk: ExtraVerkeerslichtWelk;
    extra_verkeerslicht_probleem_voetganger: ExtraVerkeerslichtProbleemVoetganger;
    extra_verkeerslicht_probleem_fiets_auto: ExtraVerkeerslichtProbleemFietsAuto;
    extra_verkeerslicht_probleem_bus_tram: ExtraVerkeerslichtProbleemBusTram;
    extra_verkeerslicht_rijrichting: ExtraVerkeerslichtRijrichting;
    extra_verkeerslicht_nummer: ExtraVerkeerslichtNummer;
    extra_fietsrek_aanvragen: ExtraFietsrekAanvragen;
    extra_fietsrek_text: ExtraFietsrekText;
    extra_fietsrek_aanvraag: ExtraFietsrekAanvraag;
  }

  export interface Values29 {
    vakantieverhuur: string;
    onderhuur: string;
    leegstand: string;
    crimineleBewoning: string;
    woningdelen: string;
    woningkwaliteit: string;
  }

  export interface Answers29 {
    vakantieverhuur: string;
    onderhuur: string;
    leegstand: string;
    crimineleBewoning: string;
    woningdelen: string;
    woningkwaliteit: string;
  }

  export interface WonenOverig {
    label: string;
    values: Values29;
    answers: Answers29;
  }

  export interface ExtraWonenWoningdelenVermoeden {
    subtitle: string;
    label: string;
    shortLabel: string;
  }

  export interface ExtraWonenWoningdelenEigenaar {
    label: string;
    shortLabel: string;
  }

  export interface Values30 {
    zelfde_adres: string;
    ander_adres: string;
    weet_ik_niet: string;
  }

  export interface Answers30 {
    zelfde_adres: string;
    ander_adres: string;
    weet_ik_niet: string;
  }

  export interface ExtraWonenWoningdelenAdresHuurder {
    subtitle: string;
    label: string;
    shortLabel: string;
    values: Values30;
    answers: Answers30;
  }

  export interface Values31 {
    een_persoon: string;
    twee_personen: string;
    drie_personen: string;
    vier_personen: string;
    vijf_of_meer_personen: string;
    weet_ik_niet: string;
  }

  export interface Answers31 {
    een_persoon: string;
    twee_personen: string;
    drie_personen: string;
    vier_personen: string;
    vijf_of_meer_personen: string;
    weet_ik_niet: string;
  }

  export interface ExtraWonenWoningdelenAantalPersonen {
    label: string;
    shortLabel: string;
    values: Values31;
    answers: Answers31;
  }

  export interface Values32 {
    ja: string;
    nee: string;
    weet_ik_niet: string;
  }

  export interface Answers32 {
    ja: string;
    nee: string;
    weet_ik_niet: string;
  }

  export interface ExtraWonenWoningdelenBewonersFamilie {
    label: string;
    shortLabel: string;
    values: Values32;
    answers: Answers32;
  }

  export interface Values33 {
    ja: string;
    nee: string;
    weet_ik_niet: string;
  }

  export interface Answers33 {
    ja: string;
    nee: string;
    weet_ik_niet: string;
  }

  export interface ExtraWonenWoningdelenSamenwonen {
    label: string;
    shortLabel: string;
    values: Values33;
    answers: Answers33;
  }

  export interface Values34 {
    ja: string;
    nee: string;
    weet_ik_niet: string;
  }

  export interface Answers34 {
    ja: string;
    nee: string;
    weet_ik_niet: string;
  }

  export interface ExtraWonenWoningdelenWisselendeBewoners {
    label: string;
    shortLabel: string;
    values: Values34;
    answers: Answers34;
  }

  export interface ExtraWonenWoningdelenIemandAanwezig {
    label: string;
    shortLabel: string;
  }

  export interface Values35 {
    een_persoon: string;
    twee_personen: string;
    drie_personen: string;
    vier_personen: string;
    vijf_of_meer_personen: string;
    weet_ik_niet: string;
  }

  export interface Answers35 {
    een_persoon: string;
    twee_personen: string;
    drie_personen: string;
    vier_personen: string;
    vijf_of_meer_personen: string;
    weet_ik_niet: string;
  }

  export interface ExtraWonenOnderhuurAantalPersonen {
    label: string;
    shortLabel: string;
    values: Values35;
    answers: Answers35;
  }

  export interface Values36 {
    ja: string;
    nee: string;
    weet_ik_niet: string;
  }

  export interface Answers36 {
    ja: string;
    nee: string;
    weet_ik_niet: string;
  }

  export interface ExtraWonenOnderhuurBewonersFamilie {
    label: string;
    shortLabel: string;
    values: Values36;
    answers: Answers36;
  }

  export interface ExtraWonenOnderhuurNaamBewoners {
    label: string;
    shortLabel: string;
  }

  export interface Values37 {
    langer_dan_zes_maanden: string;
    korter_dan_zes_maanden: string;
    weet_ik_niet: string;
  }

  export interface Answers37 {
    langer_dan_zes_maanden: string;
    korter_dan_zes_maanden: string;
    weet_ik_niet: string;
  }

  export interface ExtraWonenOnderhuurWoonPeriode {
    label: string;
    shortLabel: string;
    values: Values37;
    answers: Answers37;
  }

  export interface ExtraWonenOnderhuurIemandAanwezig {
    label: string;
    shortLabel: string;
  }

  export interface ExtraWonenOnderhuurNaamHuurder {
    subtitle: string;
    label: string;
    shortLabel: string;
  }

  export interface Values38 {
    aangegeven_adres: string;
    ander_adres: string;
    weet_ik_niet: string;
  }

  export interface Answers38 {
    aangegeven_adres: string;
    ander_adres: string;
    weet_ik_niet: string;
  }

  export interface ExtraWonenOnderhuurHuurderWoont {
    label: string;
    shortLabel: string;
    values: Values38;
    answers: Answers38;
  }

  export interface ExtraWonenOnderhuurAdresHuurder {
    label: string;
    shortLabel: string;
  }

  export interface ExtraWonenLeegstandNaamEigenaar {
    label: string;
    shortLabel: string;
  }

  export interface Values39 {
    langer_dan_zes_maanden: string;
    korter_dan_zes_maanden: string;
    weet_ik_niet: string;
  }

  export interface Answers39 {
    langer_dan_zes_maanden: string;
    korter_dan_zes_maanden: string;
    weet_ik_niet: string;
  }

  export interface ExtraWonenLeegstandPeriode {
    label: string;
    shortLabel: string;
    values: Values39;
    answers: Answers39;
  }

  export interface Values40 {
    ja: string;
    nee: string;
    weet_ik_niet: string;
  }

  export interface Answers40 {
    ja: string;
    nee: string;
    weet_ik_niet: string;
  }

  export interface ExtraWonenLeegstandWoningGebruik {
    label: string;
    shortLabel: string;
    values: Values40;
    answers: Answers40;
  }

  export interface ExtraWonenLeegstandNaamPersoon {
    label: string;
    shortLabel: string;
  }

  export interface ExtraWonenLeegstandActiviteitInWoning {
    label: string;
    shortLabel: string;
  }

  export interface ExtraWonenLeegstandIemandAanwezig {
    label: string;
    shortLabel: string;
  }

  export interface Values41 {
    ja: string;
    nee: string;
    weet_ik_niet: string;
  }

  export interface Answers41 {
    ja: string;
    nee: string;
    weet_ik_niet: string;
  }

  export interface ExtraWonenVakantieverhuurToeristenAanwezig {
    label: string;
    shortLabel: string;
    values: Values41;
    answers: Answers41;
  }

  export interface Values42 {
    bellen: string;
    formulier: string;
  }

  export interface Answers42 {
    bellen: string;
    formulier: string;
  }

  export interface ExtraWonenVakantieverhuurBellenOfFormulier {
    label: string;
    shortLabel: string;
    values: Values42;
    answers: Answers42;
  }

  export interface ExtraWonenVakantieverhuurBellen {
    answers1: string;
    answers2: string;
  }

  export interface Values43 {
    vier_of_minder: string;
    vijf_of_meer: string;
  }

  export interface Answers43 {
    vier_of_minder: string;
    vijf_of_meer: string;
  }

  export interface ExtraWonenVakantieverhuurAantalMensen {
    label: string;
    shortLabel: string;
    values: Values43;
    answers: Answers43;
  }

  export interface Values44 {
    maandelijks: string;
    wekelijks: string;
    dagelijks: string;
    eerste_keer: string;
  }

  export interface Answers44 {
    maandelijks: string;
    wekelijks: string;
    dagelijks: string;
    eerste_keer: string;
  }

  export interface ExtraWonenVakantieverhuurHoeVaak {
    label: string;
    shortLabel: string;
    values: Values44;
    answers: Answers44;
  }

  export interface Values45 {
    weekend: string;
    doordeweeks: string;
    wisselend: string;
  }

  export interface Answers45 {
    weekend: string;
    doordeweeks: string;
    wisselend: string;
  }

  export interface ExtraWonenVakantieverhuurWanneer {
    label: string;
    shortLabel: string;
    values: Values45;
    answers: Answers45;
  }

  export interface Values46 {
    ja: string;
    nee: string;
    weet_ik_niet: string;
  }

  export interface Answers46 {
    ja: string;
    nee: string;
    weet_ik_niet: string;
  }

  export interface ExtraWonenVakantieverhuurBewoning {
    subtitle: string;
    label: string;
    shortLabel: string;
    values: Values46;
    answers: Answers46;
  }

  export interface ExtraWonenVakantieverhuurNaamBewoner {
    label: string;
    shortLabel: string;
  }

  export interface Values47 {
    ja: string;
    nee: string;
  }

  export interface Answers47 {
    ja: string;
    nee: string;
  }

  export interface ExtraWonenVakantieverhuurOnlineAangeboden {
    label: string;
    shortLabel: string;
    values: Values47;
    answers: Answers47;
  }

  export interface ExtraWonenVakantieverhuurLinkAdvertentie {
    label: string;
    shortLabel: string;
  }

  export interface ExtraWonenVakantieverhuurFooter {
    answers: string;
  }

  export interface Values48 {
    ja: string;
    nee: string;
  }

  export interface Answers48 {
    ja: string;
    nee: string;
  }

  export interface ExtraWonenWoonkwaliteitDirectGevaar {
    subtitle: string;
    label: string;
    shortLabel: string;
    values: Values48;
    answers: Answers48;
  }

  export interface ExtraWonenWoonkwaliteitDirectGevaarAlert {
    answers: string;
  }

  export interface Values49 {
    ja: string;
    nee: string;
  }

  export interface Answers49 {
    ja: string;
    nee: string;
  }

  export interface ExtraWonenWoonkwaliteitGemeldBijEigenaar {
    label: string;
    shortLabel: string;
    values: Values49;
    answers: Answers49;
  }

  export interface ExtraWonenWoonkwaliteitDirectGevaarJa {
    answers: string;
  }

  export interface Values50 {
    ja: string;
    nee: string;
  }

  export interface Answers50 {
    ja: string;
    nee: string;
  }

  export interface ExtraWonenWoonkwaliteitBewoner {
    label: string;
    shortLabel: string;
    values: Values50;
    answers: Answers50;
  }

  export interface Values51 {
    ja: string;
    nee: string;
  }

  export interface Answers51 {
    ja: string;
    nee: string;
  }

  export interface ExtraWonenWoonkwaliteitNamensBewoner {
    label: string;
    shortLabel: string;
    values: Values51;
    answers: Answers51;
  }

  export interface Values52 {
    ja: string;
    nee: string;
  }

  export interface Answers52 {
    ja: string;
    nee: string;
  }

  export interface ExtraWonenWoonkwaliteitToestemmingContact {
    subtitle: string;
    label: string;
    shortLabel: string;
    values: Values52;
    answers: Answers52;
  }

  export interface ExtraWonenWoonkwaliteitToestemmingContactJa {
    answers: string;
  }

  export interface ExtraWonenWoonkwaliteitGeenContact {
    label: string;
    shortLabel: string;
  }

  export interface Wonen {
    wonen_overig: WonenOverig;
    extra_wonen_woningdelen_vermoeden: ExtraWonenWoningdelenVermoeden;
    extra_wonen_woningdelen_eigenaar: ExtraWonenWoningdelenEigenaar;
    extra_wonen_woningdelen_adres_huurder: ExtraWonenWoningdelenAdresHuurder;
    extra_wonen_woningdelen_aantal_personen: ExtraWonenWoningdelenAantalPersonen;
    extra_wonen_woningdelen_bewoners_familie: ExtraWonenWoningdelenBewonersFamilie;
    extra_wonen_woningdelen_samenwonen: ExtraWonenWoningdelenSamenwonen;
    extra_wonen_woningdelen_wisselende_bewoners: ExtraWonenWoningdelenWisselendeBewoners;
    extra_wonen_woningdelen_iemand_aanwezig: ExtraWonenWoningdelenIemandAanwezig;
    extra_wonen_onderhuur_aantal_personen: ExtraWonenOnderhuurAantalPersonen;
    extra_wonen_onderhuur_bewoners_familie: ExtraWonenOnderhuurBewonersFamilie;
    extra_wonen_onderhuur_naam_bewoners: ExtraWonenOnderhuurNaamBewoners;
    extra_wonen_onderhuur_woon_periode: ExtraWonenOnderhuurWoonPeriode;
    extra_wonen_onderhuur_iemand_aanwezig: ExtraWonenOnderhuurIemandAanwezig;
    extra_wonen_onderhuur_naam_huurder: ExtraWonenOnderhuurNaamHuurder;
    extra_wonen_onderhuur_huurder_woont: ExtraWonenOnderhuurHuurderWoont;
    extra_wonen_onderhuur_adres_huurder: ExtraWonenOnderhuurAdresHuurder;
    extra_wonen_leegstand_naam_eigenaar: ExtraWonenLeegstandNaamEigenaar;
    extra_wonen_leegstand_periode: ExtraWonenLeegstandPeriode;
    extra_wonen_leegstand_woning_gebruik: ExtraWonenLeegstandWoningGebruik;
    extra_wonen_leegstand_naam_persoon: ExtraWonenLeegstandNaamPersoon;
    extra_wonen_leegstand_activiteit_in_woning: ExtraWonenLeegstandActiviteitInWoning;
    extra_wonen_leegstand_iemand_aanwezig: ExtraWonenLeegstandIemandAanwezig;
    extra_wonen_vakantieverhuur_toeristen_aanwezig: ExtraWonenVakantieverhuurToeristenAanwezig;
    extra_wonen_vakantieverhuur_bellen_of_formulier: ExtraWonenVakantieverhuurBellenOfFormulier;
    extra_wonen_vakantieverhuur_bellen: ExtraWonenVakantieverhuurBellen;
    extra_wonen_vakantieverhuur_aantal_mensen: ExtraWonenVakantieverhuurAantalMensen;
    extra_wonen_vakantieverhuur_hoe_vaak: ExtraWonenVakantieverhuurHoeVaak;
    extra_wonen_vakantieverhuur_wanneer: ExtraWonenVakantieverhuurWanneer;
    extra_wonen_vakantieverhuur_bewoning: ExtraWonenVakantieverhuurBewoning;
    extra_wonen_vakantieverhuur_naam_bewoner: ExtraWonenVakantieverhuurNaamBewoner;
    extra_wonen_vakantieverhuur_online_aangeboden: ExtraWonenVakantieverhuurOnlineAangeboden;
    extra_wonen_vakantieverhuur_link_advertentie: ExtraWonenVakantieverhuurLinkAdvertentie;
    extra_wonen_vakantieverhuur_footer: ExtraWonenVakantieverhuurFooter;
    extra_wonen_woonkwaliteit_direct_gevaar: ExtraWonenWoonkwaliteitDirectGevaar;
    extra_wonen_woonkwaliteit_direct_gevaar_alert: ExtraWonenWoonkwaliteitDirectGevaarAlert;
    extra_wonen_woonkwaliteit_gemeld_bij_eigenaar: ExtraWonenWoonkwaliteitGemeldBijEigenaar;
    extra_wonen_woonkwaliteit_direct_gevaar_ja: ExtraWonenWoonkwaliteitDirectGevaarJa;
    extra_wonen_woonkwaliteit_bewoner: ExtraWonenWoonkwaliteitBewoner;
    extra_wonen_woonkwaliteit_namens_bewoner: ExtraWonenWoonkwaliteitNamensBewoner;
    extra_wonen_woonkwaliteit_toestemming_contact: ExtraWonenWoonkwaliteitToestemmingContact;
    extra_wonen_woonkwaliteit_toestemming_contact_ja: ExtraWonenWoonkwaliteitToestemmingContactJa;
    extra_wonen_woonkwaliteit_geen_contact: ExtraWonenWoonkwaliteitGeenContact;
  }

  export interface RootObject {
    afval: Afval;
    overlastBedrijvenEnHoreca: OverlastBedrijvenEnHoreca;
    overlastInDeOpenbareRuimte: OverlastInDeOpenbareRuimte;
    overlastOpHetWater: OverlastOpHetWater;
    overlastVanDieren: OverlastVanDieren;
    overlastPersonenEnGroepen: OverlastPersonenEnGroepen;
    wegenVerkeerStraatmeubilair: WegenVerkeerStraatmeubilair;
    wonen: Wonen;
  }

}
