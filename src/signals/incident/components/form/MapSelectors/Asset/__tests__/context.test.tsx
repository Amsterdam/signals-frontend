// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 Gemeente Amsterdam
import { useContext } from 'react'
import type { ReactNode, ReactPortal } from 'react'
import ReactDOM from 'react-dom'
import { controls } from 'signals/incident/definitions/wizard-step-2-vulaan/afval'
import { render, screen } from '@testing-library/react'
import { withAppContext } from 'test/utils'
import type { AssetSelectValue } from '../types'
import AssetSelectContext, { AssetSelectProvider } from '../context'

ReactDOM.createPortal = (node) => node as ReactPortal

const { endpoint, featureTypes } = controls.extra_container.meta

export const contextValue: AssetSelectValue = {
  selection: [
    {
      id: 'PL734',
      type: 'plastic',
      description: 'Plastic asset',
    },
  ],
  coordinates: { lat: 0, lng: 0 },
  meta: { endpoint, featureTypes },
  update: jest.fn(),
  edit: jest.fn(),
  close: jest.fn(),
  setMessage: jest.fn(),
  setLocation: jest.fn(),
}

export const withAssetSelectContext = (
  Component: ReactNode,
  context = contextValue
) =>
  withAppContext(
    <AssetSelectProvider value={context}>
      <div id="app">{Component}</div>
    </AssetSelectProvider>
  )

describe('AssetSelectProvider', () => {
  it('should render', () => {
    const TestComponent = () => {
      const context = useContext(AssetSelectContext)
      expect(context).toEqual(contextValue)
      return <div data-testid="context-child-component">test</div>
    }
    render(withAssetSelectContext(<TestComponent />))
    expect(screen.getByTestId('context-child-component')).toBeInTheDocument()
  })
})
