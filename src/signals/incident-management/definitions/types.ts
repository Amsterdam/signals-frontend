import type { Icon } from './listIcons'

export interface Definition {
  key: string
  value: string
}

export enum StatusCode {
  Gemeld = 'm',
  Afwachting = 'i',
  Behandeling = 'b',
  Afgehandeld = 'o',
  Ingepland = 'ingepland',
  Geannuleerd = 'a',
  Gesplitst = 's',
  VerzoekTotHeropenen = 'reopen requested',
  ReactieGevraagd = 'reaction requested',
  ReactieOntvangen = 'reaction received',
  Heropend = 'reopened',
  TeVerzenden = 'ready to send',
  Verzonden = 'sent',
  VerzendenMislukt = 'send failed',
  VerzoekTotAfhandeling = 'closure requested',
  DoorgezetNaarExtern = 'forward to external',
  AfgehandeldExtern = 'done external',
}

export interface Status extends Definition {
  key: StatusCode
  color?: string
  email_sent_when_set: boolean
  shows_remaining_sla_days: boolean
}

export interface Priority extends Definition {
  info?: string
  icon?: Icon
  topic?: string
}
