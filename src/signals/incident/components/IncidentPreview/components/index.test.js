// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2021 Gemeente Amsterdam
import components from '.'
import AssetListPreview from './AssetListPreview'
import DateTime from './DateTime'
import Image from './Image'
import ListObjectValue from './ListObjectValue'

describe('Preview components', () => {
  it('should load all components', () => {
    expect(components).toEqual({
      AssetListPreview,
      DateTime,
      ListObjectValue,
      Image,
    })
  })
})
