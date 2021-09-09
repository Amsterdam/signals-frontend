// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 Gemeente Amsterdam
import { StatusCode } from 'signals/incident-management/definitions/types'
type DefaultText = {
  state: StatusCode
  templates: {
    text: string
    title: string
  }[]
}

export type DefaultTexts = DefaultText[]
