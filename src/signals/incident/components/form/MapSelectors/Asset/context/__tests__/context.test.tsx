// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 Gemeente Amsterdam
import { useContext } from 'react'
import type { ReactNode, ReactPortal } from 'react'
import ReactDOM from 'react-dom'
import { controls } from 'signals/incident/definitions/wizard-step-2-vulaan/afval'
import { render, screen } from '@testing-library/react'
import { withAppContext } from 'test/utils'
import type { AssetSelectValue } from '../../types'
import SelectContext, { SelectProvider } from '../context'

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
  location: [0, 0],
  meta: { endpoint, featureTypes },
  update: jest.fn(),
  edit: jest.fn(),
  close: jest.fn(),
  setMessage: jest.fn(),
}

export const withSelectContext = (
  Component: ReactNode,
  context = contextValue
) =>
  withAppContext(
    <SelectProvider value={context}>
      <div id="app">{Component}</div>
    </SelectProvider>
  )

describe('SelectProvider', () => {
  it('should render', () => {
    const TestComponent = () => {
      const context = useContext(SelectContext)
      expect(context).toEqual(contextValue)
      return <div data-testid="context-child-component">test</div>
    }
    render(withSelectContext(<TestComponent />))
    expect(screen.getByTestId('context-child-component')).toBeInTheDocument()
  })
})
