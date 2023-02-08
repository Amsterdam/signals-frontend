// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Vereniging van Nederlandse Gemeenten, Gemeente Amsterdam
const { validator } = require('@exodus/schemasafe')

const { baseConfig } = require('./helpers/config')
const schema = require('../schemas/app.schema.json')

const validate = validator(schema, { includeErrors: true, allErrors: true })
const valid = validate(baseConfig)

if (!valid) {
  /* eslint-disable no-console */
  console.log('Configuration is not valid according to app.schema.json')
  console.table(validate.errors)
  process.exit(1)
}
