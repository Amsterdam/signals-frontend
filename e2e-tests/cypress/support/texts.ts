// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 Gemeente Amsterdam
export const ERROR_MESSAGES = {
  email: 'Vul een geldig e-mailadres in, met een @ en een domeinnaam. Bijvoorbeeld: naam@domein.nl',
  location: 'Kies een locatie op de kaart of vul een adres in',
  mandatoryField: 'Dit is een verplicht veld',
  mandatoryFields: 'U hebt niet alle vragen beantwoord. Vul hieronder aan alstublieft.',
  mandatoryFieldKTO: 'Dit veld is verplicht',
};

export const FILTERS = {
  helpText: 'Ga naar ‘Filter’ en voer een naam in om een filterinstelling op te slaan.',
  noSavedFilter: 'U heeft geen eigen filter opgeslagen.',
};

export const KTO = {
  body:
    '[Ja, ik ben tevreden]({{ positive_feedback_url }}) \n  [Nee, ik ben niet tevreden]({{ negative_feedback_url }})',
  formTitelIsAlFeedback: 'Er is al feedback gegeven voor deze melding',
  formTitleBedankt: 'Bedankt voor uw feedback!',
  formTitleOnTevreden: 'Nee, ik ben niet tevreden met de behandeling van mijn melding',
  formTitleTevreden: 'Ja, ik ben tevreden met de behandeling van mijn melding',
  questionContact: 'Mogen wij contact met u opnemen naar aanleiding van uw feedback? (niet verplicht)',
  questionVermelden: 'Wilt u verder nog iets vermelden of toelichten? (niet verplicht)',
  questionWaaromOntevreden: 'Waarom bent u ontevreden?',
  questionWaaromTevreden: 'Waarom bent u tevreden?',
  subtitleQuestionTevreden: 'Een antwoord mogelijk, kies de belangrijkste reden',
  textBedankt: 'We zijn voortdurend bezig onze dienstverlening te verbeteren.',
  textNogmaalsBedankt:
    'Nogmaals bedankt voor uw feedback. We zijn voortdurend bezig onze dienstverlening te verbeteren.',
};

export const NOTIFICATONS = {
  deelmelding: 'Deelmelding gemaakt',
};

export const MESSAGES = {
  sendMailText:
    'Stuur deze toelichting naar de melder. Let dus op de schrijfstijl. De e-mail bevat al een aanhef en afsluiting.',
};

export const SAMENHANG_TEXT = {
  descriptionText: 'Iedereen in de buurt meldt hetzelfde.',
  nocontact: 'Er is nog geen contact geweest met deze melder',
  notAuthorized: 'Je hebt geen toestemming om meldingen in deze subcategorie te bekijken',
};

export const TYPE_TEXT = {
  aanvraag: 'Aanvraag: Een verzoek om iets structureels te veranderen',
  grootOnderhoud:
    'Groot onderhoud: Een verzoek dat niet onder dagelijks beheer valt, maar onder een langdurig traject.',
  klacht: 'Klacht: Een uiting van ongenoegen over het handelen van de gemeente.',
  melding: 'Melding: Een verzoek tot herstel of handhaving om de normale situatie te herstellen',
  vraag: 'Vraag: Een verzoek om informatie',
};

export const URGENCY_TEXT = {
  hoog: 'Hoog: melding met spoed oppakken',
  laag: 'Laag: interne melding zonder servicebelofte',
};
