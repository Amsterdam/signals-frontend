// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 Gemeente Amsterdam
import type { StatusCode } from '../status-code'

export type DefaultText = {
  state: StatusCode
  templates: {
    text: string
    title: string
    is_active: boolean
  }[]
}

export type DefaultTexts = DefaultText[]
