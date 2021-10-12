// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 Gemeente Amsterdam
import type { Category } from '../category'

export default interface SubCategory extends Category {
  parentKey: string
  value: string
}
