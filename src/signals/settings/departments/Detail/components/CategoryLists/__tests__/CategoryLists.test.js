// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Gemeente Amsterdam
import { render, act, fireEvent, getAllByText } from '@testing-library/react'
import department from 'utils/__tests__/fixtures/department.json'
import categories from 'utils/__tests__/fixtures/categories_structured.json'
import { withAppContext } from 'test/utils'

import CategoryLists from '..'
import DepartmentDetailContext from '../../../context'

const subCategories = Object.entries(categories).flatMap(([, { sub }]) => sub)

const findByMain = (parentKey) =>
  subCategories.filter((category) => category.parentKey === parentKey)

const onCancel = jest.fn()
const onSubmit = jest.fn()

const props = {
  onCancel,
  onSubmit,
}

const checkedIsResponsible = department.categories.filter(
  ({ is_responsible }) => is_responsible
).length
const checkedCanView = department.categories.filter(
  ({ is_responsible, can_view }) => can_view && !is_responsible
).length
const totalChecked = checkedIsResponsible * 2 + checkedCanView

const withContextProvider = (Component) =>
  withAppContext(
    <DepartmentDetailContext.Provider
      value={{ categories, subCategories, department, findByMain }}
    >
      {Component}
    </DepartmentDetailContext.Provider>
  )

describe('signals/settings/departments/Detail/components/CategoryLists', () => {
  afterEach(() => {
    jest.resetAllMocks()
  })

  it('should render groups of checkboxes', () => {
    const { getByText } = render(
      withContextProvider(<CategoryLists {...props} />)
    )

    expect(document.querySelectorAll('input[type=checkbox]')).toHaveLength(
      subCategories.length * 2
    )

    expect(getByText('Verantwoordelijk voor categorie')).toBeInTheDocument()
    expect(getByText('Toegang tot categorie')).toBeInTheDocument()
  })

  it('should render a form', () => {
    const { container } = render(
      withContextProvider(<CategoryLists {...props} />)
    )

    expect(container.querySelector('[type=submit]')).toBeInTheDocument()
    expect(container.querySelector('[type=button]')).toBeInTheDocument()
  })

  it('should handle submit', () => {
    const { container } = render(
      withContextProvider(<CategoryLists {...props} />)
    )

    const submitBtn = container.querySelector('[type=submit]')

    expect(onSubmit).not.toHaveBeenCalled()

    act(() => {
      fireEvent.click(submitBtn)
    })

    expect(onSubmit).toHaveBeenCalled()
  })

  it('should handle cancel', () => {
    const { container } = render(
      withContextProvider(<CategoryLists {...props} />)
    )

    const submitBtn = container.querySelector('[type=button]')

    expect(onCancel).not.toHaveBeenCalled()

    act(() => {
      fireEvent.click(submitBtn)
    })

    expect(onCancel).toHaveBeenCalled()
  })

  it('should update the state on is_responsible checkbox tick', () => {
    jest.useFakeTimers()

    const { container, getByText } = render(
      withContextProvider(<CategoryLists {...props} />)
    )

    const checkbox = getByText('Verantwoordelijk voor categorie')
      .closest('fieldset')
      .querySelector('input[type="checkbox"]:not(:checked)')

    expect(container.querySelectorAll('input:checked')).toHaveLength(
      totalChecked
    )

    act(() => {
      fireEvent.click(checkbox)
    })

    act(() => {
      jest.runOnlyPendingTimers()
    })

    expect(container.querySelectorAll('input:checked')).toHaveLength(
      totalChecked + 2
    )
  })

  it('should update the state on is_responsible toggle click', () => {
    jest.useFakeTimers()

    const { container, getByText } = render(
      withContextProvider(<CategoryLists {...props} />)
    )

    const isResponsibleFieldset = getByText(
      'Verantwoordelijk voor categorie'
    ).closest('fieldset')

    const toggleIsResponsible = getAllByText(
      isResponsibleFieldset,
      'Alles selecteren'
    )[0]
    const checkboxListIsResponsible = toggleIsResponsible.closest(
      '[data-testid="checkboxList"]'
    )
    const numBoxes = checkboxListIsResponsible.querySelectorAll('input').length
    const numTickedIsResponsible =
      checkboxListIsResponsible.querySelectorAll(':checked').length

    const canViewFieldset = getByText('Toegang tot categorie').closest(
      'fieldset'
    )

    const checkboxListCanView = getAllByText(
      canViewFieldset,
      'Alles selecteren'
    )[0].closest('[data-testid="checkboxList"]')

    const numTickedCanView =
      checkboxListCanView.querySelectorAll(':checked').length

    expect(container.querySelectorAll('input:checked')).toHaveLength(
      totalChecked
    )

    act(() => {
      fireEvent.click(toggleIsResponsible)
    })

    act(() => {
      jest.runOnlyPendingTimers()
    })

    // ticking an is_responsible checkbox should also check its can_view counterpart
    const extraTicked =
      numBoxes - numTickedIsResponsible + (numBoxes - numTickedCanView)

    expect(container.querySelectorAll('input:checked')).toHaveLength(
      totalChecked + extraTicked
    )

    act(() => {
      fireEvent.click(toggleIsResponsible)
    })

    act(() => {
      jest.runOnlyPendingTimers()
    })

    expect(container.querySelectorAll('input:checked')).toHaveLength(
      totalChecked - (numTickedIsResponsible + numTickedCanView)
    )
  })

  it('should update the state on can_view checkbox tick', () => {
    jest.useFakeTimers()

    const { container, getByText } = render(
      withContextProvider(<CategoryLists {...props} />)
    )

    const checkbox = getByText('Toegang tot categorie')
      .closest('fieldset')
      .querySelector('input[type="checkbox"]:not(:checked)')

    expect(container.querySelectorAll('input:checked')).toHaveLength(
      totalChecked
    )

    act(() => {
      fireEvent.click(checkbox)
    })

    act(() => {
      jest.runOnlyPendingTimers()
    })

    expect(container.querySelectorAll('input:checked')).toHaveLength(
      totalChecked + 1
    )
  })

  it('should update the state on can_view toggle click', () => {
    jest.useFakeTimers()

    const { container, getByText } = render(
      withContextProvider(<CategoryLists {...props} />)
    )

    const canViewFieldset = getByText('Toegang tot categorie').closest(
      'fieldset'
    )

    const toggle = getAllByText(canViewFieldset, 'Alles selecteren')[0]

    const checkboxList = getAllByText(
      canViewFieldset,
      'Alles selecteren'
    )[0].closest('[data-testid="checkboxList"]')

    const numBoxes = checkboxList.querySelectorAll('input').length
    const numTicked = checkboxList.querySelectorAll(':checked').length
    const numTickedNotEnabled = checkboxList.querySelectorAll(
      ':checked:not(:disabled)'
    ).length

    expect(container.querySelectorAll('input:checked')).toHaveLength(
      totalChecked
    )

    act(() => {
      fireEvent.click(toggle)
    })

    act(() => {
      jest.runOnlyPendingTimers()
    })

    const extraTicked = numBoxes - numTicked

    expect(container.querySelectorAll('input:checked')).toHaveLength(
      totalChecked + extraTicked
    )

    act(() => {
      fireEvent.click(toggle)
    })

    act(() => {
      jest.runOnlyPendingTimers()
    })

    expect(container.querySelectorAll('input:checked')).toHaveLength(
      totalChecked - numTickedNotEnabled
    )
  })
})
