// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2022 Gemeente Amsterdam
import FormField from 'components/FormField'
import PropTypes from 'prop-types'

import FileInput from '../FileInput'

const FileInputRenderer = ({
  handler,
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
      hasError={hasError}
      getError={getError}
    >
      <FileInput handler={handler} parent={parent} meta={meta} />
    </FormField>
  )
}

FileInputRenderer.propTypes = {
  handler: PropTypes.func,
  hasError: PropTypes.func,
  meta: PropTypes.object,
  parent: PropTypes.object,
  getError: PropTypes.func.isRequired,
  validatorsOrOpts: PropTypes.object,
}

export default FileInputRenderer
