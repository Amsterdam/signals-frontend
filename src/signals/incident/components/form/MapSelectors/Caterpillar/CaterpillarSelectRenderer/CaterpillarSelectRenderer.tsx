// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Gemeente Amsterdam
import { FunctionComponent } from 'react'
import FormField from '../../../FormField'
import { FormFieldProps } from '../../../FormField/FormField'
import CaterpillarSelect from '../CaterpillarSelect'
import { Meta } from '../types'

interface CaterpillarSelectRendererProps extends FormFieldProps {
  meta: Meta
  handler: any
  parent: any
  validatorsOrOpts: any
}

const CaterpillarSelectRenderer: FunctionComponent<CaterpillarSelectRendererProps> =
  ({ handler, touched, hasError, meta, parent, getError, validatorsOrOpts }) =>
    meta.isVisible ? (
      <FormField
        meta={meta}
        options={validatorsOrOpts}
        touched={touched}
        hasError={hasError}
        getError={getError}
      >
        <CaterpillarSelect handler={handler} meta={meta} parent={parent} />
      </FormField>
    ) : null

export default CaterpillarSelectRenderer
