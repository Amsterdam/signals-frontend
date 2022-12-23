// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2019 - 2021 Gemeente Amsterdam
import { fireEvent, render } from '@testing-library/react'

import { withAppContext } from 'test/utils'
import 'jest-styled-components'

import FormFooter from './FormFooter'

describe('src/components/FormFooter', () => {
  it('should render correctly', () => {
    const { getByTestId, rerender } = render(withAppContext(<FormFooter />))

    expect(getByTestId('form-footer')).toHaveStyleRule('position', 'fixed')
    expect(getByTestId('form-footer')).toHaveStyleRule('left', '50%')

    rerender(withAppContext(<FormFooter inline />))

    expect(getByTestId('form-footer')).not.toHaveStyleRule('position', 'fixed')
    expect(getByTestId('form-footer')).not.toHaveStyleRule('left', '50%')
  })

  it('should render the correct buttons', () => {
    const { queryByTestId, container, rerender, getByText } = render(
      withAppContext(<FormFooter />)
    )

    expect(container.querySelectorAll('button')).toHaveLength(0)

    rerender(withAppContext(<FormFooter resetBtnLabel="Reset" />))

    expect(queryByTestId('reset-btn')).not.toBeNull()
    expect(getByText('Reset')).toBeInTheDocument()
    expect(queryByTestId('reset-btn')).toHaveAttribute('type', 'reset')

    rerender(
      withAppContext(
        <FormFooter onResetForm={() => {}} resetBtnLabel="Reset" />
      )
    )

    expect(queryByTestId('reset-btn')).not.toBeNull()
    expect(getByText('Reset')).toBeInTheDocument()
    expect(queryByTestId('reset-btn')).toHaveAttribute('type', 'reset')

    rerender(withAppContext(<FormFooter cancelBtnLabel="Cancel" />))

    expect(queryByTestId('cancel-btn')).not.toBeNull()
    expect(getByText('Cancel')).toBeInTheDocument()
    expect(queryByTestId('cancel-btn')).toHaveAttribute('type', 'button')

    rerender(
      withAppContext(<FormFooter onCancel={() => {}} cancelBtnLabel="Cancel" />)
    )

    expect(queryByTestId('cancel-btn')).not.toBeNull()
    expect(getByText('Cancel')).toBeInTheDocument()
    expect(queryByTestId('cancel-btn')).toHaveAttribute('type', 'button')

    rerender(withAppContext(<FormFooter submitBtnLabel="Submit" />))

    expect(queryByTestId('submit-btn')).not.toBeNull()
    expect(getByText('Submit')).toBeInTheDocument()
    expect(queryByTestId('submit-btn')).toHaveAttribute('type', 'submit')

    rerender(
      withAppContext(
        <FormFooter onSubmitForm={() => {}} submitBtnLabel="Submit" />
      )
    )

    expect(queryByTestId('submit-btn')).not.toBeNull()
    expect(getByText('Submit')).toBeInTheDocument()
    expect(queryByTestId('submit-btn')).toHaveAttribute('type', 'submit')
  })

  it('should render the buttons in the correct order', () => {
    render(
      withAppContext(
        <FormFooter
          onCancel={() => {}}
          cancelBtnLabel="Cancel"
          onSubmitForm={() => {}}
          submitBtnLabel="Submit"
        />
      )
    )

    const buttons = document.querySelectorAll('button')

    expect(buttons).toHaveLength(2)
    expect(buttons[0].dataset.testid).toEqual('submit-btn')
    expect(buttons[1].dataset.testid).toEqual('cancel-btn')
  })

  it('should call handlers', () => {
    const onCancel = jest.fn()
    const onResetForm = jest.fn()
    const onSubmitForm = jest.fn()

    const { getByTestId } = render(
      withAppContext(
        <FormFooter
          onResetForm={onResetForm}
          resetBtnLabel="Reset"
          onCancel={onCancel}
          cancelBtnLabel="Cancel"
          onSubmitForm={onSubmitForm}
          submitBtnLabel="Submit"
        />
      )
    )

    fireEvent.click(getByTestId('cancel-btn'))
    expect(onCancel).toHaveBeenCalled()

    fireEvent.click(getByTestId('reset-btn'))
    expect(onResetForm).toHaveBeenCalled()

    fireEvent.click(getByTestId('submit-btn'))
    expect(onSubmitForm).toHaveBeenCalled()
  })
})
