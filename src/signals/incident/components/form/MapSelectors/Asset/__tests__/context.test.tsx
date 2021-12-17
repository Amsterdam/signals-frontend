// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 Gemeente Amsterdam
import { useContext } from 'react'
import { render, screen } from '@testing-library/react'

import AssetSelectContext from '../context'
import withAssetSelectContext, { contextValue } from './withAssetSelectContext'

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
