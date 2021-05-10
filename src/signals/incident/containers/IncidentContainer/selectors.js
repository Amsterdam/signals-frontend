// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2021 Gemeente Amsterdam
import { createSelector } from 'reselect'
import { initialState } from './reducer'

export const getClassificationData = (
  category,
  subcategory,
  { _links, name, slug, handling_message }
) => ({
  category,
  subcategory,
  handling_message,
  classification: {
    id: _links.self.href,
    name,
    slug,
  },
})

export const selectIncidentContainerDomain = (state) =>
  state?.incidentContainer || initialState

export const makeSelectIncidentContainer = createSelector(
  selectIncidentContainerDomain,
  (substate) => substate.toJS()
)
