import React from 'react';
import PropTypes from 'prop-types';

import Title from '../Title/';
import ErrorMessage from '../ErrorMessage/';

const TextInput = ({ handler, touched, hasError, meta }) => (
  <div>
    <Title meta={meta} />

    <input type={meta.type} placeholder={meta.placeholder} readOnly={meta.readOnly} {...handler()} />

    <ErrorMessage
      touched={touched}
      hasError={hasError}
    />
  </div>
);

TextInput.propTypes = {
  handler: PropTypes.func,
  touched: PropTypes.bool,
  hasError: PropTypes.func,
  meta: PropTypes.object
};

export default TextInput;
