// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Gemeente Amsterdam
import { withAppContext } from 'test/utils'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { controls } from 'signals/incident/definitions/wizard-step-2-vulaan/afval'
import { meta, selection } from 'utils/__tests__/fixtures/caterpillarsSelection'
import type { AssetListProps } from '../AssetList'
import AssetList from '../AssetList'

describe('AssetList', () => {
  const props: AssetListProps = {
    onRemove: jest.fn(),
    featureTypes: controls.extra_container.meta.featureTypes,
    selection: [{ description: 'Description', id: 'id', type: 'Rest' }],
  }

  const reportedProps: AssetListProps = {
    onRemove: jest.fn(),
    featureTypes: meta.featureTypes,
    selection,
  }

  it('should render an empty selection', () => {
    render(withAppContext(<AssetList {...props} selection={[]} />))

    expect(screen.getByTestId('assetList')).toBeInTheDocument()
    expect(screen.queryAllByRole('listitem').length).toBe(0)
  })

  it('should render a selection of assets', () => {
    render(withAppContext(<AssetList {...props} />))

    expect(screen.getByTestId('assetList')).toBeInTheDocument()
    props.selection.forEach(({ id }) => {
      expect(screen.getByTestId(`assetListItem-${id}`)).toBeInTheDocument()
    })
    expect(screen.getAllByRole('listitem').length).toBe(props.selection.length)
  })

  it('should show that an item was reported before', () => {
    render(withAppContext(<AssetList {...reportedProps} />))

    expect(screen.getByTestId('assetList')).toBeInTheDocument()
    reportedProps.selection.forEach(({ id, isReported }) => {
      if (isReported) {
        expect(
          screen.getByTestId(`assetListItem-${id}-reported`)
        ).toBeInTheDocument()
      }
      if (!isReported) {
        expect(
          screen.queryByTestId(`assetListItem-${id}-reported`)
        ).not.toBeInTheDocument()
      }
    })
    expect(screen.getAllByRole('listitem').length).toBe(
      reportedProps.selection.length
    )
  })

  it('should allow user to remove item', () => {
    render(withAppContext(<AssetList {...props} />))

    const item = props.selection[0]

    const button = screen.getByRole('button')
    userEvent.click(button)

    expect(props.onRemove).toHaveBeenCalledWith(item.id)
  })
})
