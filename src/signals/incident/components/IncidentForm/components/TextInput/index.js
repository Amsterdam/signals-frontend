import React from 'react';
import PropTypes from 'prop-types';

import Header from '../Header/';

const TextInput = ({ handler, touched, hasError, meta, parent, setValue, getError, validatorsOrOpts }) => (
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
            <input
              type={meta.type}
              placeholder={meta.placeholder}
              {...handler()}
              onBlur={(e) => parent.meta.updateIncident({ [meta.name]: e.target.value })}
              onKeyUp={(e) => (meta.autoRemove && setValue && setValue(e.target.value.replace(meta.autoRemove, '')))}
            />
          </div>
        </Header>
      </div>
       : ''}
  </div>
);

TextInput.propTypes = {
  handler: PropTypes.func,
  touched: PropTypes.bool,
  hasError: PropTypes.func,
  meta: PropTypes.object,
  parent: PropTypes.object,
  setValue: PropTypes.func,
  getError: PropTypes.func,
  validatorsOrOpts: PropTypes.object
};

export default TextInput;
