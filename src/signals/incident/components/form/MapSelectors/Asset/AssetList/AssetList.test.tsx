// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Gemeente Amsterdam
import { withAppContext } from 'test/utils'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { controls } from 'signals/incident/definitions/wizard-step-2-vulaan/afval'
import { meta, selection } from 'utils/__tests__/fixtures/caterpillarsSelection'

import type { Item } from '../types'
import type { AssetListProps } from './AssetList'

import AssetList from './AssetList'

describe('AssetList', () => {
  const props: AssetListProps = {
    onRemove: jest.fn(),
    featureTypes: controls.extra_container.meta.featureTypes,
    selection: {
      description: 'Description',
      id: 'id',
      type: 'Rest',
      location: {},
    },
  }

  const reportedProps: AssetListProps = {
    onRemove: jest.fn(),
    featureTypes: meta.featureTypes,
    selection: { ...selection[0], location: {} },
  }

  it('should render a selection', () => {
    render(withAppContext(<AssetList {...props} />))

    expect(screen.getByTestId('assetList')).toBeInTheDocument()
    expect(
      screen.getByTestId(`assetListItem-${props.selection.id}`)
    ).toBeInTheDocument()
  })

  it('should show that an item was reported before', () => {
    selection.forEach((selected: Item) => {
      const { id, isReported } = selected
      render(
        withAppContext(
          <AssetList
            {...reportedProps}
            selection={{ ...selected, location: {} }}
          />
        )
      )

      if (isReported) {
        expect(
          screen.getByTestId(`assetListItem-${id}-reported`)
        ).toBeInTheDocument()
      } else {
        expect(
          screen.queryByTestId(`assetListItem-${id}-reported`)
        ).not.toBeInTheDocument()
      }
    })
  })

  it('should allow user to remove item', () => {
    render(withAppContext(<AssetList {...props} />))

    const button = screen.getByRole('button')

    expect(props.onRemove).not.toHaveBeenCalled()

    userEvent.click(button)

    expect(props.onRemove).toHaveBeenCalled()
  })
})
