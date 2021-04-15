// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2019 - 2021 Gemeente Amsterdam
/**
 * Array detector
 *
 * @param {Any} value
 * @returns {Boolean}
 */
export const isArray = value => !!value &&
  value.constructor &&
  value.constructor.name === 'Array' &&
  typeof value[Symbol.iterator] === 'function';

/**
 * Date detector
 *
 * @param {Any} value
 * @returns {Boolean}
 */
export const isDate = value => !!value && !isArray(value) && !Number.isNaN(Date.parse(value));
