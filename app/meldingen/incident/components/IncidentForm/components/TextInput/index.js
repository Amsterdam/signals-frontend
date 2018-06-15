import React from 'react';
import PropTypes from 'prop-types';

import ErrorMessage from '../ErrorMessage/';

const DescriptionWithClassificationInput = ({ handler, touched, hasError, meta }) => (
  <div>
    <input type={meta.type} placeholder={meta.placeholder} readOnly={meta.readOnly} {...handler()} />

    <ErrorMessage
      touched={touched}
      hasError={hasError}
    />
  </div>
);

DescriptionWithClassificationInput.propTypes = {
  handler: PropTypes.func,
  touched: PropTypes.bool,
  hasError: PropTypes.func,
  meta: PropTypes.object
};

export default DescriptionWithClassificationInput;
