// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2022 Gemeente Amsterdam
import type { FC } from 'react'

import FormField from 'components/FormField'
import type { FormInputProps } from 'types/reactive-form'

import DateTime from './DateTime'

type DateTimeInputProps = Omit<FormInputProps<number | null>, 'handler'>

const DateTimeInput: FC<DateTimeInputProps> = ({
  hasError,
  meta,
  parent,
  getError,
  validatorsOrOpts,
  value,
}) => {
  if (!meta?.isVisible) return null

  const updateTimestamp = (timestamp: number) => {
    parent.meta.updateIncident({ dateTime: timestamp })
  }

  return (
    <FormField
      meta={meta}
      options={validatorsOrOpts}
      hasError={hasError}
      getError={getError}
      isFieldSet
    >
      <DateTime onUpdate={updateTimestamp} value={value} />
    </FormField>
  )
}

export default DateTimeInput
