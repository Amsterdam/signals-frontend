// General selectors for creating a signal
export const CREATE_SIGNAL = {
    buttonUploadFile: '#formUpload',
    dropdownDag: '#incident_date-select-day',
    dropdownUur: '#incident_date-select-time-hours',
    dropdownMinuten: '#incident_date-select-time-minutes',
    imageAdressMarker:'div[class="leaflet-pane leaflet-marker-pane"]',
    inputPhoneNumber:'.Input__StyledInput-sc-1933jsg-1',
    inputEmail:'.Input__StyledInput-sc-1933jsg-1',
    imageFileUpload:'.preview-image__item-value-image',
    radioButtonTijdstipNu: '#datetime-Nu1',
    radioButtonTijdstipEerder: '#datetime-Eerder1'
}

// Selectors specific for overlast bedrijven en horeca
export const BEDRIJVEN_HORECA = {
    checkBoxDronken: '#extra_bedrijven_horeca_personen-dronken_bezoekers1',
    checkBoxSchreeuwen: '#extra_bedrijven_horeca_personen-schreeuwende_bezoekers1',
    checkBoxWildplassen: '#extra_bedrijven_horeca_personen-wildplassen1',
    inputWieWat: ':nth-child(3) > .col-sm-12 > .header > .header__children > .Input__Wrapper-sc-1933jsg-4 > .Input__StyledInput-sc-1933jsg-1',
    inputAdres: ':nth-child(4) > .col-sm-12 > .header > .header__children > .Input__Wrapper-sc-1933jsg-4 > .Input__StyledInput-sc-1933jsg-1',
    inputDatum: ':nth-child(19) > .col-sm-12 > .header > .header__children > .Input__Wrapper-sc-1933jsg-4 > .Input__StyledInput-sc-1933jsg-1',
    radioButtonHoreca: '#extra_bedrijven_horeca_wat-horecabedrijf1',
    radioButtonAnderBedrijf: '#extra_bedrijven_horeca_wat-ander_soort_bedrijf1',
    radioButtonVakerJa: '#extra_bedrijven_horeca_vaker-ja1',
    radioButtonVakerNee: '#extra_bedrijven_horeca_vaker-nee1'
}

// Selectors specific for boten
export const BOTEN = {
    inputNaamBoot: '.Input__StyledInput-sc-1933jsg-1',
    inputNogMeer: '.TextArea__StyledArea-cx2qy7-0',
    radioButtonRondvaartbootJa: '#extra_boten_snelheid_rondvaartboot-ja1'
}

// Selectors specific for overlast jongerenx
export const JONGEREN = {
    checkBoxVaker: '#extra_personen_overig_vaker',
    inputMoment: '.TextArea__StyledArea-cx2qy7-0',
    radioButtonAantalPersonen: '#extra_personen_overig-4-61'
}

// Selectors specific for lantaarnpaal
export const LANTAARNPAAL = {
    errorRadioGevaarlijkRequiredField: '.header__errors > :nth-child(1)',
    errorRadioHoeveelRequiredField: ':nth-child(7) > .col-12 > .header > .header__errors > :nth-child(1)',
    radioButtonAanrijding: '#extra_straatverlichting-is_gevolg_van_aanrijding1',
    radioButtonOpGrond: '#extra_straatverlichting-lamp_op_grond_of_scheef1',
    radioButtonDeur: '#extra_straatverlichting-deurtje_weg_of_open1',
    radioButtonLosseKabels: '#extra_straatverlichting-losse_kabels_zichtbaar_of_lamp_los1',
    radioButtonNietGevaarlijk: '#extra_straatverlichting-niet_gevaarlijk1',
    radioButtonEenLichtpunt: '#extra_straatverlichting_hoeveel-1_lichtpunt1'
}

// Selectors for stankoverlast
export const STANK_OVERLAST = {
    inputGeur: ':nth-child(14) > .col-sm-12 > .header > .header__children > .Input__Wrapper-sc-1933jsg-4 > .Input__StyledInput-sc-1933jsg-1',
    inputOorzaakGeur: ':nth-child(15) > .col-sm-12 > .header > .header__children > .Input__Wrapper-sc-1933jsg-4 > .Input__StyledInput-sc-1933jsg-1',
    inputWeersomstandigheden: ':nth-child(16) > .col-sm-12 > .header > .header__children > .Input__Wrapper-sc-1933jsg-4 > .Input__StyledInput-sc-1933jsg-1',
    radioButtonRaamOpen: '#extra_bedrijven_horeca_stank_ramen-ja1',
    radioButtonRaamGesloten: '#extra_bedrijven_horeca_stank_ramen-nee1'
}

// Selectors for wegdek
export const WEGDEK = {
    inputSoortWegdek: '.Input__StyledInput-sc-1933jsg-1'
}