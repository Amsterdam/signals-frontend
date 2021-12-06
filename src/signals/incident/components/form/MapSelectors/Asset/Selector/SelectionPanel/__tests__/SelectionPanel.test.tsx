// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 Gemeente Amsterdam
import { render, screen } from '@testing-library/react'
import { withAppContext } from 'test/utils'

import {
  glas,
  select,
  unknown,
} from 'signals/incident/definitions/wizard-step-2-vulaan/afval-icons'
import userEvent from '@testing-library/user-event'
import SelectionPanel from '../SelectionPanel'
import type { SelectionPanelProps } from '../SelectionPanel'
import { UNREGISTERED_TYPE } from '../../../../constants'

describe('SelectionPanel', () => {
  const GLAS_FEATURE = {
    label: 'Glas',
    description: 'Glas container',
    icon: {
      options: {},
      iconSvg: glas,
      selectedIconSvg: select,
    },
    idField: 'id_nummer',
    typeField: 'fractie_omschrijving',
    typeValue: 'Glas',
  }
  const UNREGISTERED_FEATURE = {
    description: 'Het object staat niet op de kaart',
    label: 'Onbekend',
    icon: {
      iconSvg: unknown,
      selectedIconSvg: select,
    },
    idField: 'id',
    typeField: 'type',
    typeValue: UNREGISTERED_TYPE,
  }
  const UNREGISTERED_CONTAINER = {
    description: 'Het object staat niet op de kaart',
    id: '',
    type: 'not-on-map',
  }
  const GLAS_CONTAINER = {
    id: 'GLAS123',
    description: 'Glas container',
    type: 'Glas',
  }

  const props: SelectionPanelProps = {
    featureTypes: [GLAS_FEATURE, UNREGISTERED_FEATURE],
    onChange: jest.fn(),
    onClose: jest.fn(),
    selection: [],
    variant: 'drawer',
  }

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('renders the panel', () => {
    render(withAppContext(<SelectionPanel {...props} />))

    expect(
      screen.getByRole('heading', { name: 'Kies het object' })
    ).toBeInTheDocument()
    expect(screen.getByText('Maak een keuze op de kaart')).toBeInTheDocument()
    expect(
      screen.getByRole('checkbox', {
        name: 'Het object staat niet op de kaart',
      })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Meld dit object' })
    ).toBeInTheDocument()
  })

  it('renders selected assets', () => {
    render(
      withAppContext(
        <SelectionPanel
          {...props}
          selection={[GLAS_CONTAINER, { ...GLAS_CONTAINER, id: 'GLAS456' }]}
        />
      )
    )

    expect(
      screen.queryByText('Maak een keuze op de kaart')
    ).not.toBeInTheDocument()
    expect(screen.getByText('Glas container - GLAS123')).toBeInTheDocument()
    expect(screen.getByText('Glas container - GLAS456')).toBeInTheDocument()
    expect(screen.getAllByRole('listitem').length).toBe(2)
  })

  it('removes selected asset', () => {
    render(
      withAppContext(<SelectionPanel {...props} selection={[GLAS_CONTAINER]} />)
    )

    const selectedItem = screen.getByRole('listitem')
    const removeButton = selectedItem.querySelector('button')

    if (removeButton) {
      userEvent.click(removeButton)
    }

    expect(props.onChange).toHaveBeenCalledWith([])
  })

  it('adds asset not on map', () => {
    render(withAppContext(<SelectionPanel {...props} />))

    userEvent.click(
      screen.getByRole('checkbox', {
        name: 'Het object staat niet op de kaart',
      })
    )

    expect(props.onChange).toHaveBeenCalledWith([UNREGISTERED_CONTAINER])
  })

  it('updates asset not on map', () => {
    render(
      withAppContext(
        <SelectionPanel {...props} selection={[UNREGISTERED_CONTAINER]} />
      )
    )

    userEvent.paste(
      screen.getByLabelText(
        'Wat is het nummer van het object? (niet verplicht)'
      ),
      'GLAS987'
    )

    expect(props.onChange).toHaveBeenCalledWith([
      { ...UNREGISTERED_CONTAINER, id: 'GLAS987' },
    ])
  })

  it('removes asset not on map', () => {
    render(
      withAppContext(
        <SelectionPanel {...props} selection={[UNREGISTERED_CONTAINER]} />
      )
    )

    userEvent.click(
      screen.getByRole('checkbox', {
        name: 'Het object staat niet op de kaart',
      })
    )

    expect(props.onChange).toHaveBeenCalledWith([])
  })

  it('closes/submits the panel', () => {
    render(withAppContext(<SelectionPanel {...props} />))

    userEvent.click(screen.getByRole('button', { name: 'Meld dit object' }))

    expect(props.onClose).toHaveBeenCalled()
  })

  it('handles Enter key on input', () => {
    render(
      withAppContext(
        <SelectionPanel {...props} selection={[UNREGISTERED_CONTAINER]} />
      )
    )

    userEvent.type(
      screen.getByLabelText(
        'Wat is het nummer van het object? (niet verplicht)'
      ),
      '5'
    )

    expect(props.onChange).toHaveBeenLastCalledWith([
      { ...UNREGISTERED_CONTAINER, id: '5' },
    ])

    userEvent.type(
      screen.getByLabelText(
        'Wat is het nummer van het object? (niet verplicht)'
      ),
      '{enter}'
    )

    expect(props.onClose).toHaveBeenCalled()
  })

  it('renders custom labels', () => {
    const language = {
      title: 'Locatie',
      subTitle: 'Kies de container op de kaart',
      unregistered: 'De container staat niet op de kaart',
      submitSingular: 'Gebruik deze locatie',
    }

    const propsWithLanguage = {
      ...props,
      language,
    }

    render(withAppContext(<SelectionPanel {...propsWithLanguage} />))

    Object.values(language).forEach((label) => {
      expect(screen.getByText(label)).toBeInTheDocument()
    })
  })
})
