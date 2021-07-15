export interface Session {
  _links: {
    'sia:questionnaire': {
      href: string
    }
    'sia:public-signal': {
      href: string
    }
  }
  uuid: string
  started_at: string | null
  submit_before: string
  duration: string
  created_at: string
}
