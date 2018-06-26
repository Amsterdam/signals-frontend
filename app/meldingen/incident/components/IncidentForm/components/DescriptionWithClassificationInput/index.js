import React from 'react';
import PropTypes from 'prop-types';

import Title from '../Title/';
import ErrorMessage from '../ErrorMessage/';

const DescriptionWithClassificationInput = ({ handler, touched, hasError, meta, parent }) => (
  <div className={`row mode_input verplicht ${touched && hasError('required') ? 'row_ongeldig' : ''}`}>
    <Title meta={meta} />
    <div className="input-help col-12">
      <ErrorMessage
        touched={touched}
        hasError={hasError}
      />
    </div>
    <div className={`col-${meta.cols || 12} invoer`}>
      <textarea
        name={meta.id}
        className="input"
        rows="6"
        placeholder={meta.placeholder}
        id={meta.id}
        onKeyUp={(e) => parent.meta.getClassification(e.target.value)}
        {...handler()}
      />
    </div>
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
