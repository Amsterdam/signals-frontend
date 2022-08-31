// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Gemeente Amsterdam
import { render } from '@testing-library/react'

import { withAppContext } from 'test/utils'
import priorityJSON from 'signals/incident-management/definitions/priorityList'
import { RadioGroup } from '../RadioGroup'

describe('signals/incident-management/components/FilterForm/components/RadioGroup', () => {
  it('should not render anything', () => {
    const { container } = render(
      withAppContext(
        <RadioGroup
          label="Label text"
          name="groupName"
          options={[]}
          onChange={() => {}}
        />
      )
    )

    expect(container.firstChild).not.toBeInTheDocument()
  })

  it('should render correctly', () => {
    const label = 'Label text'
    const name = 'groupName'
    const { getByText, getByTestId } = render(
      withAppContext(
        <RadioGroup
          label={label}
          name={name}
          options={priorityJSON}
          onChange={() => {}}
        />
      )
    )

    expect(getByText(label)).toBeInTheDocument()
    expect(getByTestId(`${name}RadioGroup`)).toBeInTheDocument()
  })
})
