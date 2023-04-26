// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam
import { render } from '@testing-library/react'

import { SelectOption } from './SelectOption'
describe('<SelectOption />', () => {
  it('should render correctly', () => {
    render(
      <SelectOption
        name="test"
        option={{ key: 'all', name: 'Alles', value: '*', group: 'vuilnis' }}
        onChange={jest.fn()}
        allOptions={[
          { key: 'all', name: 'Alles', value: '*', group: 'vuilnis' },
          { key: 'active', name: 'Actief', value: 'actief', group: 'vuilnis' },
        ]}
        setCurrentFocus={jest.fn()}
        focus={0}
        isInputActive={false}
        setInputActive={jest.fn()}
      />
    )
  })
})
