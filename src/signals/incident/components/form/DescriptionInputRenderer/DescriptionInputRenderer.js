// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2022 Gemeente Amsterdam
import PropTypes from 'prop-types'

import FormField from 'components/FormField'

import DescriptionInput from '../DescriptionInput'

const DescriptionInputRenderer = ({
  handler,
  value,
  hasError,
  meta,
  parent,
  getError,
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
      <DescriptionInput
        handler={handler}
        meta={meta}
        parent={parent}
        value={value}
      />
    </FormField>
  )
}

DescriptionInputRenderer.propTypes = {
  handler: PropTypes.func,
  value: PropTypes.string,
  hasError: PropTypes.func,
  meta: PropTypes.object,
  parent: PropTypes.object,
  getError: PropTypes.func,
  validatorsOrOpts: PropTypes.object,
}

export default DescriptionInputRenderer
