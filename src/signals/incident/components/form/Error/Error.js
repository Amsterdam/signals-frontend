import React from 'react';
import PropTypes from 'prop-types';

import Header from '../Header';
import { InvalidatedProjectKind } from 'typescript';

const Error = ({ meta, parent: { touched, valid } }) => {
  const hasError = errorType => errorType === 'global' && !valid;
  const getError = errorType => (errorType === 'global' && meta.label) || true;
  return <Header meta={{ name: 'global' }} touched={touched} hasError={hasError} getError={getError} />;
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
