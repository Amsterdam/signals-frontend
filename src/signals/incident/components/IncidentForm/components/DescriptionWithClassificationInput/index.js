import React from 'react';
import PropTypes from 'prop-types';

import Header from '../Header/';

function get(e, meta, parent) {
  parent.meta.getClassification(e.target.value);
  parent.meta.setIncident({ [meta.name]: e.target.value });
}


const DescriptionWithClassificationInput = ({ handler, touched, hasError, meta, parent, getError, validatorsOrOpts }) => (
  <div className={`${meta && meta.isVisible ? 'row' : ''}`}>
    {meta && meta.isVisible ?
      <div className={`${meta.className || 'col-12'} mode_input`}>
        <Header
          meta={meta}
          options={validatorsOrOpts}
          touched={touched}
          hasError={hasError}
          getError={getError}
        >
          <div className="invoer">
            <textarea
              className="input"
              rows={meta.rows || 6}
              placeholder={meta.placeholder}
              {...handler()}
              onBlur={(e) => get(e, meta, parent)}
            />
          </div>
        </Header>
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
  getError: PropTypes.func,
  validatorsOrOpts: PropTypes.object
};

export default DescriptionWithClassificationInput;
