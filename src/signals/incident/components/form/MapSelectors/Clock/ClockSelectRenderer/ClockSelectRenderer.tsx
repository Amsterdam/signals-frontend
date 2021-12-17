// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Gemeente Amsterdam
import type { FunctionComponent } from 'react'
import FormField from '../../../FormField'
import type { FormFieldProps } from '../../../FormField/FormField'
import AssetSelect from '../../Asset'
import Layer from '../ClockLayer'
import type { Meta } from '../../Asset/types'

interface ClockSelectRendererProps extends FormFieldProps {
  meta: Meta
  handler: any
  parent: any
  validatorsOrOpts: any
}

const ClockSelectRenderer: FunctionComponent<ClockSelectRendererProps> = ({
  handler,
  touched,
  hasError,
  meta,
  parent,
  getError,
  validatorsOrOpts,
}) =>
  meta.isVisible ? (
    <FormField
      meta={meta}
      options={validatorsOrOpts}
      touched={touched}
      hasError={hasError}
      getError={getError}
    >
      <AssetSelect
        handler={handler}
        meta={meta}
        parent={parent}
        layer={Layer}
      />
    </FormField>
  ) : null

export default ClockSelectRenderer
