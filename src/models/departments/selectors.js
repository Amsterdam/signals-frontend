// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2019 - 2021 Gemeente Amsterdam
import { createSelector } from 'reselect'
import { initialState } from './reducer'

export const selectDepartmentsDomain = (state) =>
  state?.departments || initialState

export const makeSelectDepartments = createSelector(
  selectDepartmentsDomain,
  (state) => state.toJS()
)

export const makeSelectDirectingDepartments = createSelector(
  makeSelectDepartments,
  (state) => {
    const directingDepartments = state?.list.filter(
      (department) => department.can_direct
    )
    return [
      { key: 'null', value: 'Verantwoordelijke afdeling' },
      ...directingDepartments.map(({ code }) => ({ key: code, value: code })),
    ]
  }
)

export const makeSelectRoutingDepartments = createSelector(
  makeSelectDepartments,
  (state) => {
    const routingDepartments = state?.list
    return [
      { key: 'null', value: 'Niet gekoppeld' },
      ...routingDepartments.map(({ code, name }) => ({
        key: code,
        value: name,
      })),
    ]
  }
)
