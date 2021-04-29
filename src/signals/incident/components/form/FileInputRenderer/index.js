// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Gemeente Amsterdam
import PropTypes from 'prop-types'

import FormField from '../FormField'

import FileInput from '../FileInput'

const FileInputRenderer = ({
  handler,
  touched,
  hasError,
  getError,
  parent,
  meta,
  validatorsOrOpts,
}) => {
  if (!meta?.isVisible) return null

  return (
    <FormField
      meta={meta}
      options={validatorsOrOpts}
      touched={touched}
      hasError={hasError}
      getError={getError}
    >
      <FileInput handler={handler} parent={parent} meta={meta} />
    </FormField>
  )
}

FileInputRenderer.propTypes = {
  handler: PropTypes.func,
  touched: PropTypes.bool,
  hasError: PropTypes.func,
  meta: PropTypes.object,
  parent: PropTypes.object,
  getError: PropTypes.func.isRequired,
  validatorsOrOpts: PropTypes.object,
}

export default FileInputRenderer
