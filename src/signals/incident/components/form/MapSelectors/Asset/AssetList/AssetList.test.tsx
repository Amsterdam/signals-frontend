// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Gemeente Amsterdam
import { withAppContext } from 'test/utils'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { selection } from 'utils/__tests__/fixtures/caterpillarsSelection'

import type { FeatureType, Item } from '../../types'
import type { AssetListProps } from './AssetList'

import AssetList from './AssetList'

describe('AssetList', () => {
  const featureTypes = [
    {
      label: 'Restafval',
      description: 'Restafval container',
      icon: {
        options: {},
        iconUrl: '',
      },
      idField: 'id_nummer',
      typeField: 'fractie_omschrijving',
      typeValue: 'Rest',
    },
    {
      label: 'Is gemeld',
      description: 'Object is reeds gemeld',
      icon: {
        options: {},
        iconUrl: '',
      },
      idField: 'OBJECTID',
      typeValue: 'reported',
      typeField: '',
      isReportedField: 'AMS_Meldingstatus',
      isReportedValue: 1,
    },
  ]
  const props: AssetListProps = {
    onRemove: jest.fn(),
    featureTypes: featureTypes as FeatureType[],
    selection: {
      description: 'Description',
      id: 'id',
      type: 'Rest',
      location: {},
    },
  }

  const reportedProps: AssetListProps = {
    onRemove: jest.fn(),
    featureTypes: featureTypes as FeatureType[],
    selection: { ...selection[0], location: {} },
  }

  it('renders a selection', () => {
    render(withAppContext(<AssetList {...props} />))

    expect(screen.getByTestId('assetList')).toBeInTheDocument()
    expect(
      screen.getByTestId(`assetListItem-${props.selection.id}`)
    ).toBeInTheDocument()
  })

  it('shows reported items', () => {
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

  it('calls onRemove handler', () => {
    render(withAppContext(<AssetList {...props} />))

    const button = screen.getByRole('button')

    expect(props.onRemove).not.toHaveBeenCalled()

    userEvent.click(button)

    expect(props.onRemove).toHaveBeenCalled()
  })

  it('displays an item label', () => {
    const {
      selection: { type, id },
    } = props
    const { description } =
      props.featureTypes.find(({ typeValue }) => typeValue === type) ?? {}

    const { rerender } = render(withAppContext(<AssetList {...props} />))

    expect(screen.getByText(`${description} - ${id}`)).toBeInTheDocument()

    const selectionWithoutId = {
      ...props.selection,
      id: '',
    }

    rerender(
      withAppContext(<AssetList {...props} selection={selectionWithoutId} />)
    )

    expect(screen.queryByText(`${description} - ${id}`)).not.toBeInTheDocument()
    expect(screen.getByText(description || '')).toBeInTheDocument()
  })
})
