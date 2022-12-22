import type { Address } from 'types/address'

import type { Question } from './question'
import type { Explanation } from './questionnaire'

export interface Session {
  _links: {
    'sia:questionnaire': {
      href: string
    }
    'sia:public-signal': {
      href: string
    }
    'sia:post-attachments': {
      href: string
    }
    'sia:post-answers': {
      href: string
    }
    'sia:post-submit': {
      href: string
    }
  }
  created_at: string
  duration: string
  path_questions: Question[]
  questionnaire_explanation: Explanation
  started_at: string | null
  submit_before: string
  signal_snapshot: {
    signal_id: string
    id: number
    location: {
      address: Address
      address_text?: string | null
      geometrie: {
        coordinates: [number, number]
        type: 'Point'
      }
      stadsdeel: string | null
    }
  }
  uuid: string
}
