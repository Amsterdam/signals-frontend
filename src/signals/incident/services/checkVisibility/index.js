// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Gemeente Amsterdam
import isEqual from 'lodash/isEqual'
import isObject from 'lodash/isObject'

import { getIsAuthenticated } from 'shared/services/auth/auth'

const isValueEqual = (objToCompareTo, value, key, comparisonFunc) => {
  if (Array.isArray(objToCompareTo[key])) {
    if (
      objToCompareTo[key].includes(value) ||
      comparisonFunc.call(objToCompareTo[key], (item) => item.id === value)
    )
      return true
  }

  if (!Array.isArray(value)) {
    if (isEqual(value, objToCompareTo[key])) return true
  } else {
    if (
      comparisonFunc.call(value, (val) =>
        isValueEqual(objToCompareTo, val, key, comparisonFunc)
      )
    )
      return true
  }

  if (isObject(objToCompareTo[key])) {
    if (objToCompareTo[key].value && isEqual(value, objToCompareTo[key].value))
      return true
    if (objToCompareTo[key].id && isEqual(value, objToCompareTo[key].id))
      return true
  }

  return false
}

const comparisonFuncs = {
  ifAllOf: Array.prototype.every,
  ifOneOf: Array.prototype.some,
}

/**
 * Evaluate values against an object
 *
 * Conditions are objects with a key that is eith 'ifOneOf' or 'ifAll'. Conditions can be nested in any order and to
 * any depth.
 *
 * @param {Object} conditions
 * @param {Object} objToCompareTo
 * @return {Boolean}
 */
const evaluateConditions = (conditions, objToCompareTo) => {
  const validConditions = ['ifOneOf', 'ifAllOf']
  const validEntries = Object.entries(conditions).filter(([key]) =>
    validConditions.includes(key)
  )

  return validEntries
    .map(([comparisonKey, value]) => {
      const comparisonFunc = comparisonFuncs[comparisonKey]

      return comparisonFunc.call(Object.entries(value), ([key, val]) => {
        // in case of nested conditions, recursively evaluate that condition
        if (validConditions.includes(key)) {
          return evaluateConditions({ [key]: val }, objToCompareTo)
        }

        return isValueEqual(objToCompareTo, val, key, comparisonFunc)
      })
    }, true)
    .every(Boolean)
}

/**
 * Check for form field visibility
 *
 * A 'control' can be given conditions by which is determined if that control should be visible or not. The
 * possible conditions are 'ifAllOf' and 'ifOneOf'. A condition can contain a list of key/value pairs for
 * which the values are compared to the props and values of objToCompareTo.
 *
 * @param {Object} control
 * @param {Object} objToCompareTo
 * @returns {Boolean}
 */
const checkVisibility = (control, objToCompareTo) => {
  if (control.meta?.ignoreVisibility) {
    return true
  }

  const isVisible = evaluateConditions(control.meta, objToCompareTo)

  if (control.authenticated) {
    return isVisible && getIsAuthenticated()
  }

  return isVisible
}

export default checkVisibility
