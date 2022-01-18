// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Gemeente Amsterdam
import type { FunctionComponent } from 'react'
import FormField from '../../../FormField'
import AssetSelect from '../../Asset'
import Layer from '../CaterpillarLayer'
import type { AssetSelectRendererProps } from '../../Asset/types'

const CaterpillarSelectRenderer: FunctionComponent<AssetSelectRendererProps> =
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

export default CaterpillarSelectRenderer
