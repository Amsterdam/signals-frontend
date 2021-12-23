// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 Gemeente Amsterdam
import { fireEvent, render, screen, within } from '@testing-library/react'
import { withAppContext } from 'test/utils'

import {
  glas,
  select,
  unknown,
} from 'signals/incident/definitions/wizard-step-2-vulaan/afval-icons'
import userEvent from '@testing-library/user-event'

import { UNREGISTERED_TYPE } from '../../../constants'
import withAssetSelectContext, {
  contextValue,
} from '../../__tests__/withAssetSelectContext'
import SelectionPanel from '../SelectionPanel'
import type { AssetListProps } from '../../AssetList/AssetList'
import type { SelectionPanelProps } from './SelectionPanel'

jest.mock('../../AssetList', () =>
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ({ onRemove, featureTypes, selection, ...props }: AssetListProps) => (
    <span data-testid="mockAssetList" {...props}>
      {`${selection.description} - ${selection.id}`}
      <input type="button" onClick={onRemove} />
    </span>
  )
)

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
    variant: 'drawer',
    language: {
      unregisteredId: 'Nummer van de container',
    },
  }

  const selection = {
    ...GLAS_CONTAINER,
    location: { coordinates: { lat: 0, lng: 12.345345 } },
  }

  const selectionUnregistered = {
    ...UNREGISTERED_CONTAINER,
    location: { coordinates: { lat: 0, lng: 12.345345 } },
  }

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('renders the panel', () => {
    render(
      withAssetSelectContext(<SelectionPanel {...props} />, {
        ...contextValue,
        selection: undefined,
      })
    )

    expect(screen.getByRole('heading', { name: 'Locatie' })).toBeInTheDocument()

    expect(
      screen.getByRole('checkbox', {
        name: 'Het object staat niet op de kaart',
      })
    ).toBeInTheDocument()

    expect(
      screen.getByRole('button', { name: 'Meld dit object' })
    ).toBeInTheDocument()

    expect(screen.queryByTestId('assetList')).not.toBeInTheDocument()
  })

  it('renders selected asset', () => {
    render(
      withAssetSelectContext(<SelectionPanel {...props} />, {
        ...contextValue,
        selection,
      })
    )

    expect(screen.getByTestId('mockAssetList')).toBeInTheDocument()
    expect(
      screen.getByText(`${selection.description} - ${selection.id}`)
    ).toBeInTheDocument()
  })

  it('calls remove on selected asset', () => {
    render(
      withAssetSelectContext(<SelectionPanel {...props} />, {
        ...contextValue,
        selection,
      })
    )
    const mockAssetList = screen.getByTestId('mockAssetList')

    const removeButton = within(mockAssetList).getByRole('button')

    expect(contextValue.removeItem).not.toHaveBeenCalled()

    userEvent.click(removeButton)

    expect(contextValue.removeItem).toHaveBeenCalled()
  })

  it('adds asset not on map', () => {
    render(
      withAssetSelectContext(<SelectionPanel {...props} />, {
        ...contextValue,
        selection: undefined,
      })
    )

    expect(
      screen.queryByText('Nummer van de container')
    ).not.toBeInTheDocument()

    userEvent.click(
      screen.getByRole('checkbox', {
        name: 'Het object staat niet op de kaart',
      })
    )

    expect(screen.getByText('Nummer van de container')).toBeInTheDocument()

    const unregisteredObjectId = '8976238'

    expect(contextValue.setItem).not.toHaveBeenCalled()

    userEvent.type(screen.getByRole('textbox'), unregisteredObjectId)

    fireEvent.blur(screen.getByRole('textbox'))

    expect(contextValue.setItem).toHaveBeenCalledWith({
      id: unregisteredObjectId,
      location: {},
      type: UNREGISTERED_TYPE,
    })
  })

  it('removes asset not on map', () => {
    render(
      withAssetSelectContext(<SelectionPanel {...props} />, {
        ...contextValue,
        selection: selectionUnregistered,
      })
    )

    const checkbox = screen.getByRole('checkbox', {
      name: 'Het object staat niet op de kaart',
    })

    expect(contextValue.removeItem).not.toHaveBeenCalled()
    expect(checkbox).toBeChecked()

    userEvent.click(checkbox)

    expect(contextValue.removeItem).toHaveBeenCalled()
  })

  it('closes/submits the panel', () => {
    render(
      withAssetSelectContext(<SelectionPanel {...props} />, {
        ...contextValue,
        selection: selectionUnregistered,
      })
    )

    expect(contextValue.close).not.toHaveBeenCalled()

    userEvent.click(screen.getByRole('button', { name: 'Meld dit object' }))

    expect(contextValue.close).toHaveBeenCalled()
  })

  it('handles Enter key on input', () => {
    render(
      withAssetSelectContext(<SelectionPanel {...props} />, {
        ...contextValue,
        selection: selectionUnregistered,
      })
    )

    userEvent.type(
      screen.getByLabelText('Nummer van de container (niet verplicht)'),
      '5'
    )

    expect(contextValue.setItem).not.toHaveBeenCalled()
    expect(contextValue.close).not.toHaveBeenCalled()

    userEvent.type(
      screen.getByLabelText('Nummer van de container (niet verplicht)'),
      '{Enter}'
    )

    expect(contextValue.setItem).toHaveBeenCalledWith({
      id: '5',
      location: {},
      type: UNREGISTERED_TYPE,
    })
    expect(contextValue.close).toHaveBeenCalled()
  })

  it('renders custom labels', () => {
    const language = {
      title: 'Locatie',
      subTitle: 'Kies een container op de kaart',
      unregistered: 'De container staat niet op de kaart',
      submit: 'Gebruik deze locatie',
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
