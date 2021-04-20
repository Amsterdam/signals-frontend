// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2021 Gemeente Amsterdam
import get from 'lodash.get'

function mapDynamicFields(text, fields) {
  return text.replace(/{.+?}/g, (match) => {
    const key = match.replace(/[{}]/g, '')
    return get(fields, key, `[niet gevonden: ${key}]`)
  })
}

export default mapDynamicFields
