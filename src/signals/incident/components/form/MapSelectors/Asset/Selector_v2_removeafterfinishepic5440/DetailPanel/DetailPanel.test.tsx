// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 - 2023 Gemeente Amsterdam, Vereniging van Nederlandse Gemeenten

import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import * as reactRedux from 'react-redux'

import type { Item } from 'signals/incident/components/form/MapSelectors/types'
import { closeMap } from 'signals/incident/containers/IncidentContainer/actions'

import MockInstance = jest.MockInstance
import type { DetailPanelProps } from './DetailPanel'
import DetailPanel from './index'
import type { Address } from '../../../../../../../../types/address'
import { NEARBY_TYPE, UNKNOWN_TYPE } from '../../../constants'
import withAssetSelectContext, {
  contextValue,
} from '../../__tests__/withAssetSelectContext'
import type { AssetListProps } from '../../AssetList/AssetList'

jest.mock('hooks/useFetch')
jest.mock('react-responsive')

jest.mock(
  '../../AssetList',
  () =>
    ({
      onRemove,
      featureTypes,
      featureStatusTypes,
      selection,
      ...props
    }: AssetListProps) =>
      (
        <span data-testid="mock-asset-list" {...props}>
          {`${selection[0].description} - ${selection[0].label}`}
          <input
            type="button"
            onClick={() => onRemove && onRemove(selection[0])}
          />
        </span>
      )
)

const dispatch = jest.fn()

