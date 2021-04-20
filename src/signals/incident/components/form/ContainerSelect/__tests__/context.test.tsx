// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 Gemeente Amsterdam
import React, { useContext } from 'react'
import type { ReactNode, ReactPortal } from 'react'
import ReactDOM from 'react-dom'
import { controls } from 'signals/incident/definitions/wizard-step-2-vulaan/afval'
import { render, screen } from '@testing-library/react'
import { withAppContext } from 'test/utils'
import type { ContainerSelectValue } from '../types'
import ContainerSelectContext, { ContainerSelectProvider } from '../context'

ReactDOM.createPortal = (node) => node as ReactPortal

const { endpoint, featureTypes } = controls.extra_container.meta

export const contextValue: ContainerSelectValue = {
  selection: [
    {
      id: 'PL734',
      type: 'plastic',
      description: 'Plastic container',
    },
  ],
  location: [0, 0],
  meta: { endpoint, featureTypes },
  update: jest.fn(),
  edit: jest.fn(),
  close: jest.fn(),
  setMessage: jest.fn(),
}

export const withContainerSelectContext = (
  Component: ReactNode,
  context = contextValue
) =>
  withAppContext(
    <ContainerSelectProvider value={context}>
      <div id="app">{Component}</div>
    </ContainerSelectProvider>
  )

describe('ContainerSelectProvider', () => {
  it('should render', () => {
    const TestComponent = () => {
      const context = useContext(ContainerSelectContext)
      expect(context).toEqual(contextValue)
      return <div data-testid="context-child-component">test</div>
    }
    render(withContainerSelectContext(<TestComponent />))
    expect(screen.getByTestId('context-child-component')).toBeInTheDocument()
  })
})
