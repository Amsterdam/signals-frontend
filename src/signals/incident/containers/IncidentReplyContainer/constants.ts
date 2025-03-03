// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 Gemeente Amsterdam
// import configuration from 'shared/services/configuration/configuration'
/**
 * Possible responses
 */
export const EXPIRED_STATUS = 410
export const EXPIRED_DETAIL = 'Expired!'

export const INCORRECT_STATUS_STATUS = 500
export const INCORRECT_STATUS_DETAIL = 'associated signal not in state'

export const SUBMITTED_PREVIOUSLY_STATUS = 410
export const SUBMITTED_PREVIOUSLY_DETAIL = 'Already used!'

/**
 * Notices
 */
export const INACCESSIBLE_TITLE = 'U kunt niet meer reageren op onze vragen'
export const INACCESSIBLE_CONTENT = [
  'U hebt hierover een e-mail ontvangen of u krijgt deze binnenkort nog.',
  `Wilt u dat wij toch nog iets doen? Dan kunt u [een nieuwe melding maken](https:meldingen.amsterdam.nl/incident/beschrijf). Geef alstublieft zoveel mogelijk details van de situatie. En stuur als dat kan een foto mee.`,
]

export const SUBMITTED_PREVIOUSLY_TITLE =
  'U hebt onze vragen al eerder beantwoord'
export const SUBMITTED_PREVIOUSLY_CONTENT =
  'Wij bedanken u nogmaals voor de extra informatie die u ons hebt gegeven.'

export const SUBMITTED_TITLE = 'Bedankt'
export const SUBMITTED_CONTENT =
  'Wij gaan aan het werk met uw melding. Uw informatie helpt hierbij.'

export const GENERIC_ERROR_TITLE = 'Er is iets misgegaan'
export const GENERIC_ERROR_CONTENT = 'Probeer het later nog eens.'
