const { validator } = require('@exodus/schemasafe');
const schema = require('../schemas/environment.conf.schema.json');
const config = require('../../environment.conf.json');

const validate = validator(schema, { includeErrors: true });
const valid = validate(config);

if (!valid) {
  console.log('environment.conf.json is not valid according to environment.conf.schema.json');
  console.log(validate.errors);
  process.exit(1);
}
