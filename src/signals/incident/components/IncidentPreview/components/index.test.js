// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2021 Gemeente Amsterdam
import AssetListPreview from './AssetListPreview'
import DateTime from './DateTime'
import Image from './Image'
import MapPreview from './MapPreview'
import MapSelectPreview from './MapSelect'

import ListObjectValue from './ListObjectValue'
import components from '.'

describe('Preview components', () => {
  it('should load all components', () => {
    expect(components).toEqual({
      AssetListPreview,
      DateTime,
      ListObjectValue,
      Image,
      MapPreview,
      MapSelectPreview,
    })
  })
})
