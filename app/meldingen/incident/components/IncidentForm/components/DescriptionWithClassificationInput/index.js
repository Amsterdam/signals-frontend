import React from 'react';
import PropTypes from 'prop-types';

import ErrorMessage from '../ErrorMessage/';

const TextInput = ({ handler, touched, hasError, meta }) => (
  <div>
    <textarea placeholder={meta.placeholder} {...handler()} />

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
