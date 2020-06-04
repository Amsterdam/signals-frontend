import React from 'react';
import PropTypes from 'prop-types';
import TextArea from 'components/TextArea';

import Header from '../Header';

import './style.scss';

function get(e, meta, parent) {
  if(e.target.value) parent.meta.getClassification(e.target.value);
  parent.meta.updateIncident({ [meta.name]: e.target.value });
}

const DescriptionWithClassificationInput = ({
  handler,
  touched,
  value,
  hasError,
  meta,
  parent,
  getError,
  validatorsOrOpts,
}) =>
  meta?.isVisible && (
    <Header meta={meta} options={validatorsOrOpts} touched={touched} hasError={hasError} getError={getError}>
      <TextArea
        rows={meta.rows || 6}
        placeholder={meta.placeholder}
        {...handler()}
        onBlur={e => get(e, meta, parent)}
        helpText={meta.maxLength > 0 && `${value ? value.length : '0'}/${meta.maxLength} tekens`}
      />
    </Header>
  );

DescriptionWithClassificationInput.propTypes = {
  handler: PropTypes.func,
  touched: PropTypes.bool,
  value: PropTypes.string,
  hasError: PropTypes.func,
  meta: PropTypes.object,
  parent: PropTypes.object,
  getError: PropTypes.func,
  validatorsOrOpts: PropTypes.object,
};

export default DescriptionWithClassificationInput;
