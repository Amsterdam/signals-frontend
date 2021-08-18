import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { FunctionComponent } from 'react'
import { useForm } from 'react-hook-form'
import { withAppContext } from 'test/utils'

import FileInput from '..'

const WrappedFileInput: FunctionComponent = () => {
  const { control, trigger, register, errors } = useForm()

  return (
    <FileInput
      id="file-input"
      label="Foo"
      control={control}
      trigger={trigger}
      register={register}
      errorMessage={errors['file-input']?.message}
    />
  )
}

describe('FileInput', () => {
  it('should render the wrapped FileInput component', () => {
    render(withAppContext(<WrappedFileInput />))

    expect(screen.getByText('Foo')).toBeInTheDocument()
    expect(
      screen.getByText('Voeg een foto toe om de situatie te verduidelijken.')
    ).toBeInTheDocument()
  })

  describe('validation', () => {
    it('validates min file size', async () => {
      render(withAppContext(<WrappedFileInput />))

      const file = new File(['hello'], 'hello.png', { type: 'image/png' })
      Object.defineProperty(file, 'size', { value: 1 })

      const fileInput = screen.getByLabelText(/Foo/)
      userEvent.upload(fileInput, file)

      await waitFor(() => {
        screen.getByText(/Dit bestand is te klein/)
      })
    })

    it('validates max file size', async () => {
      render(withAppContext(<WrappedFileInput />))

      const file = new File(['hello'], 'hello.png', { type: 'image/png' })
      Object.defineProperty(file, 'size', { value: Infinity })

      const fileInput = screen.getByLabelText(/Foo/)
      userEvent.upload(fileInput, file)

      await waitFor(() => {
        screen.getByText(/Dit bestand is te groot/)
      })
    })

    it('validates max number of files', async () => {
      render(withAppContext(<WrappedFileInput />))

      const fileInput = screen.getByLabelText(/Foo/)
      const files = [
        new File(['hello1'], 'hello1.png', { type: 'image/png' }),
        new File(['hello2'], 'hello2.png', { type: 'image/png' }),
        new File(['hello3'], 'hello3.png', { type: 'image/png' }),
        new File(['hello4'], 'hello4.png', { type: 'image/png' }),
      ]
      files.forEach((file) => {
        Object.defineProperty(file, 'size', { value: 50000 })
      })
      userEvent.upload(fileInput, files)

      await waitFor(() => {
        screen.getByText(/U kunt maximaal 3 bestanden uploaden/)
      })
    })

    it('validates file type', async () => {
      render(withAppContext(<WrappedFileInput />))

      const file = new File(['hello'], 'hello.png', { type: 'image/bar' })
      Object.defineProperty(file, 'size', { value: 50000 })

      const fileInput = screen.getByLabelText(/Foo/)
      userEvent.upload(fileInput, file)

      await waitFor(() => {
        screen.getByText(/Dit bestandstype wordt niet ondersteund/)
      })
    })
  })
})
