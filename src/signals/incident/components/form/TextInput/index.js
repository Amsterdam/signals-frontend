import React from 'react';
import PropTypes from 'prop-types';
import Input from 'components/Input';

import Header from '../Header';

const TextInput = ({ handler, touched, hasError, meta, parent, getError, validatorsOrOpts }) => (
  <div className={`${meta?.isVisible ? 'row' : ''}`}>
    {meta?.isVisible && (
      <div className={`${meta.className || 'col-12'} mode_input`}>
        <Header meta={meta} options={validatorsOrOpts} touched={touched} hasError={hasError} getError={getError}>
          <Input
            autoFocus={meta?.autoFocus}
            type={meta.type}
            placeholder={meta.placeholder}
            {...handler()}
            onBlur={e =>
              parent.meta.updateIncident({
                [meta.name]: meta.autoRemove ? e.target.value.replace(meta.autoRemove, '') : e.target.value,
              })
            }
          />
        </Header>
      </div>
    )}
  </div>
);

TextInput.propTypes = {
  handler: PropTypes.func,
  touched: PropTypes.bool,
  hasError: PropTypes.func,
  meta: PropTypes.object,
  parent: PropTypes.object,
  getError: PropTypes.func,
  validatorsOrOpts: PropTypes.object,
};

export default TextInput;
