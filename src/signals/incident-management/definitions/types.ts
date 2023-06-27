import type { StatusCode } from 'types/status-code'

import type { Icon } from './listIcons'

export interface Definition {
  key: string
  value: string
}

export interface Status extends Definition {
  key: StatusCode
  color?: string
  email_sent_when_set: boolean
  shows_remaining_sla_days: boolean
  category_slug?: string
}

export interface Priority extends Definition {
  info?: string
  icon?: Icon
  topic?: string
}
