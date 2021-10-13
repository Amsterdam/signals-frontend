// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Gemeente Amsterdam
import PropTypes from 'prop-types'
import FormField from '../../../FormField'
import AssetSelect from '../AssetSelect'

const AssetSelectRenderer = ({
  handler,
  touched,
  hasError,
  meta,
  parent,
  getError,
  validatorsOrOpts,
}) =>
  meta?.isVisible && (
    <FormField
      meta={meta}
      options={validatorsOrOpts}
      touched={touched}
      hasError={hasError}
      getError={getError}
    >
      <AssetSelect handler={handler} meta={meta} parent={parent} />
    </FormField>
  )

AssetSelectRenderer.propTypes = {
  handler: PropTypes.func,
  touched: PropTypes.bool,
  getError: PropTypes.func.isRequired,
  hasError: PropTypes.func.isRequired,
  meta: PropTypes.object,
  parent: PropTypes.object,
  validatorsOrOpts: PropTypes.object,
}

export default AssetSelectRenderer
