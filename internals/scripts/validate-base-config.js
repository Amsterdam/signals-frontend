const { validator } = require('@exodus/schemasafe');

const { baseConfig } = require('./helpers/config');
const schema = require('../schemas/app.schema.json');

const validate = validator(schema, { includeErrors: true, allErrors: true });
const valid = validate(baseConfig);

if (!valid) {
  /* eslint-disable no-console */
  console.log('Configuration is not valid according to app.schema.json');
  console.table(validate.errors);
  process.exit(1);
}
