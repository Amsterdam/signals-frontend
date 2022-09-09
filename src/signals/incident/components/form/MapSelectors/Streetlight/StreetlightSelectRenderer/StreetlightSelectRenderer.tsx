// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2022 Gemeente Amsterdam
import type { FunctionComponent } from 'react'

import FormField from '../../../FormField'
import AssetSelect from '../../Asset'
import type { AssetSelectRendererProps } from '../../Asset/types'
import Layer from '../StreetlightLayer'

const StreetlightSelectRenderer: FunctionComponent<
  AssetSelectRendererProps
> = ({ handler, hasError, meta, parent, getError, validatorsOrOpts }) =>
  meta.isVisible ? (
    <FormField
      meta={meta}
      options={validatorsOrOpts}
      hasError={hasError}
      getError={getError}
    >
      <AssetSelect
        value={handler().value}
        meta={meta}
        parent={parent}
        layer={Layer}
      />
    </FormField>
  ) : null

export default StreetlightSelectRenderer
