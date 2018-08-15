import React from 'react';
import PropTypes from 'prop-types';

import Title from '../Title/';
import ErrorMessage from '../ErrorMessage/';

function get(e, meta, parent) {
  parent.meta.getClassification(e.target.value);
  parent.meta.setIncident({ [meta.name]: e.target.value });
}


const DescriptionWithClassificationInput = ({ handler, touched, hasError, meta, parent, getError }) => (
  <div>
    {meta && meta.ifVisible ?
      <div className={`row mode_input verplicht ${touched && hasError('required') ? 'row_ongeldig' : ''}`}>
        <Title meta={meta} />
        <div className="input-help col-12">
          <ErrorMessage
            touched={touched}
            hasError={hasError}
            getError={getError}
          />
        </div>
        <div className={`col-${meta.cols || 12} invoer`}>
          <textarea
            className="input"
            rows={meta.rows || 6}
            placeholder={meta.placeholder}
            {...handler()}
            onBlur={(e) => get(e, meta, parent)}
          />
        </div>
      </div>
       : ''}
  </div>
);

DescriptionWithClassificationInput.propTypes = {
  handler: PropTypes.func,
  touched: PropTypes.bool,
  hasError: PropTypes.func,
  meta: PropTypes.object,
  parent: PropTypes.object,
  getError: PropTypes.func
};

export default DescriptionWithClassificationInput;
