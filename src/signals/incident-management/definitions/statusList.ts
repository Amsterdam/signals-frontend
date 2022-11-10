// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2021 Gemeente Amsterdam
import type { Status } from './types'
import { StatusCode } from './types'

export const GEMELD = {
  key: StatusCode.Gemeld,
  value: 'Gemeld',
  color: 'red',
  email_sent_when_set: false,
  shows_remaining_sla_days: true,
  topic: 'topic1',
}

export const AFWACHTING = {
  key: StatusCode.Afwachting,
  value: 'In afwachting van behandeling',
  color: 'purple',
  email_sent_when_set: false,
  shows_remaining_sla_days: true,
  topic: 'topic1',
}

export const BEHANDELING = {
  key: StatusCode.Behandeling,
  value: 'In behandeling',
  color: 'blue',
  email_sent_when_set: false,
  shows_remaining_sla_days: true,
  topic: 'topic1',
}

export const AFGEHANDELD = {
  key: StatusCode.Afgehandeld,
  value: 'Afgehandeld',
  color: 'lightgreen',
  email_sent_when_set: true,
  shows_remaining_sla_days: false,
  topic: 'topic1',
}

export const GESPLITST = {
  key: StatusCode.Gesplitst,
  value: 'Gesplitst',
  color: 'lightgreen',
  email_sent_when_set: false,
  shows_remaining_sla_days: false,
  topic: 'topic1',
}

export const INGEPLAND = {
  key: StatusCode.Ingepland,
  value: 'Ingepland',
  color: 'grey',
  email_sent_when_set: false,
  shows_remaining_sla_days: true,
  topic: 'topic1',
}

export const GEANNULEERD = {
  key: StatusCode.Geannuleerd,
  value: 'Geannuleerd',
  color: 'darkgrey',
  email_sent_when_set: false,
  shows_remaining_sla_days: false,
  topic: 'topic1',
}

export const REACTIE_GEVRAAGD = {
  key: StatusCode.ReactieGevraagd,
  value: 'Reactie gevraagd',
  email_sent_when_set: true,
  shows_remaining_sla_days: false,
  topic: 'topic1',
}

export const REACTIE_ONTVANGEN = {
  key: StatusCode.ReactieOntvangen,
  value: 'Reactie ontvangen',
  email_sent_when_set: false,
  shows_remaining_sla_days: false,
  topic: 'topic1',
}

export const VERZOEK_TOT_HEROPENEN = {
  key: StatusCode.VerzoekTotHeropenen,
  value: 'Verzoek tot heropenen',
  color: 'orange',
  email_sent_when_set: false,
  shows_remaining_sla_days: false,
  topic: 'topic1',
}

export const HEROPEND = {
  key: StatusCode.Heropend,
  value: 'Heropend',
  color: 'orange',
  email_sent_when_set: true,
  shows_remaining_sla_days: true,
  topic: 'topic1',
}

export const TE_VERZENDEN = {
  key: StatusCode.TeVerzenden,
  value: 'Extern: te verzenden',
  email_sent_when_set: false,
  shows_remaining_sla_days: true,
  topic: 'topic1',
}

export const VERZONDEN = {
  key: StatusCode.Verzonden,
  value: 'Extern: verzonden',
  email_sent_when_set: false,
  shows_remaining_sla_days: true,
  topic: 'topic1',
}

export const VERZENDEN_MISLUKT = {
  key: StatusCode.VerzendenMislukt,
  value: 'Extern: mislukt',
  email_sent_when_set: false,
  shows_remaining_sla_days: true,
  topic: 'topic1',
}

export const VERZOEK_TOT_AFHANDELING = {
  key: StatusCode.VerzoekTotAfhandeling,
  value: 'Extern: verzoek tot afhandeling',
  email_sent_when_set: false,
  shows_remaining_sla_days: true,
  topic: 'topic2',
}

export const AFGEHANDELD_EXTERN = {
  key: StatusCode.AfgehandeldExtern,
  value: 'Extern: afgehandeld',
  email_sent_when_set: false,
  shows_remaining_sla_days: true,
  topic: 'topic2',
}

const statusList: Status[] = [
  GEMELD,
  AFWACHTING,
  BEHANDELING,
  REACTIE_GEVRAAGD,
  REACTIE_ONTVANGEN,
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
  REACTIE_GEVRAAGD,
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
