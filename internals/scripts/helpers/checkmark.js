// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2021 Gemeente Amsterdam
const chalk = require('chalk')

/**
 * Adds mark check symbol
 */
function addCheckMark(callback) {
  process.stdout.write(chalk.green(' ✓'))
  if (callback) callback()
}

module.exports = addCheckMark
