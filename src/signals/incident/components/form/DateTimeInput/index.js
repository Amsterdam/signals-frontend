// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2021 Gemeente Amsterdam
import PropTypes from 'prop-types'

import FormField from '../FormField'
import DateTime from './DateTime'

const DateTimeInput = ({
  touched,
  hasError,
  meta,
  parent,
  getError,
  validatorsOrOpts,
}) => {
  if (!meta?.isVisible) return null

  const updateTimestamp = (timestamp) => {
    parent.meta.updateIncident({ dateTime: timestamp })
  }

  return (
    <FormField
      meta={meta}
      options={validatorsOrOpts}
      touched={touched}
      hasError={hasError}
      getError={getError}
    >
      <DateTime onUpdate={updateTimestamp} />
    </FormField>
  )
}

DateTimeInput.defaultProps = {
  hasError: () => {},
}

DateTimeInput.propTypes = {
  touched: PropTypes.bool,
  hasError: PropTypes.func,
  meta: PropTypes.object,
  parent: PropTypes.object,
  getError: PropTypes.func,
  validatorsOrOpts: PropTypes.object,
}

export default DateTimeInput
