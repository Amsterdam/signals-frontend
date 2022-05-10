// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 - 2022 Gemeente Amsterdam
import { fireEvent, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import * as reactResponsive from 'react-responsive'
import useFetch from 'hooks/useFetch'

import type { PDOKAutoSuggestProps } from 'components/PDOKAutoSuggest'
import type { PdokResponse } from 'shared/services/map-location'

import { formatAddress } from 'shared/services/format-address'
import type { ReactPropTypes } from 'react'
import configuration from 'shared/services/configuration/configuration'
import * as reactRedux from 'react-redux'
import { closeMap } from 'signals/incident/containers/IncidentContainer/actions'
import { NEARBY_TYPE, UNKNOWN_TYPE } from '../../../constants'
import withAssetSelectContext, {
  contextValue,
} from '../../__tests__/withAssetSelectContext'
import DetailPanel from '../DetailPanel'
import type { AssetListProps } from '../../AssetList/AssetList'
import type { DetailPanelProps } from './DetailPanel'
import MockInstance = jest.MockInstance

const category = 'afval'
const subcategory = 'huisvuil'
const get = jest.fn()
const patch = jest.fn()
const post = jest.fn()
const put = jest.fn()

const useFetchResponse = {
  get,
  patch,
  post,
  put,
  data: undefined,
  isLoading: false,
  error: false,
  isSuccess: false,
}

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
        <span data-testid="mockAssetList" {...props}>
          {`${selection.description} - ${selection.id}`}
          <input type="button" onClick={onRemove} />
        </span>
      )
)

const mockAddress = {
  postcode: '1000 AA',
  huisnummer: '100',
  woonplaats: 'Amsterdam',
  openbare_ruimte: 'West',
}

const mockPDOKResponse: PdokResponse = {
  id: 'foo',
  value: 'Zork',
  data: {
    location: {
      lat: 12.282,
      lng: 3.141,
    },
    address: mockAddress,
  },
}

const mockList = (props: ReactPropTypes) => (
  <ul className="suggestList" {...props}>
    <li>Suggestion #1</li>
    <li>Suggestion #2</li>
  </ul>
)

