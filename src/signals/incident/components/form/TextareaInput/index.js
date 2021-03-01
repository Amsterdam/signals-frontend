import React from 'react';
import PropTypes from 'prop-types';
import TextArea from 'components/TextArea';

import Header from '../Header';

const TextareaInput = ({ handler, touched, value, hasError, meta, parent, getError, validatorsOrOpts }) =>
  meta?.isVisible && (
    <Header meta={meta} options={validatorsOrOpts} touched={touched} hasError={hasError} getError={getError}>
      <TextArea
        id={meta.id}
        placeholder={meta.placeholder}
        {...handler()}
        onBlur={event =>
          parent.meta.updateIncident({
            [meta.name]: meta.autoRemove ? event.target.value.replace(meta.autoRemove, '') : event.target.value,
          })}
        helpText={meta.maxLength > 0 && `${value ? value.length : '0'}/${meta.maxLength} tekens`}
      />
    </Header>
  );

TextareaInput.propTypes = {
  handler: PropTypes.func,
  touched: PropTypes.bool,
  value: PropTypes.string,
  hasError: PropTypes.func,
  meta: PropTypes.object,
  parent: PropTypes.object,
  getError: PropTypes.func,
  validatorsOrOpts: PropTypes.object,
};

export default TextareaInput;
