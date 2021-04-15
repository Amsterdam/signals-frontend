// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2019 - 2021 Gemeente Amsterdam
const convertValue = (value) => {
  if (value === 0) {
    return 0
  }

  if (value === true) {
    return 'ja'
  }

  if (value === false) {
    return 'nee'
  }

  return value
}

export default convertValue
