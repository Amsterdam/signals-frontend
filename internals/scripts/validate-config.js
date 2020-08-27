const { validator } = require('@exodus/schemasafe');
const merge = require('lodash.merge');

const schema = require('../schemas/environment.conf.schema.json');

const baseConfig = require('../../environment.base.conf.json');
const extendedConfig = require('../../environment.conf.json');

const combinedConfig = merge({}, baseConfig, extendedConfig);

const validate = validator(schema, { includeErrors: true });
const valid = validate(combinedConfig);

if (!valid) {
  /* eslint-disable no-console */
  console.log('Configuration is not valid according to environment.conf.schema.json');
  console.log(validate.errors);
  process.exit(1);
}
