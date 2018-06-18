import React from 'react';
import PropTypes from 'prop-types';

import ErrorMessage from '../ErrorMessage/';

const DescriptionWithClassificationInput = ({ handler, touched, hasError, meta, parent }) => (
  <div>
    <div>{meta.label}</div>
    <div>{meta.subtitle}</div>
    <textarea
      placeholder={meta.placeholder}
      onKeyUp={(e) => parent.meta.getClassification(e.target.value)}
      {...handler()}
    />

    <ErrorMessage
      touched={touched}
      hasError={hasError}
    />
  </div>
);

DescriptionWithClassificationInput.propTypes = {
  handler: PropTypes.func.isRequired,
  touched: PropTypes.bool.isRequired,
  hasError: PropTypes.func.isRequired,
  meta: PropTypes.object.isRequired,
  parent: PropTypes.object.isRequired
};

export default DescriptionWithClassificationInput;
