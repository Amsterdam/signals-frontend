// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2019 - 2021 Gemeente Amsterdam
import { createSelector } from 'reselect'
import { initialState } from './reducer'

export const selectDepartmentsDomain = (state) =>
  state?.departments || initialState

/**
 * Other specific selectors
 */
export const departmentsInputOptions = (state) => [
  ...state
    .get('list')
    .toJS()
    .map((department) => ({
      key: department.code,
      name: department.name,
      value: department.name,
    })),
]

export const makeSelectDepartments = createSelector(
  selectDepartmentsDomain,
  (state) => state.toJS()
)

export const inputSelectDepartmentsSelector = createSelector(
  selectDepartmentsDomain,
  (state) => [
    { key: '', name: 'Alles', value: '*' },
    ...departmentsInputOptions(state),
  ]
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
