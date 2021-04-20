// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2021 Gemeente Amsterdam
const exec = require('child_process').exec
exec('npm -v', (err, stdout) => {
  if (err) throw err
  if (Number.parseFloat(stdout) < 3) {
    throw new Error('[ERROR: React Boilerplate] You need npm version @>=3')
  }
})
