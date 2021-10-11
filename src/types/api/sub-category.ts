// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 Gemeente Amsterdam
export default interface SubCategory {
  _links: {
    curies: {
      name: string
      href: string
    }
    self: {
      href: string
    }
  }
  _display: string
  name: string
  slug: string
  handling: string
  departments: { code: string; name: string; is_intern: boolean }[]
  is_active: boolean
  description: string | null
  handling_message: string
}
