// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 Gemeente Amsterdam
import { render, screen } from '@testing-library/react'
import { withAppContext } from 'test/utils'

import {
  oak,
  select,
  unknown,
} from 'signals/incident/definitions/wizard-step-2-vulaan/caterpillar-icons'
import userEvent from '@testing-library/user-event'
import SelectionPanel from '../SelectionPanel'
import type { SelectionPanelProps } from '../SelectionPanel'
import { UNREGISTERED_TYPE } from '../../../../constants'

describe('SelectionPanel', () => {
  const TREE_FEATURE = {
    label: 'Boom',
    description: 'Boom',
    icon: {
      options: {},
      iconSvg: oak,
      selectedIconSvg: select,
    },
    idField: 'id_nummer',
    typeValue: 'Boom',
    iconId: 'iconId',
    iconIsReportedId: 'iconIsReportedId',
    isReportedField: 'isReportedField',
    isReportedValue: 'isReportedValue',
  }
  const UNREGISTERED_FEATURE = {
    description: 'De Caterpillar staat niet op de kaart',
    label: 'Onbekend',
    icon: {
      iconSvg: unknown,
      selectedIconSvg: select,
    },
    idField: 'id',
    typeValue: UNREGISTERED_TYPE,
    iconId: 'iconId',
    iconIsReportedId: 'iconIsReportedId',
    isReportedField: 'isReportedField',
    isReportedValue: 'isReportedValue',
  }
  const UNREGISTERED_TREE = {
    description: 'De Caterpillar staat niet op de kaart',
    id: '',
    type: 'not-on-map',
  }
  const TREE = {
    id: 'GLAS123',
    description: 'Eikenboom',
    type: 'Boom',
  }

  const props: SelectionPanelProps = {
    featureTypes: [TREE_FEATURE, UNREGISTERED_FEATURE],
    onChange: jest.fn(),
    onClose: jest.fn(),
    selection: [],
    variant: 'drawer',
    icons: [],
  }

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('renders the panel', () => {
    render(withAppContext(<SelectionPanel {...props} />))

    expect(
      screen.getByRole('heading', { name: 'Kies de boom' })
    ).toBeInTheDocument()
    expect(screen.getByText('Maak een keuze op de kaart')).toBeInTheDocument()
    expect(
      screen.getByRole('checkbox', {
        name: 'De boom staat niet op de kaart',
      })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Meld deze boom' })
    ).toBeInTheDocument()
  })

  it('renders selected trees', () => {
    render(
      withAppContext(
        <SelectionPanel
          {...props}
          selection={[TREE, { ...TREE, id: 'GLAS456' }]}
        />
      )
    )

    expect(
      screen.queryByText('Maak een keuze op de kaart')
    ).not.toBeInTheDocument()
    expect(screen.getByText('Eikenboom - GLAS123')).toBeInTheDocument()
    expect(screen.getByText('Eikenboom - GLAS456')).toBeInTheDocument()
    expect(screen.getAllByRole('listitem').length).toBe(2)
  })

  it('removes selected tree', () => {
    render(withAppContext(<SelectionPanel {...props} selection={[TREE]} />))

    const selectedItem = screen.getByRole('listitem')
    const removeButton = selectedItem.querySelector('button')

    if (removeButton) {
      userEvent.click(removeButton)
    }

    expect(props.onChange).toHaveBeenCalledWith([])
  })

  it('adds tree not on map', () => {
    render(withAppContext(<SelectionPanel {...props} />))

    userEvent.click(
      screen.getByRole('checkbox', {
        name: 'De boom staat niet op de kaart',
      })
    )

    expect(props.onChange).toHaveBeenCalledWith([UNREGISTERED_TREE])
  })

  it('removes tree not on map', () => {
    render(
      withAppContext(
        <SelectionPanel {...props} selection={[UNREGISTERED_TREE]} />
      )
    )

    userEvent.click(
      screen.getByRole('checkbox', {
        name: 'De boom staat niet op de kaart',
      })
    )

    expect(props.onChange).toHaveBeenCalledWith([])
  })

  it('closes/submits the panel', () => {
    render(withAppContext(<SelectionPanel {...props} />))

    userEvent.click(screen.getByRole('button', { name: 'Meld deze boom' }))

    expect(props.onClose).toHaveBeenCalled()
  })
})
