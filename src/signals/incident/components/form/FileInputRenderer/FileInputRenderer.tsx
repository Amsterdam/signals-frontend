// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2023 Gemeente Amsterdam
import FormField from 'components/FormField'
import type { FormOptions } from 'types/reactive-form'
import type { ReactiveFormMeta } from 'types/reactive-form'

import FileInput from '../FileInput'
import type { Meta, Parent } from '../types/FileInput'

export interface Props {
  handler: () => { value: File[] }
  hasError: ReactiveFormMeta['hasError']
  getError: ReactiveFormMeta['getError']
  parent: Parent
  meta: Meta
  validatorsOrOpts: FormOptions
}

const FileInputRenderer = ({
  handler,
  hasError,
  getError,
  parent,
  meta,
  validatorsOrOpts,
}: Props) => {
  if (!meta.isVisible) return null

  return (
    <FormField
      meta={meta}
      options={validatorsOrOpts}
      hasError={hasError}
      getError={getError}
      isFieldSet
    >
      <FileInput handler={handler} parent={parent} meta={meta} />
    </FormField>
  )
}

export default FileInputRenderer
