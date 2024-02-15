// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 Gemeente Amsterdam
import type { FocusEvent, FunctionComponent } from 'react'

import styled from 'styled-components'

import FormField from 'components/FormField'
import type { FormInputProps } from 'types/reactive-form'

import AddNote from './AddNote'

export type TextAreaInputProps = Omit<FormInputProps, 'handler'>

const ThinLabel = styled.span`
  font-weight: 400;
`

const TextareaInput: FunctionComponent<TextAreaInputProps> = ({
  hasError,
  getError,
  meta,
  parent,
  validatorsOrOpts,
  value,
}) => {
  if (!meta) return null

  const { label, subtitle, name, isVisible, maxLength } = meta

  if (!isVisible || !name) return null

  const onBlur = (event: FocusEvent<HTMLTextAreaElement>) => {
    const text = event.target.value

    parent.meta.updateIncident({
      [name]: text,
    })
  }

  const props = {
    isStandalone: false,
    name,
    subtitle,
    maxContentLength: maxLength || undefined,
    label: (
      <>
        {label} <ThinLabel>(niet verplicht)</ThinLabel>
      </>
    ),
    onBlur,
    value,
  }

  return (
    <FormField
      meta={meta}
      options={validatorsOrOpts}
      hasError={hasError}
      getError={getError}
    >
      <AddNote inForm id={meta.name} {...props} />
    </FormField>
  )
}

export default TextareaInput
