// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Gemeente Amsterdam
import { FunctionComponent } from 'react'
import FormField from '../../../FormField'
import { FormFieldProps } from '../../../FormField/FormField'
import AssetSelect from '../../Asset'
import Layer from '../StreetlightLayer'
import type { Meta } from '../../Asset/types'

interface StreetlightSelectRendererProps extends FormFieldProps {
  meta: Meta
  handler: any
  parent: any
  validatorsOrOpts: any
}

const StreetlightSelectRenderer: FunctionComponent<StreetlightSelectRendererProps> =
  ({ handler, touched, hasError, meta, parent, getError, validatorsOrOpts }) =>
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

export default StreetlightSelectRenderer
