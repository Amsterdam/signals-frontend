// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Gemeente Amsterdam
import 'jest-styled-components'
import { render, screen } from '@testing-library/react'
import fetchMock from 'jest-fetch-mock'
import containersJson from 'utils/__tests__/fixtures/containers.json'
import {
  contextValue,
  withContainerSelectContext,
} from 'signals/incident/components/form/MapSelectors/Container/__tests__/context.test'
import userEvent from '@testing-library/user-event'
import { ascDefaultTheme } from '@amsterdam/asc-ui'
import Selector from '..'

jest.mock('../../../hooks/useLayerVisible', () => ({
  __esModule: true,
  default: () => false,
}))

let showDesktopVariant: boolean
jest.mock('@amsterdam/asc-ui/lib/utils/hooks', () => ({
  useMatchMedia: () => [showDesktopVariant],
}))

describe('signals/incident/components/form/ContainerSelect/Selector', () => {
  beforeEach(() => {
    fetchMock.resetMocks()
    fetchMock.mockResponseOnce(JSON.stringify(containersJson), { status: 200 })
    showDesktopVariant = false
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('should render the component', async () => {
    render(withContainerSelectContext(<Selector />))

    expect(
      await screen.findByTestId('containerSelectSelector')
    ).toBeInTheDocument()
  })

  it('should call update when removing container', async () => {
    render(withContainerSelectContext(<Selector />))
    expect(contextValue.update).not.toHaveBeenCalled()

    const removeContainersButton = await screen.findAllByTestId(
      /containerListRemove/
    )
    userEvent.click(removeContainersButton[0])
    expect(contextValue.update).toHaveBeenCalled()
  })

  it('should call close when closing the selector', async () => {
    render(withContainerSelectContext(<Selector />))
    expect(contextValue.close).not.toHaveBeenCalled()

    const button = await screen.findByText('Meld deze container')
    userEvent.click(button)
    expect(contextValue.close).toHaveBeenCalled()
  })

  it('should handle close button on legend panel', async () => {
    showDesktopVariant = true
    render(withContainerSelectContext(<Selector />))

    userEvent.click(await screen.findByText('Legenda'))
    expect(screen.getByTestId('legendPanel')).toBeInTheDocument()

    userEvent.click(screen.getByTitle('Sluit'))
    expect(screen.queryByTestId('legendPanel')).not.toBeInTheDocument()
    expect(screen.queryByTestId('selectionPanel')).toBeInTheDocument()
  })

  it('should render legend panel', async () => {
    showDesktopVariant = true
    render(withContainerSelectContext(<Selector />))

    userEvent.click(await screen.findByText('Legenda'))

    expect(screen.getByTestId('legendPanel')).toBeInTheDocument()
  })

  it('should render selection panel', async () => {
    showDesktopVariant = true
    render(withContainerSelectContext(<Selector />))

    expect(await screen.findByTestId('selectionPanel')).toBeInTheDocument()
  })

  it('should show desktop version on desktop', async () => {
    showDesktopVariant = true
    render(withContainerSelectContext(<Selector />))

    expect(await screen.findByTestId('panelDesktop')).toBeInTheDocument()
    expect(screen.queryByTestId('panelMobile')).not.toBeInTheDocument()
  })

  it('should show mobile version on mobile', async () => {
    render(withContainerSelectContext(<Selector />))

    expect(await screen.findByTestId('panelMobile')).toBeInTheDocument()
    expect(screen.queryByTestId('panelDesktop')).not.toBeInTheDocument()
  })

  it('handles button bar style when zoom level is low', async () => {
    const media = `screen and ${ascDefaultTheme.breakpoints.tabletM(
      'max-width'
    )}`

    render(withContainerSelectContext(<Selector />))

    const bar = await screen.findAllByTestId('buttonBar')
    expect(bar[0]).toHaveStyleRule('margin-top', '44px', { media })
  })
})
