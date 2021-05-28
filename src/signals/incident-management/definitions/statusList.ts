// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2021 Gemeente Amsterdam
export enum StatusCode {
  Gemeld = 'm',
  Afwachting = 'i',
  Behandeling = 'b',
  Afgehandeld = 'o',
  Ingepland = 'ingepland',
  Geannuleerd = 'a',
  Gesplitst = 's',
  VerzoekTotHeropenen = 'reopen requested',
  Heropend = 'reopened',
  TeVerzenden = 'ready to send',
  Verzonden = 'sent',
  VerzendenMislukt = 'send failed',
  VerzoekTotAfhandeling = 'closure requested',
  AfgehandeldExtern = 'done external',
}

export const GEMELD = {
  key: StatusCode.Gemeld,
  value: 'Gemeld',
  color: 'red',
  email_sent_when_set: false,
  shows_remaining_sla_days: true,
}

export const AFWACHTING = {
  key: StatusCode.Afwachting,
  value: 'In afwachting van behandeling',
  color: 'purple',
  email_sent_when_set: false,
  shows_remaining_sla_days: true,
}

export const BEHANDELING = {
  key: StatusCode.Behandeling,
  value: 'In behandeling',
  color: 'blue',
  email_sent_when_set: false,
  shows_remaining_sla_days: true,
}

export const AFGEHANDELD = {
  key: StatusCode.Afgehandeld,
  value: 'Afgehandeld',
  color: 'lightgreen',
  email_sent_when_set: true,
  shows_remaining_sla_days: false,
}

export const GESPLITST = {
  key: StatusCode.Gesplitst,
  value: 'Gesplitst',
  color: 'lightgreen',
  email_sent_when_set: false,
  shows_remaining_sla_days: false,
}

export const INGEPLAND = {
  key: StatusCode.Ingepland,
  value: 'Ingepland',
  color: 'grey',
  email_sent_when_set: true,
  shows_remaining_sla_days: true,
}

export const GEANNULEERD = {
  key: StatusCode.Geannuleerd,
  value: 'Geannuleerd',
  color: 'darkgrey',
  email_sent_when_set: false,
  shows_remaining_sla_days: false,
}

export const VERZOEK_TOT_HEROPENEN = {
  key: StatusCode.VerzoekTotHeropenen,
  value: 'Verzoek tot heropenen',
  color: 'orange',
  email_sent_when_set: false,
  shows_remaining_sla_days: false,
}

export const HEROPEND = {
  key: StatusCode.Heropend,
  value: 'Heropend',
  color: 'orange',
  email_sent_when_set: true,
  shows_remaining_sla_days: true,
}

export const TE_VERZENDEN = {
  key: StatusCode.TeVerzenden,
  value: 'Te verzenden naar extern systeem',
  email_sent_when_set: false,
  shows_remaining_sla_days: true,
}

export const VERZONDEN = {
  key: StatusCode.Verzonden,
  value: 'Verzonden naar extern systeem',
  email_sent_when_set: false,
  shows_remaining_sla_days: true,
}

export const VERZENDEN_MISLUKT = {
  key: StatusCode.VerzendenMislukt,
  value: 'Verzending naar extern systeem mislukt',
  email_sent_when_set: false,
  shows_remaining_sla_days: true,
}

export const VERZOEK_TOT_AFHANDELING = {
  key: StatusCode.VerzoekTotAfhandeling,
  value: 'Verzoek tot afhandeling',
  email_sent_when_set: false,
  shows_remaining_sla_days: true,
}

export const AFGEHANDELD_EXTERN = {
  key: StatusCode.AfgehandeldExtern,
  value: 'Melding is afgehandeld in extern systeem',
  email_sent_when_set: false,
  shows_remaining_sla_days: true,
}

const statusList = [
  GEMELD,
  AFWACHTING,
  BEHANDELING,
  AFGEHANDELD,
  INGEPLAND,
  GEANNULEERD,
  GESPLITST,
  VERZOEK_TOT_HEROPENEN,
  HEROPEND,
  TE_VERZENDEN,
  VERZONDEN,
  VERZENDEN_MISLUKT,
  VERZOEK_TOT_AFHANDELING,
  AFGEHANDELD_EXTERN,
]

export default statusList

export const changeStatusOptionList = [
  GEMELD,
  AFWACHTING,
  INGEPLAND,
  BEHANDELING,
  VERZOEK_TOT_AFHANDELING,
  AFGEHANDELD,
  HEROPEND,
  GEANNULEERD,
]

export const isStatusEnd = (status: StatusCode): boolean =>
  [
    StatusCode.Afgehandeld,
    StatusCode.Geannuleerd,
    StatusCode.Gesplitst,
  ].includes(status)

export const isStatusClosed = (status: StatusCode): boolean =>
  [StatusCode.Afgehandeld, StatusCode.Geannuleerd].includes(status)

export const defaultTextsOptionList = [...changeStatusOptionList]
