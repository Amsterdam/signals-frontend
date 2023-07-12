// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam
import type { StandardTextDetailData, StandardTextForm } from './types'

export const createPost = (data: StandardTextForm): StandardTextDetailData => {
  const payload = Object.entries(data).map(([key, value]) => {
    return { [key]: value }
  })
  return Object.assign({}, ...payload)
}

export const createPatch = (
  data: StandardTextForm,
  dirtyFields: Partial<
    Readonly<{
      categories?: boolean[] | undefined
      state?: boolean | undefined
      title?: boolean | undefined
      text?: boolean | undefined
      active?: boolean | undefined
    }>
  >
): StandardTextDetailData => {
  const payload = Object.keys(dirtyFields).map((key) => {
    return {
      [key]: data[key as keyof StandardTextForm],
    }
  })
  return Object.assign({}, ...payload)
}
