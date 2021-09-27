// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Gemeente Amsterdam
import 'jest-styled-components'
import { render, screen } from '@testing-library/react'
import fetchMock from 'jest-fetch-mock'
import caterpillarsJson from 'utils/__tests__/fixtures/caterpillars.json'
import {
  contextValue,
  withSelectContext,
} from 'signals/incident/components/form/MapSelectors/Caterpillar/context/__tests__/context.test'
import userEvent from '@testing-library/user-event'
import { ascDefaultTheme } from '@amsterdam/asc-ui'
import Selector from '..'

jest.mock('../../../hooks/useLayerVisible', () => ({
  __esModule: true,
  default: () => false,
}))

let mockshowDesktopVariant: boolean
jest.mock('@amsterdam/asc-ui/lib/utils/hooks', () => ({
  useMatchMedia: () => [mockshowDesktopVariant],
}))

describe('signals/incident/components/form/MapSelectors/Caterpillar/Selector', () => {
  beforeEach(() => {
    fetchMock.resetMocks()
    fetchMock.mockResponseOnce(JSON.stringify(caterpillarsJson), {
      status: 200,
    })
    mockshowDesktopVariant = false
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('should render the component', async () => {
    render(withSelectContext(<Selector />))

    expect(
      await screen.findByTestId('caterpillarSelectSelector')
    ).toBeInTheDocument()
  })

  it('should call update when removing item', async () => {
    render(withSelectContext(<Selector />))
    expect(contextValue.update).not.toHaveBeenCalled()

    const removeSelectionButton = await screen.findAllByTestId(
      /selectionListRemove/
    )
    userEvent.click(removeSelectionButton[0])
    expect(contextValue.update).toHaveBeenCalled()
  })

  it('should call close when closing the selector', async () => {
    render(withSelectContext(<Selector />))
    expect(contextValue.close).not.toHaveBeenCalled()

    const button = await screen.findByText('Meld deze boom')
    userEvent.click(button)
    expect(contextValue.close).toHaveBeenCalled()
  })

  it('should render legend panel', async () => {
    mockshowDesktopVariant = true
    render(withSelectContext(<Selector />))

    userEvent.click(await screen.findByText('Legenda'))

    expect(screen.getByTestId('legendPanel')).toBeInTheDocument()
  })

  it('should render selection panel', async () => {
    mockshowDesktopVariant = true
    render(withSelectContext(<Selector />))

    expect(await screen.findByTestId('selectionPanel')).toBeInTheDocument()
  })

  it('should show desktop version on desktop', async () => {
    mockshowDesktopVariant = true
    render(withSelectContext(<Selector />))

    expect(await screen.findByTestId('panelDesktop')).toBeInTheDocument()
    expect(screen.queryByTestId('panelMobile')).not.toBeInTheDocument()
  })

  it('should show mobile version on mobile', async () => {
    render(withSelectContext(<Selector />))

    expect(await screen.findByTestId('panelMobile')).toBeInTheDocument()
    expect(screen.queryByTestId('panelDesktop')).not.toBeInTheDocument()
  })

  it('handles button bar style when zoom level is low', async () => {
    const media = `screen and ${ascDefaultTheme.breakpoints.tabletM(
      'max-width'
    )}`

    render(withSelectContext(<Selector />))

    const bar = await screen.findAllByTestId('buttonBar')
    expect(bar[0]).toHaveStyleRule('margin-top', '44px', { media })
  })
})
