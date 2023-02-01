// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2019 - 2021 Gemeente Amsterdam
import { createSelector } from 'reselect'

import { initialState } from './reducer'

/**
 * Direct selector to the history state domain
 */
const selectHistoryDomain = (state) => state.history || initialState

/**
 * Other specific selectors
 */

/**
 * Default selector used by history
 */

const makeSelectHistoryModel = () =>
  createSelector(selectHistoryDomain, (substate) => substate.toJS())

export default makeSelectHistoryModel
export { selectHistoryDomain }
