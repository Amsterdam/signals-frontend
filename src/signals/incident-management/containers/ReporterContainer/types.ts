// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 Gemeente Amsterdam
export type Feedback = {
  is_satisfied: boolean | null
  submitted_at: string | null
}

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
  feedback: Feedback | null
  can_view_signal: boolean
  has_children: boolean
}

export interface Reporter {
  _links: {
    self: string
    next: string
    previous: string
  }
  count: number
  results: Array<Result>
}

// TODO replace with Incident type added by https://github.com/Amsterdam/signals-frontend/pull/1541
export interface Incident {
  reporter: {
    email: string
  }
  id: number
  text: string
}
