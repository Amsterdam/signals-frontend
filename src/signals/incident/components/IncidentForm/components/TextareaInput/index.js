import React from 'react';
import PropTypes from 'prop-types';

import Header from '../Header/';

const TextareaInput = ({ handler, touched, value, hasError, meta, parent, getError, validatorsOrOpts }) => (
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
              placeholder={meta.placeholder}
              {...handler()}
              onBlur={(e) => parent.meta.updateIncident({ [meta.name]: e.target.value })}
            />
            { meta.maxLength &&
              <div className="input-help">
                <span className="text-area-input__counter">
                  {`${value ? value.length : '0'}/${meta.maxLength} tekens` }
                </span>
              </div>
            }
          </div>
        </Header>
      </div>
       : ''}
  </div>
);

TextareaInput.propTypes = {
  handler: PropTypes.func,
  touched: PropTypes.bool,
  value: PropTypes.string,
  hasError: PropTypes.func,
  meta: PropTypes.object,
  parent: PropTypes.object,
  getError: PropTypes.func,
  validatorsOrOpts: PropTypes.object
};

export default TextareaInput;
