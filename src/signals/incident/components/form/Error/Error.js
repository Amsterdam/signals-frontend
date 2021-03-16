import React from 'react';
import PropTypes from 'prop-types';

import Header from '../Header';
import { InvalidatedProjectKind } from 'typescript';

const Error = ({ meta: { label }, parent: { touched, valid } }) => {
  const hasError = errorType => errorType === 'custom' && !valid;
  const getError = errorType => errorType === 'custom' && label;
  return <Header touched={touched} hasError={hasError} getError={getError} />;
};

Error.propTypes = {
  meta: PropTypes.shape({
    label: PropTypes.string,
  }),
  parent: PropTypes.shape({
    touched: PropTypes.bool,
    valid: PropTypes.bool,
  }),
};

export default Error;
