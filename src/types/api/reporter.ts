// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 Gemeente Amsterdam

export default interface Reporter {
  _links: {
    self: string
    next: string
    previous: string
  }
  count: number
  results: Array<Result>
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

interface Feedback {
  is_satisfied: boolean | null
  submitted_at: string | null
}
