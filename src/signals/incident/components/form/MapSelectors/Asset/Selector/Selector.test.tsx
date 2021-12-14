// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Gemeente Amsterdam
import 'jest-styled-components'
import { render, screen, within } from '@testing-library/react'
import fetchMock from 'jest-fetch-mock'
import userEvent from '@testing-library/user-event'
import { ascDefaultTheme } from '@amsterdam/asc-ui'

import type { FC } from 'react'

import assetsJson from 'utils/__tests__/fixtures/assets.json'
import {
  contextValue,
  withAssetSelectContext,
} from 'signals/incident/components/form/MapSelectors/Asset/__tests__/context.test'
import type { LegendPanelProps } from './LegendPanel/LegendPanel'

import Selector from './Selector'

jest.mock('../../hooks/useLayerVisible', () => ({
  __esModule: true,
  default: () => false,
}))

let mockShowDesktopVariant: boolean
jest.mock('@amsterdam/asc-ui/lib/utils/hooks', () => ({
  useMatchMedia: () => [mockShowDesktopVariant],
}))

jest.mock('./LegendPanel', () => ({ onClose }: LegendPanelProps) => (
  <span data-testid="mockLegendPanel">
    <input type="button" name="closeLegend" onClick={onClose} />
  </span>
))

describe('signals/incident/components/form/AssetSelect/Selector', () => {
  beforeEach(() => {
    fetchMock.resetMocks()
    fetchMock.mockResponseOnce(JSON.stringify(assetsJson), { status: 200 })
    mockShowDesktopVariant = false
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('should render the component', async () => {
    render(withAssetSelectContext(<Selector />))

    expect(await screen.findByTestId('assetSelectSelector')).toBeInTheDocument()
  })

  it('should render the layer when passed as prop', () => {
    const Layer: FC<any> = () => <span data-testid="testLayer" />
    render(
      withAssetSelectContext(<Selector />, { ...contextValue, layer: Layer })
    )

    expect(screen.getByTestId('testLayer')).toBeInTheDocument()
  })

  it('should call close when closing the selector', async () => {
    render(withAssetSelectContext(<Selector />))
    expect(contextValue.close).not.toHaveBeenCalled()

    const button = await screen.findByText('Meld dit object')
    userEvent.click(button)
    expect(contextValue.close).toHaveBeenCalled()
  })

  it('should render selection panel', async () => {
    mockShowDesktopVariant = true
    render(withAssetSelectContext(<Selector />))

    expect(await screen.findByTestId('selectionPanel')).toBeInTheDocument()
  })

  it('handles closing the legend panel', () => {
    render(withAssetSelectContext(<Selector />))

    const legendToggleButton = screen.getByText('Legenda')

    expect(screen.queryByTestId('mockLegendPanel')).not.toBeInTheDocument()

    userEvent.click(legendToggleButton)

    expect(screen.getByTestId('mockLegendPanel')).toBeInTheDocument()

    const mockLegendPanel = screen.getByTestId('mockLegendPanel')

    const legendCloseButton = within(mockLegendPanel).getByRole('button')

    userEvent.click(legendCloseButton)

    expect(screen.queryByTestId('mockLegendPanel')).not.toBeInTheDocument()
  })

  it('should show desktop version on desktop', async () => {
    mockShowDesktopVariant = true
    render(withAssetSelectContext(<Selector />))

    expect(await screen.findByTestId('panelDesktop')).toBeInTheDocument()
    expect(screen.queryByTestId('panelMobile')).not.toBeInTheDocument()
  })

  it('should show mobile version on mobile', async () => {
    render(withAssetSelectContext(<Selector />))

    expect(await screen.findByTestId('panelMobile')).toBeInTheDocument()
    expect(screen.queryByTestId('panelDesktop')).not.toBeInTheDocument()
  })

  it('handles button bar style when zoom level is low', async () => {
    const media = `screen and ${ascDefaultTheme.breakpoints.tabletM(
      'max-width'
    )}`

    render(withAssetSelectContext(<Selector />))

    const bar = await screen.findAllByTestId('buttonBar')
    expect(bar[0]).toHaveStyleRule('margin-top', '44px', { media })
  })

  it('renders a pin marker when there is a location', async () => {
    const coordinates = { lat: 52.3731081, lng: 4.8932945 }

    render(
      withAssetSelectContext(<Selector />, {
        ...contextValue,
        coordinates,
        selection: undefined,
      })
    )
    await screen.findByTestId('assetSelectSelector')

    expect(screen.getByTestId('assetPinMarker')).toBeInTheDocument()
  })

  it('does not render a pin marker', async () => {
    render(
      withAssetSelectContext(<Selector />, {
        ...contextValue,
        coordinates: undefined,
      })
    )
    await screen.findByTestId('assetSelectSelector')

    expect(screen.queryByTestId('assetPinMarker')).not.toBeInTheDocument()
  })

  it('dispatches the location when the map is clicked', async () => {
    const { coordinates, setLocation } = contextValue

    render(withAssetSelectContext(<Selector />))

    await screen.findByTestId('assetSelectSelector')

    expect(setLocation).not.toHaveBeenCalled()

    userEvent.click(screen.getByTestId('map-base'), {
      clientX: 10,
      clientY: 10,
    })

    expect(setLocation).toHaveBeenCalledWith(
      expect.not.objectContaining(coordinates)
    )
  })
})
