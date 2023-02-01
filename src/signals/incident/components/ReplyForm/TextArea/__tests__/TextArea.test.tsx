import type { FunctionComponent } from 'react'

import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useForm } from 'react-hook-form'

import { withAppContext } from 'test/utils'

import TextArea from '..'
const maxLength = 2

const WrappedTextArea: FunctionComponent = () => {
  const {
    control,
    trigger,
    register,
    formState: { errors },
  } = useForm()
  const id = 'bar'

  return (
    <>
      <TextArea
        id={id}
        label="Foo"
        control={control}
        shortLabel="Bar"
        trigger={trigger}
        register={register}
        errorMessage={errors[id]?.message?.toString()}
        rules={{ maxLength }}
      />
      <button onClick={() => trigger(id)} type="button">
        Opslaan
      </button>
    </>
  )
}

describe('<TextArea />', () => {
  it('renders correctly', () => {
    render(withAppContext(<WrappedTextArea />))

    screen.getByLabelText('Foo')
    screen.getByText(`0/${maxLength} tekens`)
  })

  describe('validates input', () => {
    it('validates required', async () => {
      render(withAppContext(<WrappedTextArea />))

      userEvent.click(screen.getByRole('button', { name: 'Opslaan' }))

      await waitFor(() => {
        expect(
          screen.getByText('Dit is een verplicht veld')
        ).toBeInTheDocument()
      })
    })

    it('validates max length', async () => {
      render(withAppContext(<WrappedTextArea />))

      const input = screen.getByLabelText('Foo')

      userEvent.type(input, 'A'.repeat(maxLength + 1))
      userEvent.click(screen.getByRole('button', { name: 'Opslaan' }))

      expect(
        screen.getByText(`${maxLength + 1}/${maxLength} tekens`)
      ).toBeInTheDocument()

      await waitFor(() => {
        expect(
          screen.getByText(
            `U heeft meer dan de maximale ${maxLength} tekens ingevoerd`
          )
        ).toBeInTheDocument()
      })
    })
  })
})
