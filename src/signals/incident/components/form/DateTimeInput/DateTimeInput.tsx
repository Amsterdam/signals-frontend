// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2021 Gemeente Amsterdam
import type { FC } from 'react'
import type { FormInputProps } from 'types/reactive-form'

import FormField from '../FormField'
import DateTime from './DateTime'

type DateTimeInputProps = Omit<FormInputProps<number | null>, 'handler'>

const DateTimeInput: FC<DateTimeInputProps> = ({
  touched,
  hasError,
  meta,
  parent,
  getError,
  validatorsOrOpts,
  value,
}) => {
  if (!meta?.isVisible || typeof value === 'undefined') return null

  const updateTimestamp = (timestamp: number) => {
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
      <DateTime onUpdate={updateTimestamp} value={value} />
    </FormField>
  )
}

export default DateTimeInput