jest.mock(
  'components/PDOKAutoSuggest',
  () =>
    ({
      className,
      onSelect,
      value,
      onClear,
      onFocus,
      onData,
    }: PDOKAutoSuggestProps) =>
      (
        <span data-testid="pdokAutoSuggest" className={className}>
          <button data-testid="autoSuggestClear" onClick={onClear}>
            Clear input
          </button>
          <button onClick={() => onSelect(mockPDOKResponse)}>selectItem</button>
          <button
            data-testid="getDataMockButton"
            type="button"
            onClick={() => {
              onData && onData(mockList)
            }}
          />
          <input data-testid="autoSuggestInput" type="text" onFocus={onFocus} />
          <span>{value}</span>
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
      iconUrl: '/assets/images/featureUnknownMarker.svg',
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

  const selection = {
    ...GLAS_CONTAINER,
    location: { coordinates: { lat: 0, lng: 12.345345 } },
    label: 'foo bar',
  }

  const selectionUnregistered = {
    ...UNREGISTERED_CONTAINER,
    location: { coordinates: { lat: 0, lng: 12.345345 } },
    label: 'foo bar',
  }

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

    jest
      .spyOn(reactRedux, 'useSelector')
      .mockReturnValue({ category, subcategory })
    jest.mocked(useFetch).mockImplementation(() => useFetchResponse)
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

    expect(
      screen.queryByRole('button', { name: 'Meld dit object' })
    ).toBeInTheDocument()

    expect(screen.queryByTestId('assetList')).not.toBeInTheDocument()
  })

  it('renders selected asset', () => {
    render(
      withAssetSelectContext(<DetailPanel {...props} />, {
        ...currentContextValue,
        selection,
      })
    )

    expect(
      screen.getByRole('button', { name: 'Meld dit object' })
    ).toBeInTheDocument()
    expect(screen.getByTestId('mockAssetList')).toBeInTheDocument()
    expect(
      screen.getByText(`${selection.description} - ${selection.id}`)
    ).toBeInTheDocument()
  })

  it('calls remove on selected asset', () => {
    render(
      withAssetSelectContext(<DetailPanel {...props} />, {
        ...currentContextValue,
        selection,
      })
    )

    const mockAssetList = screen.getByTestId('mockAssetList')

    const removeButton = within(mockAssetList).getByRole('button')

    expect(currentContextValue.removeItem).not.toHaveBeenCalled()

    userEvent.click(removeButton)

    expect(currentContextValue.removeItem).toHaveBeenCalled()
  })

  it('calls remove on autosuggest clear', () => {
    jest.spyOn(reactResponsive, 'useMediaQuery').mockReturnValue(true)

    render(
      withAssetSelectContext(<DetailPanel {...props} />, {
        ...currentContextValue,
        selection,
      })
    )

    userEvent.type(screen.getByTestId('autoSuggestInput'), 'Meeuw')

    // simulate data retrieval
    userEvent.click(
      within(screen.getByTestId('addressPanel')).getByTestId(
        'getDataMockButton'
      )
    )

    expect(screen.getByTestId('optionsList')).toBeInTheDocument()

    const autoSuggestClear = within(
      screen.getByTestId('addressPanel')
    ).getByTestId('autoSuggestClear')

    expect(currentContextValue.removeItem).not.toHaveBeenCalled()

    userEvent.click(autoSuggestClear)

    expect(currentContextValue.removeItem).toHaveBeenCalled()
    expect(screen.queryByTestId('optionsList')).not.toBeInTheDocument()
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

    const unregisteredObjectId = '8976238'

    userEvent.type(
      screen.getByTestId('unregisteredAssetInput'),
      unregisteredObjectId
    )

    fireEvent.blur(screen.getByTestId('unregisteredAssetInput'))

    expect(currentContextValue.setItem).toHaveBeenCalledTimes(2)
    expect(currentContextValue.setItem).toHaveBeenLastCalledWith({
      id: unregisteredObjectId,
      type: UNKNOWN_TYPE,
      label: `Het object staat niet op de kaart - ${unregisteredObjectId}`,
    })
  })

  it('dispatches the location when an address is selected', async () => {
    const { setLocation } = currentContextValue

    render(
      withAssetSelectContext(<DetailPanel {...props} />, {
        ...currentContextValue,
      })
    )

    await screen.findByTestId('pdokAutoSuggest')

    expect(setLocation).not.toHaveBeenCalled()

    const setLocationButton = screen.getByRole('button', { name: 'selectItem' })

    userEvent.click(setLocationButton)

    expect(setLocation).toHaveBeenCalledWith({
      coordinates: mockPDOKResponse.data.location,
      address: mockPDOKResponse.data.address,
    })
  })

  it('renders already selected address', () => {
    const predefinedAddress = {
      postcode: '1234BR',
      huisnummer: 1,
      huisnummer_toevoeging: 'A',
      woonplaats: 'Amsterdam',
      openbare_ruimte: '',
    }

    render(
      withAssetSelectContext(<DetailPanel {...props} />, {
        ...currentContextValue,
        address: predefinedAddress,
      })
    )

    expect(
      screen.getByText(formatAddress(predefinedAddress))
    ).toBeInTheDocument()
  })

  it('closes/submits the panel', () => {
    render(
      withAssetSelectContext(<DetailPanel {...props} />, {
        ...currentContextValue,
        selection: selectionUnregistered,
      })
    )

    expect(dispatch).not.toHaveBeenCalledWith(closeMap())

    userEvent.click(screen.getByRole('button', { name: 'Meld dit object' }))

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
    const { rerender } = render(
      withAssetSelectContext(<DetailPanel {...props} />, {
        ...contextValue,
        selection: undefined,
      })
    )

    expect(screen.getByTestId('unregisteredObjectPanel')).toBeInTheDocument()
    expect(screen.getByTestId('legendPanel')).toBeInTheDocument()
    expect(screen.getByText('Bestaande melding')).toBeInTheDocument()
    expect(screen.getByTestId('legendToggleButton')).toBeInTheDocument()

    rerender(
      withAssetSelectContext(<DetailPanel {...props} />, {
        ...noFeatureTypesContext,
        selection: undefined,
      })
    )

    expect(
      screen.queryByTestId('unregisteredObjectPanel')
    ).not.toBeInTheDocument()

    expect(screen.queryByTestId('legendPanel')).toBeInTheDocument()
    expect(screen.getByText('Bestaande melding')).toBeInTheDocument()
    expect(screen.queryByTestId('legendToggleButton')).toBeInTheDocument()
  })

  it('toggles the position of the legend panel', () => {
    render(withAssetSelectContext(<DetailPanel {...props} />))

    expect(screen.getByTestId('legendPanel')).toHaveClass('out')

    userEvent.click(screen.getByTestId('legendToggleButton'))

    expect(screen.getByTestId('legendPanel')).toHaveClass('in')
  })

  it('does not render the address panel', () => {
    jest.spyOn(reactResponsive, 'useMediaQuery').mockReturnValue(false)
    render(withAssetSelectContext(<DetailPanel {...props} />))

    expect(screen.queryByTestId('addressPanel')).not.toBeInTheDocument()

    fireEvent.focus(screen.getByTestId('autoSuggestInput'))

    expect(screen.queryByTestId('addressPanel')).not.toBeInTheDocument()
  })

  it('renders the address panel', () => {
    jest.spyOn(reactResponsive, 'useMediaQuery').mockReturnValue(true)

    render(withAssetSelectContext(<DetailPanel {...props} />))

    expect(screen.queryByTestId('addressPanel')).not.toBeInTheDocument()

    fireEvent.focus(screen.getByTestId('autoSuggestInput'))

    expect(screen.getByTestId('addressPanel')).toBeInTheDocument()
  })

  it('renders a list of options in the address panel', () => {
    jest.spyOn(reactResponsive, 'useMediaQuery').mockReturnValue(true)

    render(withAssetSelectContext(<DetailPanel {...props} />))

    expect(screen.queryByTestId('addressPanel')).not.toBeInTheDocument()

    fireEvent.focus(screen.getByTestId('autoSuggestInput'))

    expect(screen.queryByTestId('optionsList')).not.toBeInTheDocument()

    // simulate data retrieval
    userEvent.click(
      within(screen.getByTestId('addressPanel')).getByTestId(
        'getDataMockButton'
      )
    )

    expect(screen.getByTestId('optionsList')).toBeInTheDocument()
  })

  it('selection nearby details', () => {
    const selection = {
      label: 'Huisafval',
      description: 'Gemeld op: 01-01-1970',
      type: NEARBY_TYPE,
    }

    render(
      withAssetSelectContext(<DetailPanel {...props} />, {
        ...contextValue,
        selection,
      })
    )

    expect(screen.getByText(selection.label)).toBeInTheDocument()
    expect(screen.getByText(selection.description)).toBeInTheDocument()
  })

  it('sends an API request, when an object is selected on the map, to get incidents with equal coordinates', async () => {
    const selection = {
      label: 'Huisafval',
      description: 'Gemeld op: 01-01-1970',
      type: 'Rest',
      coordinates: { lat: 1, lng: 2 },
    }

    expect(get).not.toHaveBeenCalled()
    render(
      withAssetSelectContext(<DetailPanel {...props} />, {
        ...contextValue,
        selection,
      })
    )

    expect(get).toHaveBeenCalledTimes(1)
    expect(get).toHaveBeenCalledWith(
      expect.stringContaining(configuration.GEOGRAPHY_PUBLIC_ENDPOINT)
    )
  })
})
