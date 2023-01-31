// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Gemeente Amsterdam
import type { ExtendedCategory } from 'models/categories/selectors'
import type SubCategory from 'types/api/sub-category'

import {
  RESET,
  SET_ADDRESS,
  SET_SAVE_BUTTON_LABEL,
  SET_CATEGORIES,
  SET_DATE,
  SET_GROUP_OPTIONS,
  SET_MAIN_CATEGORY,
  SET_NAME,
  SET_NOTE_KEYWORD,
  SET_REFRESH,
} from './constants'

export type ResetAction = {
  type: typeof RESET
}
export type SetAddressAction = {
  type: typeof SET_ADDRESS
  payload: string
}
export type SetNoteKeywordAction = {
  type: typeof SET_NOTE_KEYWORD
  payload: string
}
export type SetSaveButtonLabelAction = {
  type: typeof SET_SAVE_BUTTON_LABEL
  payload: boolean
}

type SetCategoriesActionPayload = {
  slug: string
  subCategories: Array<SubCategory>
}
export type SetCategoriesAction = {
  type: typeof SET_CATEGORIES
  payload: SetCategoriesActionPayload
}

type SetDateActionPayload = Partial<
  Record<'created_before' | 'created_after', string>
>

export type SetDateAction = {
  type: typeof SET_DATE
  payload: SetDateActionPayload
}

type SetGroupOptionsActionPayload = {
  [groupName: string]: any
}
export type SetGroupOptionsAction = {
  type: typeof SET_GROUP_OPTIONS
  payload: SetGroupOptionsActionPayload
}

type SetMainCategoryActionPayload = {
  category: ExtendedCategory & {
    sub: Array<SubCategory>
  }
  isToggled: boolean
}
export type SetMainCategoryAction = {
  type: typeof SET_MAIN_CATEGORY
  payload: SetMainCategoryActionPayload
}
export type SetNameAction = {
  type: typeof SET_NAME
  payload: string
}
export type SetRefreshAction = {
  type: typeof SET_REFRESH
  payload: boolean
}

export type Actions =
  | ResetAction
  | SetAddressAction
  | SetSaveButtonLabelAction
  | SetNoteKeywordAction
  | SetCategoriesAction
  | SetDateAction
  | SetGroupOptionsAction
  | SetMainCategoryAction
  | SetNameAction
  | SetRefreshAction

export const reset = (): ResetAction => ({
  type: RESET,
})

export const setAddress = (address: string): SetAddressAction => ({
  type: SET_ADDRESS,
  payload: address,
})

export const setNoteKeyword = (payload: string): SetNoteKeywordAction => ({
  type: SET_NOTE_KEYWORD,
  payload,
})

export const setSaveButtonLabel = (
  payload: boolean
): SetSaveButtonLabelAction => ({
  type: SET_SAVE_BUTTON_LABEL,
  payload,
})

export const setCategories = (
  payload: SetCategoriesActionPayload
): SetCategoriesAction => ({
  type: SET_CATEGORIES,
  payload,
})

export const setDate = (date: SetDateActionPayload): SetDateAction => ({
  type: SET_DATE,
  payload: date,
})

export const setGroupOptions = (
  payload: SetGroupOptionsActionPayload
): SetGroupOptionsAction => ({
  type: SET_GROUP_OPTIONS,
  payload,
})

export const setMainCategory = (
  payload: SetMainCategoryActionPayload
): SetMainCategoryAction => ({
  type: SET_MAIN_CATEGORY,
  payload,
})

export const setName = (name: string): SetNameAction => ({
  type: SET_NAME,
  payload: name,
})

export const setRefresh = (shouldRefresh: boolean): SetRefreshAction => ({
  type: SET_REFRESH,
  payload: shouldRefresh,
})
