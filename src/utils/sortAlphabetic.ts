// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam
export const sortAlphabetic = (a: string, b: string) => {
  const _a = a.toLowerCase()
  const _b = b.toLowerCase()

  // eslint-disable-next-line no-nested-ternary
  return _a > _b ? 1 : _a < _b ? -1 : 0
}
