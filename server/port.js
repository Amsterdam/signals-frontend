// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2021 Gemeente Amsterdam
const argv = require('./argv')

module.exports = Number.parseInt(argv.port || process.env.PORT || '3000', 10)
