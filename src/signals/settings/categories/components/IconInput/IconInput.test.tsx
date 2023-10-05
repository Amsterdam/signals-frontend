import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useForm } from 'react-hook-form'

import { withAppContext } from 'test/utils'

import { IconInput } from './IconInput'
import type { Props } from './IconInput'
import * as API from '../../../../../../internals/testing/api'
import {
  mockRequestHandler,
  fetchMock,
} from '../../../../../../internals/testing/msw-server'

fetchMock.disableMocks()

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ categoryId: '145' }),
}))

const mockUseUpload = {
  upload: jest.fn(),
  uploadSuccess: jest.fn(),
  uploadProgress: jest.fn(),
  uploadError: jest.fn(),
}

jest.mock(
  'signals/incident-management/containers/IncidentDetail/hooks/useUpload',
  () => () => mockUseUpload
)

const defaultProps: Omit<Props, 'formMethods'> = {
  icon: null,
}

const Wrapper = (props: Partial<Props>) => {
  const methods = useForm<any>()
  return withAppContext(
    <IconInput {...defaultProps} formMethods={methods} {...props} />
  )
}

describe('IconInput', () => {
  afterEach(() => {
    jest.resetAllMocks()
  })
  it('should render without icon', () => {
    render(<Wrapper icon={null} />)

    expect(screen.getByText('Icoon')).toBeVisible()
    expect(
      screen.getByText('Het icoon wordt getoond op de openbare meldingenkaart.')
    ).toBeVisible()
    expect(screen.getByText('Icoon toevoegen')).toBeVisible()
  })

  it('should render with an icon', () => {
    const icon =
      'https://siaweuaaks.blob.core.windows.net/files/icons/categories/0-hoofdcategorie-test/glas-icon.svg?se=2023-04-25T15%3A16%3A27Z&sp=r&sv=2021-08-06&sr=b&sig=GtCGkYzJhlkzlRrVAShohBuCQ0mq%2BojItkjJvPRWFBY%3D'
    render(<Wrapper icon={icon} />)

    expect(screen.getByAltText('Icoon')).toBeInTheDocument()
    expect(screen.getByText('Icoon wijzigen')).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Icoon verwijderen' })
    ).toBeInTheDocument()
  })

  it('should allow uploading a new icon', async () => {
    render(<Wrapper icon={null} />)

    const input = screen.getByLabelText('Icoon toevoegen') as HTMLInputElement

    expect(input).toBeInTheDocument()

    fireEvent.change(input, {
      target: {
        files: [
          new File(['(⌐□_□)'], 'test.svg', {
            type: 'image/svg+xml',
          }),
        ],
      },
    })
    expect(screen.queryByText('Bevestig')).not.toBeInTheDocument()
    expect(mockUseUpload.upload).toHaveBeenCalled()
  })

  it('should allow changing an icon', async () => {
    const icon =
      'https://siaweuaaks.blob.core.windows.net/files/icons/categories/0-hoofdcategorie-test/glas-icon.svg?se=2023-04-25T15%3A16%3A27Z&sp=r&sv=2021-08-06&sr=b&sig=GtCGkYzJhlkzlRrVAShohBuCQ0mq%2BojItkjJvPRWFBY%3D'

    render(<Wrapper icon={icon} />)

    const input = screen.getByLabelText('Icoon wijzigen') as HTMLInputElement

    expect(input.files?.[0]?.name).not.toBe('test.svg')

    fireEvent.change(input, {
      target: {
        files: [
          new File(['(⌐□_□)'], 'test.svg', {
            type: 'image/svg+xml',
          }),
        ],
      },
    })

    const inputTwo = screen.getByLabelText('Icoon wijzigen') as HTMLInputElement

    expect(inputTwo.files?.[0]?.name).toBe('test.svg')

    const confirmButton = screen.getByText('Bevestig')

    await waitFor(() => {
      userEvent.click(confirmButton)
    })

    expect(mockUseUpload.upload).toHaveBeenCalled()
  })

  it('should disallow changing an icon when cancelled', async () => {
    const icon =
      'https://siaweuaaks.blob.core.windows.net/files/icons/categories/0-hoofdcategorie-test/glas-icon.svg?se=2023-04-25T15%3A16%3A27Z&sp=r&sv=2021-08-06&sr=b&sig=GtCGkYzJhlkzlRrVAShohBuCQ0mq%2BojItkjJvPRWFBY%3D'

    render(<Wrapper icon={icon} />)

    const input = screen.getByLabelText('Icoon wijzigen') as HTMLInputElement

    expect(input.files?.[0]?.name).not.toBe('test.svg')

    fireEvent.change(input, {
      target: {
        files: [
          new File(['(⌐□_□)'], 'test.svg', {
            type: 'image/svg+xml',
          }),
        ],
      },
    })

    const inputTwo = screen.getByLabelText('Icoon wijzigen') as HTMLInputElement

    expect(inputTwo.files?.[0]?.name).toBe('test.svg')

    const cancelButton = screen.getByText('Annuleer')

    await waitFor(() => {
      userEvent.click(cancelButton)
    })

    expect(mockUseUpload.upload).not.toHaveBeenCalled()
  })

  it('should allow deleting an icon', async () => {
    mockRequestHandler({
      url: API.CATEGORIES_PRIVATE_ENDPOINT_ICON,
      status: 204,
      body: {},
    })

    const icon =
      'https://siaweuaaks.blob.core.windows.net/files/icons/categories/0-hoofdcategorie-test/glas-icon.svg?se=2023-04-25T15%3A16%3A27Z&sp=r&sv=2021-08-06&sr=b&sig=GtCGkYzJhlkzlRrVAShohBuCQ0mq%2BojItkjJvPRWFBY%3D'

    render(<Wrapper icon={icon} />)

    const deleteButton = screen.getByTitle('Icoon verwijderen')
    userEvent.click(deleteButton)

    const confirmButton = screen.getByText('Bevestig')

    await waitFor(() => {
      userEvent.click(confirmButton)
    })

    const deleteButtonAfterDelete = screen.queryByTitle('Icoon verwijderen')

    expect(deleteButtonAfterDelete).not.toBeInTheDocument()
  })
})
