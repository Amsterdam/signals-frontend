// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 - 2023 Gemeente Amsterdam, Vereniging van Nederlandse Gemeenten

import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import * as reactRedux from 'react-redux'
import * as reactResponsive from 'react-responsive'

import type { Item } from 'signals/incident/components/form/MapSelectors/types'
import { closeMap } from 'signals/incident/containers/IncidentContainer/actions'

import MockInstance = jest.MockInstance
import type { DetailPanelProps } from './DetailPanel'
import DetailPanel from './index'
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
      remove,
      featureTypes,
      featureStatusTypes,
      selection,
      ...props
    }: AssetListProps) =>
      selection && (
        <span data-testid="mock-asset-list" {...props}>
          {`${selection[0].description} - ${selection[0].label}`}
          <input type="button" onClick={() => remove && remove(selection[0])} />
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
    handleMapCloseDispatch: () => {
      dispatch(closeMap())
    },
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

    expect(screen.getByText('Selecteer de locatie')).toBeInTheDocument()

    expect(screen.getByTestId('asset-select-submit-button')).toBeInTheDocument()

    expect(screen.queryByTestId('assetList')).not.toBeInTheDocument()
  })

  it('should render the pdok label if available', () => {
    render(
      withAssetSelectContext(<DetailPanel {...props} />, {
        ...currentContextValue,
        meta: {
          ...currentContextValue.meta,
          language: {
            pdokLabel: 'selecteer een lamp',
          },
        },
      })
    )

    expect(screen.getByText('selecteer een lamp')).toBeInTheDocument()
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

  it('submits an asset on mobile', () => {
    jest.spyOn(reactResponsive, 'useMediaQuery').mockReturnValue(true)

    render(
      withAssetSelectContext(<DetailPanel {...props} />, {
        ...currentContextValue,
        selection: undefined,
      })
    )

    expect(screen.getByTestId('asset-select-submit-button')).toBeInTheDocument()

    userEvent.click(screen.getByTestId('asset-select-submit-button'))

    expect(dispatch).toHaveBeenCalledWith(closeMap())
  })

  it('it renders the mobile submit button when there is no selection', () => {
    jest.spyOn(reactResponsive, 'useMediaQuery').mockReturnValue(true)

    render(
      withAssetSelectContext(<DetailPanel {...props} />, {
        ...currentContextValue,
        selection: undefined,
      })
    )

    expect(screen.getByText('Ga verder zonder object')).toBeInTheDocument()
  })

  it('it renders the mobile submit button with a default text when there is no selection', () => {
    jest.spyOn(reactResponsive, 'useMediaQuery').mockReturnValue(true)

    const thisProps = {
      ...props,
      language: {
        ...props.language,
        objectTypeSingular: 'container',
      },
    }

    render(
      withAssetSelectContext(<DetailPanel {...thisProps} />, {
        ...currentContextValue,
        selection: undefined,
      })
    )

    expect(screen.getByText('Ga verder zonder container')).toBeInTheDocument()
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

  /**
   * This test is  only there to trigger the no features types && address conditional styling.
   *
   */
  it('should trigger styling when no feature types', () => {
    render(
      withAssetSelectContext(<DetailPanel {...props} />, {
        ...currentContextValue,
        meta: {
          ...currentContextValue.meta,
          featureTypes: [],
        },
      })
    )
  })

  it('close the map on close button click and address selection.', async () => {
    render(
      withAssetSelectContext(<DetailPanel {...props} />, {
        ...contextValue,
      })
    )

    userEvent.click(screen.getByLabelText('Terug'))

    await waitFor(() => {
      expect(dispatch).toHaveBeenCalledWith(closeMap())
    })
  })

  it('should not render submit button when no address is selected', () => {
    const ctxValue = {
      ...contextValue,
      address: undefined,
    }

    render(
      withAssetSelectContext(<DetailPanel {...props} />, {
        ...ctxValue,
      })
    )

    expect(
      screen.queryByTestId('asset-select-submit-button')
    ).not.toBeInTheDocument()
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
