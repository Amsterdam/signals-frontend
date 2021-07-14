// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Gemeente Amsterdam
import { withAppContext } from 'test/utils'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { controls } from 'signals/incident/definitions/wizard-step-2-vulaan/openbaarGroenEnWater'
import type { SelectionListProps } from '../SelectionList'
import SelectionList from '../SelectionList'

describe('SelectionList', () => {
  const props: SelectionListProps = {
    onRemove: jest.fn(),
    featureTypes: controls.extra_eikenprocessierups.meta.featureTypes,
    icons: controls.extra_eikenprocessierups.meta.icons,
    selection: [
      {
        description: 'description1',
        id: 'id1',
        type: 'oak',
        isReported: false,
      },
      {
        description: 'description2',
        id: 'id2',
        type: 'oak',
        isReported: true,
      },
    ],
  }

  it('should render an empty selection', () => {
    render(withAppContext(<SelectionList {...props} selection={[]} />))

    expect(screen.getByTestId('selectionList')).toBeInTheDocument()
    expect(screen.queryAllByRole('listitem').length).toBe(0)
  })

  it('should render a selection', () => {
    render(withAppContext(<SelectionList {...props} />))

    expect(screen.getByTestId('selectionList')).toBeInTheDocument()
    props.selection.forEach(({ id }) => {
      expect(screen.getByTestId(`selectionListItem-${id}`)).toBeInTheDocument()
    })
    expect(screen.getAllByRole('listitem').length).toBe(props.selection.length)
  })

  it('should allow user to remove item', () => {
    render(withAppContext(<SelectionList {...props} />))

    const item = props.selection[0]

    const button = screen.getAllByRole('button')[0]
    userEvent.click(button)

    expect(props.onRemove).toHaveBeenCalledWith(item.id)
  })
})
