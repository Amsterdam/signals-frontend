// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 Gemeente Amsterdam
import type { FunctionComponent } from 'react'

import Input from 'components/Input'
import type { FormInputProps } from 'types/reactive-form'

import FormField from '../FormField'

export type TextInputProps = FormInputProps

const TextInput: FunctionComponent<TextInputProps> = ({
  handler,
  hasError,
  meta,
  parent,
  getError,
  validatorsOrOpts,
}) =>
  (meta?.isVisible && (
    <FormField
      meta={meta}
      options={validatorsOrOpts}
      hasError={hasError}
      getError={getError}
    >
      <Input
        id={meta.name}
        aria-describedby={meta.subtitle && `subtitle-${meta.name}`}
        autoComplete={meta.autoComplete}
        type={meta.type}
        placeholder={meta.placeholder}
        {...handler()}
        onBlur={(event) => {
          if (!meta.name) {
            return
          }
          const inputValue = {
            [meta.name]: meta.autoRemove
              ? event.target.value.replace(meta.autoRemove, '')
              : event.target.value,
          }
          handler()?.onBlur(event)
          parent.meta.updateIncident(inputValue)
        }}
      />
    </FormField>
  )) ||
  null

export default TextInput
