import 'jest-styled-components'
import { render, screen } from '@testing-library/react'
import { ascDefaultTheme } from '@amsterdam/asc-ui'
import { Map } from '@amsterdam/react-maps'
import { mocked } from 'ts-jest/utils'

import MAP_OPTIONS from 'shared/services/configuration/map-options'

import withAssetSelectContext from '../../__tests__/withAssetSelectContext'
import useLayerVisible from '../../../hooks/useLayerVisible'

import ButtonBar from './ButtonBar'

jest.mock('../../../hooks/useLayerVisible')

const useLayerVisibleSpy = mocked(useLayerVisible).mockImplementation(
  () => false
)

describe('ButtonBar', () => {
  const media = `screen and ${ascDefaultTheme.breakpoints.tabletS('max-width')}`

  it('sets top margin when context layer is not visible', () => {
    render(
      withAssetSelectContext(
        <Map options={MAP_OPTIONS}>
          <ButtonBar zoomLevel={{ max: 12 }}>
            <span>button</span>
          </ButtonBar>
        </Map>
      )
    )

    const bar = screen.getByTestId('buttonBar')
    expect(bar).toHaveStyleRule('margin-top', '44px', { media })
  })

  it('does not set top margin', () => {
    useLayerVisibleSpy.mockImplementation(() => true)

    render(
      withAssetSelectContext(
        <Map options={MAP_OPTIONS}>
          <ButtonBar zoomLevel={{ max: 12 }}>
            <span>button</span>
          </ButtonBar>
        </Map>
      )
    )

    const bar = screen.getByTestId('buttonBar')
    expect(bar).not.toHaveStyleRule('margin-top', '44px', { media })
  })
})
