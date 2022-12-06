// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2022 Gemeente Amsterdam
import FormField from 'components/FormField'
import PropTypes from 'prop-types'
import { getIsAuthenticated } from 'shared/services/auth/auth'

import CategorySelect from '../CategorySelect'

const CategorySelectRenderer = ({
  handler,
  touched,
  hasError,
  meta,
  parent,
  getError,
  validatorsOrOpts,
}) =>
  meta?.isVisible &&
  getIsAuthenticated() && (
    <FormField
      meta={meta}
      options={validatorsOrOpts}
      touched={touched}
      hasError={hasError}
      getError={getError}
    >
      <CategorySelect handler={handler} meta={meta} parent={parent} />
    </FormField>
  )

CategorySelectRenderer.propTypes = {
  handler: PropTypes.func,
  getError: PropTypes.func.isRequired,
  hasError: PropTypes.func.isRequired,
  meta: PropTypes.object,
  parent: PropTypes.object,
  validatorsOrOpts: PropTypes.object,
}

export default CategorySelectRenderer
