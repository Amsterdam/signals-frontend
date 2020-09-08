const { validator } = require('@exodus/schemasafe');

const { config } = require('./helpers/config');
const schema = require('../schemas/app.schema.json');

const validate = validator(schema, { includeErrors: true });
const valid = validate(config);

if (!valid) {
  /* eslint-disable no-console */
  console.log('Configuration is not valid according to app.schema.json');
  console.log(validate.errors);
  process.exit(1);
}
