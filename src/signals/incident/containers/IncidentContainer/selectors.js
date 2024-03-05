// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2021 Gemeente Amsterdam
import { createSelector } from 'reselect'

import { initialState } from './reducer'
export const getClassificationData = (category, subcategory, categoryData) => {
  const { _links, name, slug, handling_message } = categoryData
  return {
    category,
    subcategory,
    category_is_public_accessible: categoryData?.is_public_accessible,
    handling_message,
    classification: {
      id: _links.self.href,
      name,
      slug,
    },
  }
}

export const selectIncidentContainerDomain = (state) =>
  state?.incidentContainer || initialState

export const makeSelectIncidentContainer = createSelector(
  selectIncidentContainerDomain,
  (substate) => substate.toJS()
)

export const makeSelectCategory = createSelector(
  selectIncidentContainerDomain,
  (state) => {
    const { category, subcategory } = state.toJS().incident
    return { category, subcategory }
  }
)

export const makeSelectMaxAssetWarning = createSelector(
  selectIncidentContainerDomain,
  (state) => {
    const { maxAssetWarning } = state.toJS().incident
    return { maxAssetWarning }
  }
)
