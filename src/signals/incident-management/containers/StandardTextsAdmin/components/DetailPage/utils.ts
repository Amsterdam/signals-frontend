// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam

import type { StandardTextForm, StandardTextDetailData } from './types'

export const createPatch = (
  data: StandardTextForm,
  dirtyFields: any
): StandardTextDetailData => {
  const payload = Object.keys(dirtyFields).map((key) => {
    return {
      [key]: data[key as keyof StandardTextForm],
    }
  })

  return Object.assign({}, ...payload)
}
