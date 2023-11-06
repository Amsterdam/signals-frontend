// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2023 Gemeente Amsterdam
import { render, screen } from '@testing-library/react'

import statusJSON from 'signals/incident-management/definitions/statusList'
import { withAppContext } from 'test/utils'

import type { Options } from '../../reducer'
import { CheckboxGroup } from '../CheckboxGroup'

const name = 'groupName' as keyof Options

describe('signals/incident-management/components/FilterForm/components/CheckboxGroup', () => {
  it('should not render anything', () => {
    const { container } = render(
      withAppContext(
        <CheckboxGroup label="Label text" name={name} options={[]} />
      )
    )

    expect(container.firstChild).not.toBeInTheDocument()
  })

  it('should render correctly', () => {
    const label = 'Label text'
    const toggleText = 'Alles selecteren'

    const { queryByText, getByTestId, rerender } = render(
      withAppContext(
        <CheckboxGroup label={label} name={name} options={statusJSON} />
      )
    )

    expect(queryByText(label)).toBeInTheDocument()
    expect(queryByText(toggleText)).toBeInTheDocument()
    expect(getByTestId(`${name}-checkbox-group`)).toBeInTheDocument()

    rerender(
      withAppContext(
        <CheckboxGroup
          label={label}
          name={name}
          hasToggle={false}
          options={statusJSON}
        />
      )
    )

    expect(queryByText(label)).toBeInTheDocument()
    expect(queryByText(toggleText)).not.toBeInTheDocument()
    expect(getByTestId(`${name}-checkbox-group`)).toBeInTheDocument()
  })

  it('should render correctly with accordion', () => {
    const label = 'Label text'

    render(
      withAppContext(
        <CheckboxGroup
          label={label}
          name={name}
          options={statusJSON}
          hasAccordion
        />
      )
    )

    expect(screen.getByText(label)).toBeInTheDocument()
    expect(screen.getByRole('button')).toBeInTheDocument()
  })
})
