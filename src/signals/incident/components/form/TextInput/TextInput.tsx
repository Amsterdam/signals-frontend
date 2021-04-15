// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 Gemeente Amsterdam
import type { FunctionComponent } from 'react'
import React from 'react'
import Input from 'components/Input'

import Header from '../Header'
import type { FormInputProps } from 'types/reactive-form'

export type TextInputProps = FormInputProps

const TextInput: FunctionComponent<TextInputProps> = ({
  handler,
  touched,
  hasError,
  meta,
  parent,
  getError,
  validatorsOrOpts,
}) =>
  (meta?.isVisible && (
    <Header
      meta={meta}
      options={validatorsOrOpts}
      touched={touched}
      hasError={hasError}
      getError={getError}
    >
      <Input
        id={meta.name}
        aria-describedby={meta.subtitle && `subtitle-${meta.name}`}
        autoFocus={meta.autoFocus}
        autoComplete={meta.autoComplete}
        type={meta.type}
        placeholder={meta.placeholder}
        {...handler()}
        onBlur={(event) => {
          parent.meta.updateIncident({
            [meta.name]: meta.autoRemove
              ? event.target.value.replace(meta.autoRemove, '')
              : event.target.value,
          })
        }}
      />
    </Header>
  )) ||
  null

export default TextInput
