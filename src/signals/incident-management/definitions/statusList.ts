// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2021 Gemeente Amsterdam
import type { Status } from './types'
import { StatusCode } from './types'

export const GEMELD = {
  key: StatusCode.Gemeld,
  slug: 'm',
  value: 'Gemeld',
  color: 'red',
  email_sent_when_set: false,
  shows_remaining_sla_days: true,
}

export const AFWACHTING = {
  key: StatusCode.Afwachting,
  slug: 'i',
  value: 'In afwachting van behandeling',
  color: 'purple',
  email_sent_when_set: false,
  shows_remaining_sla_days: true,
}

export const BEHANDELING = {
  key: StatusCode.Behandeling,
  slug: 'b',
  value: 'In behandeling',
  color: 'blue',
  email_sent_when_set: false,
  shows_remaining_sla_days: true,
}

export const AFGEHANDELD = {
  key: StatusCode.Afgehandeld,
  slug: 'done+external',
  value: 'Afgehandeld',
  color: 'lightgreen',
  email_sent_when_set: true,
  shows_remaining_sla_days: false,
}

export const GESPLITST = {
  key: StatusCode.Gesplitst,
  slug: 's',
  value: 'Gesplitst',
  color: 'lightgreen',
  email_sent_when_set: false,
  shows_remaining_sla_days: false,
}

export const INGEPLAND = {
  key: StatusCode.Ingepland,
  slug: 'ingepland',
  value: 'Ingepland',
  color: 'grey',
  email_sent_when_set: false,
  shows_remaining_sla_days: true,
}

export const GEANNULEERD = {
  key: StatusCode.Geannuleerd,
  value: 'Geannuleerd',
  color: 'darkgrey',
  email_sent_when_set: false,
  shows_remaining_sla_days: false,
}

export const REACTIE_GEVRAAGD = {
  key: StatusCode.ReactieGevraagd,
  slug: 'reaction+requested',
  value: 'Reactie gevraagd',
  email_sent_when_set: true,
  shows_remaining_sla_days: false,
}

export const REACTIE_ONTVANGEN = {
  key: StatusCode.ReactieOntvangen,
  slug: 'reaction+received',
  value: 'Reactie ontvangen',
  email_sent_when_set: false,
  shows_remaining_sla_days: false,
}

export const VERZOEK_TOT_HEROPENEN = {
  key: StatusCode.VerzoekTotHeropenen,
  slug: 'reopen+requested',
  value: 'Verzoek tot heropenen',
  color: 'orange',
  email_sent_when_set: false,
  shows_remaining_sla_days: false,
}

export const HEROPEND = {
  key: StatusCode.Heropend,
  slug: 'reopened',
  value: 'Heropend',
  color: 'orange',
  email_sent_when_set: true,
  shows_remaining_sla_days: true,
}

export const TE_VERZENDEN = {
  key: StatusCode.TeVerzenden,
  value: 'Extern: te verzenden',
  email_sent_when_set: false,
  shows_remaining_sla_days: true,
}

export const VERZONDEN = {
  key: StatusCode.Verzonden,
  value: 'Extern: verzonden',
  email_sent_when_set: false,
  shows_remaining_sla_days: true,
}

export const VERZENDEN_MISLUKT = {
  key: StatusCode.VerzendenMislukt,
  value: 'Extern: mislukt',
  email_sent_when_set: false,
  shows_remaining_sla_days: true,
}

export const VERZOEK_TOT_AFHANDELING = {
  key: StatusCode.VerzoekTotAfhandeling,
  slug: 'closure+requested',
  value: 'Extern: verzoek tot afhandeling',
  email_sent_when_set: false,
  shows_remaining_sla_days: true,
}

export const DOORGEZET_NAAR_EXTERN = {
  key: StatusCode.DoorgezetNaarExtern,
  value: 'Doorgezet naar extern',
  email_sent_when_set: true,
  shows_remaining_sla_days: true,
}

export const AFGEHANDELD_EXTERN = {
  key: StatusCode.AfgehandeldExtern,
  slug: 'done+external',
  value: 'Extern: afgehandeld',
  email_sent_when_set: false,
  shows_remaining_sla_days: true,
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
  DOORGEZET_NAAR_EXTERN,
]

export default statusList

type StatusDashboard = Status & { slug: string }

export const statusListDashboard: StatusDashboard[] = [
  HEROPEND,
  AFGEHANDELD_EXTERN,
  INGEPLAND,
  VERZOEK_TOT_HEROPENEN,
  REACTIE_ONTVANGEN,
  BEHANDELING,
  GESPLITST,
  REACTIE_GEVRAAGD,
  GEMELD,
  AFWACHTING,
  VERZOEK_TOT_AFHANDELING,
]

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
