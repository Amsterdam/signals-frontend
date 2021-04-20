// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Gemeente Amsterdam
import React from 'react';
import PropTypes from 'prop-types';
import { isAuthenticated } from 'shared/services/auth/auth';
import FormField from '../FormField';
import CategorySelect from '../CategorySelect';

const CategorySelectRenderer = ({ handler, touched, hasError, meta, parent, getError, validatorsOrOpts }) =>
  meta?.isVisible && isAuthenticated() && (
    <FormField meta={meta} options={validatorsOrOpts} touched={touched} hasError={hasError} getError={getError}>
      <CategorySelect handler={handler} meta={meta} parent={parent} />
    </FormField>
  );

CategorySelectRenderer.propTypes = {
  handler: PropTypes.func,
  touched: PropTypes.bool,
  getError: PropTypes.func.isRequired,
  hasError: PropTypes.func.isRequired,
  meta: PropTypes.object,
  parent: PropTypes.object,
  validatorsOrOpts: PropTypes.object,
};

export default CategorySelectRenderer;
