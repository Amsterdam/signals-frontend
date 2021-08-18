import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
// import userEvent from '@testing-library/user-event'
import { FunctionComponent } from 'react'
import { useForm } from 'react-hook-form'
import { withAppContext } from 'test/utils'

import TextArea from '..'
import { DEFAULT_MAX_LENGTH } from '../TextArea'

const WrappedTextArea: FunctionComponent = () => {
  const { control, trigger, register, errors } = useForm()
  const id = 'bar'

  return (
    <>
      <TextArea
        id={id}
        label="Foo"
        control={control}
        trigger={trigger}
        register={register}
        errorMessage={errors[id]?.message}
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
    screen.getByText(`0/${DEFAULT_MAX_LENGTH} tekens`)
  })

  describe('validates input', () => {
    it('validates required', async () => {
      render(withAppContext(<WrappedTextArea />))

      userEvent.click(screen.getByRole('button', { name: 'Opslaan' }))

      await waitFor(() => {
        screen.getByText('Dit is een verplicht veld')
      })
    })

    it('validates max length', async () => {
      render(withAppContext(<WrappedTextArea />))

      const input = screen.getByLabelText('Foo')
      userEvent.type(input, 'A'.repeat(DEFAULT_MAX_LENGTH + 1))
      userEvent.click(screen.getByRole('button', { name: 'Opslaan' }))

      screen.getByText(`${DEFAULT_MAX_LENGTH + 1}/${DEFAULT_MAX_LENGTH} tekens`)
      await waitFor(() => {
        screen.getByText(
          `U heeft meer dan de maximale ${DEFAULT_MAX_LENGTH} tekens ingevoerd`
        )
      })
    })
  })
})
