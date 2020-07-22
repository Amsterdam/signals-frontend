const { validator } = require('@exodus/schemasafe');

/* eslint-disable no-console, global-require */

const validationSections = {
  config: {
    schema: require('../schemas/environment.conf.schema.json'),
    json: require('../../environment.conf.json'),
  },
  translations: {
    schema: require('../schemas/translations.schema.json'),
    json: require('../../translations.json'),
  },
};

let hasValidationErrors = false;

Object.entries(validationSections).forEach(([section, { schema, json }]) => {
  const validate = validator(schema, { includeErrors: true, allErrors: true });

  if (!validate(json)) {
    console.error(`${section} is not valid`);
    console.table(validate.errors);

    hasValidationErrors = true;
  }
});

if (hasValidationErrors) {
  process.exit(1);
}
