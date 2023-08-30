// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2022 Gemeente Amsterdam
import type { FunctionComponent } from 'react'

import FormField from 'components/FormField'

import AssetSelect from '../AssetSelect'
import type { AssetSelectRendererProps } from '../types'

const AssetSelectRenderer: FunctionComponent<AssetSelectRendererProps> = ({
  handler,
  hasError,
  meta,
  parent,
  getError,
  validatorsOrOpts,
}) =>
  meta?.isVisible ? (
    <FormField
      meta={meta}
      options={validatorsOrOpts}
      hasError={hasError}
      getError={getError}
      isFieldSet
    >
      <AssetSelect value={handler().value} meta={meta} parent={parent} />
    </FormField>
  ) : null

export default AssetSelectRenderer
