// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Gemeente Amsterdam
import { withAppContext } from 'test/utils'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { selection } from 'utils/__tests__/fixtures/caterpillarsSelection'

import type { IconListItemProps } from 'components/IconList/IconList'
import type { HTMLAttributes, PropsWithChildren } from 'react'
import type { Item } from '../../types'
import type { AssetListProps } from './AssetList'

import AssetList from './AssetList'

jest.mock('components/IconList/IconList', () => ({
  __esModule: true,
  default: ({ children, ...props }: HTMLAttributes<HTMLUListElement>) => (
    <ul {...props}>{children}</ul>
  ),
  IconListItem: ({
    children,
    iconUrl,
    featureStatusType,
    id,
    ...props
  }: PropsWithChildren<IconListItemProps>) => (
    <li data-testid={id} {...props}>
      {children}
    </li>
  ),
}))

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
  ]

  const featureStatusTypes = [
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
      statusField: 'AMS_Meldingstatus',
      statusValues: [1],
    },
  ]
  const props: AssetListProps = {
    onRemove: jest.fn(),
    featureTypes: featureTypes,
    featureStatusTypes,
    selection: {
      description: 'Description',
      id: '234',
      type: 'Rest',
      location: {},
      label: 'Rest container - 234',
    },
  }

  const reportedProps: AssetListProps = {
    onRemove: jest.fn(),
    featureTypes: featureTypes,
    featureStatusTypes,
    selection: { ...selection[0], location: {}, label: 'Rest container - 234' },
  }

  it('does not render with empty selection props', () => {
    const emptyId = {
      id: '',
      label: 'Here be a label',
      location: {},
    }

    const { rerender } = render(
      withAppContext(<AssetList {...props} selection={emptyId} />)
    )
    expect(screen.queryByTestId('assetList')).not.toBeInTheDocument()

    const emptyLabel = {
      id: '2983764827364',
      label: '',
      location: {},
    }

    rerender(withAppContext(<AssetList {...props} selection={emptyLabel} />))
    expect(screen.getByTestId('assetList')).toBeInTheDocument()
  })

  it('renders a selection', () => {
    render(withAppContext(<AssetList {...props} />))

    expect(screen.getByTestId('assetList')).toBeInTheDocument()
    expect(
      screen.getByTestId(`assetListItem-${props.selection.id}`)
    ).toBeInTheDocument()
  })

  it('shows reported items', () => {
    selection.forEach((selected: Item) => {
      const { id, status } = selected
      render(
        withAppContext(
          <AssetList
            {...reportedProps}
            selection={{ ...selected, location: {} }}
          />
        )
      )

      if (status === 'reported' || status === 'checked') {
        expect(
          screen.getByTestId(`assetListItem-${id}-hasStatus`)
        ).toBeInTheDocument()
      } else {
        expect(
          screen.queryByTestId(`assetListItem-${id}-hasStatus`)
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
})
