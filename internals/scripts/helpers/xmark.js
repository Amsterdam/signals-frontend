// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2021 Gemeente Amsterdam
const chalk = require('chalk')

/**
 * Adds mark cross symbol
 */
function addXMark(callback) {
  process.stdout.write(chalk.red(' ✘'))
  if (callback) callback()
}

module.exports = addXMark
