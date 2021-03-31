// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Gemeente Amsterdam
import React from 'react';
import PropTypes from 'prop-types';
import Header from '../Header';
import DescriptionInput from '../DescriptionInput';

const DescriptionInputRenderer = ({
  handler,
  touched,
  value,
  hasError,
  meta,
  parent,
  getError,
  validatorsOrOpts,
}) => {
  if (!meta?.isVisible) return null;

  return (
    <Header meta={meta} options={validatorsOrOpts} touched={touched} hasError={hasError} getError={getError}>
      <DescriptionInput handler={handler} meta={meta} parent={parent} value={value} />
    </Header>
  );
};

DescriptionInputRenderer.propTypes = {
  handler: PropTypes.func,
  touched: PropTypes.bool,
  value: PropTypes.string,
  hasError: PropTypes.func,
  meta: PropTypes.object,
  parent: PropTypes.object,
  getError: PropTypes.func,
  validatorsOrOpts: PropTypes.object,
};

export default DescriptionInputRenderer;
