// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 Gemeente Amsterdam
import { useContext } from 'react'
import type { ReactNode, ReactPortal } from 'react'
import ReactDOM from 'react-dom'
import { controls } from 'signals/incident/definitions/wizard-step-2-vulaan/openbaarGroenEnWater'
import { render, screen } from '@testing-library/react'
import { withAppContext } from 'test/utils'
import type { SelectValue } from '../../types'
import SelectContext, { SelectProvider } from '../context'

ReactDOM.createPortal = (node) => node as ReactPortal

const meta = controls.extra_eikenprocessierups.meta

export const contextValue = {
  selection: [
    {
      id: 308777,
      type: 'Eikenboom',
      description: 'Eikenboom',
      isReported: false,
    },
    {
      id: '',
      type: 'not-on-map',
      description: 'De boom staat niet op de kaart',
    },
    {
      id: 308778,
      type: 'Eikenboom',
      description: 'Eikenboom',
      isReported: true,
    },
  ],
  location: [0, 0],
  meta,
  update: jest.fn(),
  edit: jest.fn(),
  close: jest.fn(),
  setMessage: jest.fn(),
} as unknown as SelectValue

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
