// General selectors for creating a signal
export const CREATE_SIGNAL = {
  autoSuggest: '[data-testid="autoSuggest"]',
  buttonUploadFile: '#formUpload',
  dropdownDag: '#incident_date-select-day',
  dropdownUur: '#incident_date-select-time-hours',
  dropdownMinuten: '#incident_date-select-time-minutes',
  errorList: '.header__errors',
  imageAddressMarker: 'div[class="leaflet-pane leaflet-marker-pane"]',
  inputPhoneNumber: '[type=tel]',
  inputEmail: '[type=email]',
  imageFileUpload: '[class*=Image__ImageContainer]',
  linkChangeEmailAddress: '[class*=IncidentPreview__LinkContainer] > [href="/incident/email"]',
  linkChangePhoneNumber: '[class*=IncidentPreview__LinkContainer] > [href="/incident/telefoon"]',
  linkChangeSignalInfo: '[class*=IncidentPreview__LinkContainer] > [href="/incident/beschrijf"]',
  mapContainer: '.leaflet-container',
  mapStaticImage:'[data-testid=mapStaticImage]',
  mapStaticMarker:'[data-testid=mapStaticMarker]', 
  mapPreview: '[data-testid=map-preview]',
  radioButtonTijdstipNu: '#datetime-Nu1',
  radioButtonTijdstipEerder: '#datetime-Eerder1',
};

// Selectors specific for overlast bedrijven en horeca
export const BEDRIJVEN_HORECA = {
  checkBoxDronken: '#extra_bedrijven_horeca_personen-dronken_bezoekers1',
  checkBoxSchreeuwen: '#extra_bedrijven_horeca_personen-schreeuwende_bezoekers1',
  checkBoxWildplassen: '#extra_bedrijven_horeca_personen-wildplassen1',
  inputWieWat: '[class*=Input__Styled]',
  inputAdres: '[class*=Input__Styled]',
  inputDatum: '[class*=Input__Styled]',
  radioButtonHoreca: '#extra_bedrijven_horeca_wat-horecabedrijf1',
  radioButtonAnderBedrijf: '#extra_bedrijven_horeca_wat-ander_soort_bedrijf1',
  radioButtonVakerJa: '#extra_bedrijven_horeca_vaker-ja1',
  radioButtonVakerNee: '#extra_bedrijven_horeca_vaker-nee1',
};

// Selectors specific for boten
export const BOTEN = {
  inputNaamBoot: '[class*=Input__Styled]',
  inputNogMeer: '[class*=TextArea__StyledArea]',
  radioButtonRondvaartbootJa: '#extra_boten_snelheid_rondvaartboot-ja1',
};

// Selectors specific for boten
export const CONTAINERS = {
  inputContainerSoort: '[class*=Input__Styled]',
  inputContainerNummer: '[class*=Input__Styled]',
};

// Selectors specific for overlast jongerenx
export const JONGEREN = {
  checkBoxVaker: '#extra_personen_overig_vaker',
  inputMoment: '[class*=TextArea__StyledArea]',
  radioButtonAantalPersonen: '#extra_personen_overig-4-61',
};

// Selectors specific for lantaarnpaal
export const LANTAARNPAAL = {
  mapSelectLamp: '[data-testid=map-base]',
  radioButtonAanrijding: '#extra_straatverlichting-is_gevolg_van_aanrijding1',
  radioButtonAantalLichtenpunten: '#extra_straatverlichting_hoeveel-meerdere_lichtpunten1',
  radioButtonOpGrond: '#extra_straatverlichting-lamp_op_grond_of_scheef1',
  radioButtonDeur: '#extra_straatverlichting-deurtje_weg_of_open1',
  radioButtonLosseKabels: '#extra_straatverlichting-losse_kabels_zichtbaar_of_lamp_los1',
  radioButtonNietGevaarlijk: '#extra_straatverlichting-niet_gevaarlijk1',
  radioButtonEenLichtpunt: '#extra_straatverlichting_hoeveel-1_lichtpunt1',
};

// Selectors for stankoverlast
export const STANK_OVERLAST = {
  inputGeur: '[class*=Input__Styled]',
  inputOorzaakGeur: '[class*=Input__Styled]',
  inputWeersomstandigheden: '[class*=Input__Styled]',
  radioButtonRaamOpen: '#extra_bedrijven_horeca_stank_ramen-ja1',
  radioButtonRaamGesloten: '#extra_bedrijven_horeca_stank_ramen-nee1',
};

// Selectors specific for lantaarnpaal
export const VERKEERSLICHT = {
  inputNummerVerkeerslicht: '[class*=Input__Styled]',
  inputRijrichting: '[class*=Input__Styled]',
  radioButtonAanrijding: '#extra_verkeerslicht-is_gevolg_van_aanrijding1',
  radioButtonOpGrond: '#extra_verkeerslicht-verkeerslicht_op_grond_of_scheef1',
  radioButtonDeur: '#extra_verkeerslicht-deurtje_weg_of_open1',
  radioButtonLosseKabels: '#extra_verkeerslicht-losse_kabels_zichtbaar_of_lamp_los1',
  radioButtonNietGevaarlijk: '#extra_verkeerslicht-niet_gevaarlijk1',
  radioButtonEenLichtpunt: '#extra_verkeerslicht_hoeveel-1_lichtpunt1',
};

// Selectors for wegdek
export const WEGDEK = {
  inputSoortWegdek: '[class*=Input__Styled]',
};