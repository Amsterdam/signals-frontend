// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 Gemeente Amsterdam
import { render } from '@testing-library/react'
import SelectionList from 'signals/incident/components/form/MapSelectors/Caterpillar/SelectionList'

import CaterpillarListPreview from './CaterpillarListPreview'
import type { CaterpillarListPreviewProps } from './CaterpillarListPreview'

jest.mock(
  'signals/incident/components/form/MapSelectors/Caterpillar/SelectionList',
  () => jest.fn().mockImplementation(() => null)
)

describe('CaterpillarListPreview', () => {
  it('should render SelectionList with props', () => {
    const props = {
      value: [{ id: 'id', type: 'type', description: 'description' }],
      meta: {
        featureTypes: [],
        icons: [],
      },
    } as unknown as CaterpillarListPreviewProps

    render(<CaterpillarListPreview value={props.value} meta={props.meta} />)

    expect(SelectionList).toHaveBeenCalledWith(
      expect.objectContaining({
        selection: props.value,
        featureTypes: props.meta.featureTypes,
        icons: props.meta.icons,
      }),
      {}
    )
  })
})
