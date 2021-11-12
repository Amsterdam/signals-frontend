// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2021 Gemeente Amsterdam
import { createSelector } from 'reselect'
import type { ApplicationRootState } from 'types'

import { initialState } from './reducer'
import type { KeyValuePair, Role, User } from './types'

export const selectGlobal = (state?: Partial<ApplicationRootState>) =>
  state?.global ?? initialState

export const makeSelectUser = createSelector(
  selectGlobal,
  (globalState) => globalState.user
)

/**
 * Selector that returns the list of permissions for the current user
 *
 * @returns {Object[]} - All permissions from assigned roles combined with extra permissions
 */
export const makeSelectUserPermissions = createSelector(
  makeSelectUser,
  (user?: User) => {
    const permissionMap = new Map<number, Role>()

    user?.roles
      ?.flatMap((role) => role.permissions)
      .concat(user.permissions)
      .forEach((permission) => {
        if (permission) {
          permissionMap.set(permission.id, permission)
        }
      })

    return [...permissionMap.values()]
  }
)

/**
 * Selector that returns the list of permission codes for the current user
 *
 * @returns {String[]} - All permissions from assigned roles combined with extra permissions
 */
export const makeSelectUserPermissionCodeNames = createSelector(
  makeSelectUserPermissions,
  (permissions) => permissions.map(({ codename }) => codename)
)

/**
 * Selector that queries the user's permissions and returna a boolean
 * when that permission is present.
 *
 * @returns {Function}
 */
export const makeSelectUserCan = createSelector(
  [makeSelectUser, makeSelectUserPermissionCodeNames],
  (user, permissions) => {
    const is_superuser = user?.is_superuser
    /**
     * @param   {String} capability - The permission to check for
     * @returns {(Boolean|undefined)} - is_superuser can be one of undefined, true or false
     */
    return (capability: string): boolean | undefined =>
      is_superuser !== false
        ? is_superuser
        : Boolean(permissions.find((codename) => codename === capability))
  }
)

/**
 * Selector that queries a subset of the user's permissions. Useful for determining
 * if a user should have access to a specific section of the application.
 *
 * @returns {Function}
 */
export const makeSelectUserCanAccess = createSelector(
  [makeSelectUser, makeSelectUserPermissionCodeNames],
  (user, permissions) => {
    const is_superuser = user?.is_superuser

    /**
     * @param   {String} section - The set of permissions to check for
     * @returns {(Boolean|undefined)} - is_superuser can be one of undefined, true or false
     */
    return (section: string): boolean | undefined => {
      if (is_superuser !== false) {
        return is_superuser
      }

      const groups = ['view_group', 'add_group', 'change_group']
      const groupForm = ['add_group', 'change_group']
      const users = ['view_user', 'add_user', 'change_user']
      const userForm = ['add_user', 'change_user']
      const departments = [
        'view_department',
        'add_department',
        'change_department',
      ]
      const departmentForm = ['add_department', 'change_department']
      const categories = ['view_category', 'add_category', 'change_category']
      const categoryForm = ['add_category', 'change_category']

      const requiredPerms: Record<string, string[]> = {
        settings: [...groups, ...userForm, ...departments, ...categories],
        groups,
        groupForm,
        users,
        userForm,
        departments,
        departmentForm,
        categories,
        categoryForm,
      }

      if (!Object.keys(requiredPerms).includes(section)) {
        return false
      }

      return requiredPerms[section].some((perm) => permissions.includes(perm))
    }
  }
)

export const makeSelectLoading = () =>
  createSelector(selectGlobal, (globalState) => globalState?.loading)

export const makeSelectError = () =>
  createSelector(selectGlobal, (globalState) => globalState?.error)

export const makeSelectNotification = () =>
  createSelector(selectGlobal, (globalState) => globalState?.notification)

export const makeSelectSearchQuery = createSelector(
  selectGlobal,
  (globalState) => globalState?.searchQuery
)

export const makeSelectSources = createSelector(selectGlobal, (globalState) =>
  globalState?.sources?.length
    ? globalState.sources.map(
        ({ name, can_be_selected }): KeyValuePair<string> => ({
          key: name,
          value: name,
          can_be_selected: can_be_selected,
        })
      )
    : null
)
