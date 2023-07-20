// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam
import type { StatusCode } from '../status-code'

export interface StandardText {
  active: boolean
  categories: number[]
  id: number
  meta: Record<any, any>
  state: StatusCode
  text: string
  title: string
}
