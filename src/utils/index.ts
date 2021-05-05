// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2021 Gemeente Amsterdam
/**
 * Array detector
 */
export const isArray = (value: unknown): boolean =>
  !!value && Array.isArray(value)

/**
 * Date detector
 */
export const isDate = (value: unknown): boolean =>
  !!value && !isArray(value) && !Number.isNaN(Date.parse(value as string))