describe('DetailPanel', () => {
  const GLAS_FEATURE = {
    label: 'Glas',
    description: 'Glas container',
    icon: {
      options: {},
      iconUrl: '/assets/images/afval/glas.svg',
    },
    idField: 'id_nummer',
    typeField: 'fractie_omschrijving',
    typeValue: 'Glas',
  }
  const UNREGISTERED_FEATURE = {
    description: 'Het object staat niet op de kaart',
    label: 'Onbekend',
    icon: {
      iconUrl: '/assets/images/feature-unknown-marker.svg',
    },
    idField: 'id',
    typeField: 'type',
    typeValue: UNKNOWN_TYPE,
  }
  const UNREGISTERED_CONTAINER = {
    description: 'Het object staat niet op de kaart',
    id: '',
    type: UNKNOWN_TYPE,
  }
  const GLAS_CONTAINER = {
    id: 'GLAS123',
    description: 'Glas container',
    type: 'Glas',
  }

  const props: DetailPanelProps = {
    language: {
      unregisteredId: 'Nummer van de container',
    },
  }

  const selection: Item[] = [
    {
      ...GLAS_CONTAINER,
      location: { coordinates: { lat: 0, lng: 12.345345 } },
      label: 'foo bar',
    },
  ]

  const selectionUnregistered: Item[] = [
    {
      ...UNREGISTERED_CONTAINER,
      location: { coordinates: { lat: 0, lng: 12.345345 } },
      label: 'foo bar',
    },
  ]

  const currentContextValue = {
    ...contextValue,
    meta: {
      ...contextValue.meta,
      featureTypes: [GLAS_FEATURE, UNREGISTERED_FEATURE],
    },
  }

  beforeEach(() => {
    jest.spyOn(reactRedux, 'useDispatch').mockImplementation(() => dispatch)
    const dispatchEventSpy: MockInstance<any, any> = jest.spyOn(
      global.document,
      'dispatchEvent'
    )
    dispatch.mockReset()
    dispatchEventSpy.mockReset()
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('renders the panel', () => {
    render(
      withAssetSelectContext(<DetailPanel {...props} />, {
        ...currentContextValue,
        selection: undefined,
      })
    )

    expect(screen.getByText('Locatie')).toBeInTheDocument()

    expect(
      screen.getByRole('checkbox', {
        name: 'Het object staat niet op de kaart',
      })
    ).toBeInTheDocument()

    expect(screen.getByTestId('asset-select-submit-button')).toBeInTheDocument()

    expect(screen.queryByTestId('assetList')).not.toBeInTheDocument()
  })

  it('renders selected asset', () => {
    render(
      withAssetSelectContext(<DetailPanel {...props} />, {
        ...currentContextValue,
        selection,
      })
    )

    expect(screen.getByTestId('asset-select-submit-button')).toBeInTheDocument()
    expect(screen.getByTestId('mock-asset-list')).toBeInTheDocument()
    expect(
      screen.getByText(`${selection[0].description} - ${selection[0].label}`)
    ).toBeInTheDocument()
  })

  it('calls remove on selected asset', () => {
    render(
      withAssetSelectContext(<DetailPanel {...props} />, {
        ...currentContextValue,
        selection,
      })
    )

    const mockAssetList = screen.getByTestId('mock-asset-list')

    const removeButton = within(mockAssetList).getByRole('button')

    expect(currentContextValue.removeItem).not.toHaveBeenCalled()

    userEvent.click(removeButton)

    expect(currentContextValue.removeItem).toHaveBeenCalled()
  })

  it('adds asset not on map', () => {
    render(
      withAssetSelectContext(<DetailPanel {...props} />, {
        ...currentContextValue,
        selection: undefined,
      })
    )

    expect(
      screen.queryByText('Nummer van de container')
    ).not.toBeInTheDocument()

    expect(currentContextValue.setItem).not.toHaveBeenCalled()

    userEvent.click(
      screen.getByRole('checkbox', {
        name: 'Het object staat niet op de kaart',
      })
    )
    expect(currentContextValue.setItem).toHaveBeenCalledTimes(1)
    expect(currentContextValue.setItem).toHaveBeenCalledWith({
      id: '',
      label: 'Het object staat niet op de kaart',
      type: UNKNOWN_TYPE,
    })

    expect(screen.getByText('Nummer van de container')).toBeInTheDocument()

    const unregisteredObjectId = '897 6238'

    userEvent.type(
      screen.getByTestId('unregistered-asset-input'),
      unregisteredObjectId
    )

    fireEvent.blur(screen.getByTestId('unregistered-asset-input'))

    expect(currentContextValue.removeItem).toHaveBeenCalledTimes(2)
    expect(currentContextValue.setItem).toHaveBeenCalledTimes(2)
    expect(currentContextValue.setItem).toHaveBeenLastCalledWith({
      id: unregisteredObjectId,
      type: UNKNOWN_TYPE,
      label: `Het object staat niet op de kaart - ${unregisteredObjectId}`,
    })

    fireEvent.submit(screen.getByTestId('unregistered-asset-input'))

    expect(dispatch).toHaveBeenCalledWith(closeMap())
  })

  it('closes/submits the panel', () => {
    render(
      withAssetSelectContext(<DetailPanel {...props} />, {
        ...currentContextValue,
        selection: selectionUnregistered,
      })
    )

    expect(dispatch).not.toHaveBeenCalledWith(closeMap())

    userEvent.click(screen.getByTestId('asset-select-submit-button'))

    expect(dispatch).toHaveBeenCalledWith(closeMap())
  })

  it('handles Enter key on input', () => {
    render(
      withAssetSelectContext(<DetailPanel {...props} />, {
        ...currentContextValue,
        selection: selectionUnregistered,
      })
    )

    userEvent.type(
      screen.getByLabelText('Nummer van de container (niet verplicht)'),
      '5'
    )

    expect(currentContextValue.setItem).not.toHaveBeenCalled()

    userEvent.type(
      screen.getByLabelText('Nummer van de container (niet verplicht)'),
      '{Enter}'
    )

    expect(currentContextValue.setItem).toHaveBeenCalledWith({
      id: '5',
      type: UNKNOWN_TYPE,
      label: 'Het object staat niet op de kaart - 5',
    })
    expect(dispatch).toHaveBeenCalledWith(closeMap())
  })

  it('renders default labels', () => {
    const language = undefined

    const propsWithLanguage = {
      ...props,
      language,
    }

    render(
      withAssetSelectContext(<DetailPanel {...propsWithLanguage} />, {
        ...currentContextValue,
        selection: undefined,
      })
    )

    expect(screen.getByText('Locatie')).toBeInTheDocument()
    expect(
      screen.getByText('Het object staat niet op de kaart')
    ).toBeInTheDocument()
  })

  it('renders custom labels', () => {
    const language = {
      title: 'Locatie',
      subTitle: 'Kies een container op de kaart',
      unregistered: 'De container staat niet op de kaart',
      description: 'Beschrijving',
    }

    const propsWithLanguage = {
      ...props,
      language,
    }

    render(
      withAssetSelectContext(<DetailPanel {...propsWithLanguage} />, {
        ...currentContextValue,
        selection: undefined,
      })
    )

    Object.values(language).forEach((label) => {
      expect(screen.getByText(label)).toBeInTheDocument()
    })
  })

  it('renders the legend panel, always containing the nearby type item', () => {
    const noFeatureTypesContext = {
      ...contextValue,
      meta: {
        ...contextValue.meta,
        featureTypes: [],
      },
    }

    const address: Address = {
      postcode: '1234AB',
      huisletter: 'A',
      huisnummer: '1',
      woonplaats: 'Amsterdam',
      openbare_ruimte: 'Straat',
      huisnummer_toevoeging: 'A',
    }

    const { rerender } = render(
      withAssetSelectContext(<DetailPanel {...props} />, {
        ...contextValue,
        selection: undefined,
      })
    )

    expect(screen.getByTestId('unregistered-object-panel')).toBeInTheDocument()

    fireEvent.click(screen.getByTestId('unregistered-asset-checkbox'))
    fireEvent.click(screen.getByTestId('unregistered-asset-checkbox'))
    fireEvent.click(screen.getByTestId('unregistered-asset-checkbox'))

    expect(currentContextValue.setItem).toHaveBeenCalledTimes(3)

    expect(screen.getByTestId('legend-panel')).toBeInTheDocument()
    expect(screen.getByText('Bestaande melding')).toBeInTheDocument()
    expect(screen.getByTestId('legend-toggle-button')).toBeInTheDocument()

    // Add address to test the condition $noFeatureTypes && $address
    rerender(
      withAssetSelectContext(<DetailPanel {...props} />, {
        ...noFeatureTypesContext,
        address,
        selection: undefined,
      })
    )

    expect(
      screen.queryByTestId('unregistrered-object-panel')
    ).not.toBeInTheDocument()

    expect(screen.queryByTestId('legend-panel')).toBeInTheDocument()
    expect(screen.getByText('Bestaande melding')).toBeInTheDocument()
    expect(screen.queryByTestId('legend-toggle-button')).toBeInTheDocument()
  })

  it('toggles the position of the legend panel', () => {
    render(withAssetSelectContext(<DetailPanel {...props} />))

    expect(screen.getByTestId('legend-panel')).toHaveClass('out')

    userEvent.click(screen.getByTestId('legend-toggle-button'))

    expect(screen.getByTestId('legend-panel')).toHaveClass('in')
  })

  it('renders the legend panel with focus on close button', async () => {
    render(withAssetSelectContext(<DetailPanel {...props} />))

    userEvent.click(screen.getByTestId('legend-toggle-button'))

    await waitFor(() => {
      expect(screen.getByTestId('close-button')).toHaveFocus()
    })
  })

  it('selection nearby details', () => {
    const selection = [
      {
        id: 'bla',
        label: 'Huisafval',
        description: 'Gemeld op: 01-01-1970',
        type: NEARBY_TYPE,
      },
    ]

    render(
      withAssetSelectContext(<DetailPanel {...props} />, {
        ...contextValue,
        selection,
      })
    )

    expect(screen.getByTestId('mock-asset-list')).toHaveTextContent(
      `${selection[0].description} - ${selection[0].label}`
    )
  })
})
