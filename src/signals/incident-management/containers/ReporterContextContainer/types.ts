// Copyright (C) 2021 Gemeente Amsterdam
export type Feedback = {
  is_satisfied: boolean | null
  submitted_at: string | null
} | null

export interface Result {
  id: number
  created_at: string
  category: {
    sub: string
    sub_slug: string
    main: string
    main_slug: string
    departments: string
  }
  status: {
    state: string
    state_display: string
  }
  feedback: Feedback
  can_view_signal: boolean
  has_children: boolean
}

export interface ReporterContext {
  _links: {
    self: string
    next: string
    previous: string
  }
  count: number
  results: Array<Result>
}

export interface Incident {
  reporter: {
    email: string
  }
  id: number
  text: string
}
