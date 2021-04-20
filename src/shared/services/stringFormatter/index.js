// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Gemeente Amsterdam
/**
 * String formatter
 *
 * Replaces occurrences in a string with specified values. The keys of the `replacements` parameter are used to
 * match ocurrences in `string` and are replaced by the corresponding values of `replacements`;
 *
 * @param {String} string
 * @param {Object} replacements
 */
const stringFormatter = (string, replacements) => {
  const reReplace = new RegExp(`${Object.keys(replacements).join('|')}`, 'g')

  return string.replace(reReplace, (matched) => replacements[matched])
}

export default stringFormatter
