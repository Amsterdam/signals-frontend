// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2019 - 2021 Gemeente Amsterdam
import isObject from 'lodash/isObject'
import set from 'lodash/set'

import convertValue from '../convert-value'
import getStepControls from '../get-step-controls'

const mapValues = (params, incident = {}, wizard = {}) => {
  Object.values(wizard).forEach((step) => {
    const controls = getStepControls(step, incident)

    Object.entries(controls).forEach(([name, control]) => {
      const value = incident[name]
      const meta = control.meta

      if (meta && meta.path) {
        let itemValue = convertValue(value)
        if (isObject(itemValue) && itemValue.id) {
          itemValue = itemValue.id
        }

        if (itemValue || itemValue === 0) {
          set(params, meta.path, itemValue)
        }
      }
    })
  })

  return params || {}
}

export default mapValues
