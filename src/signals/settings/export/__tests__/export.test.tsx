import { fireEvent, render, screen } from '@testing-library/react'
import { withAppContext } from 'test/utils'
import configuration from 'shared/services/configuration/configuration'
import type { FetchError } from 'hooks/useFetch'
import useFetch from 'hooks/useFetch'
import Export from '../'

const labels = {
  title: /csv export/i,
  downloading: /downloading/i,
  error: /er ging iets mis/i,
  button: /Download export/i,
}

const del = jest.fn()
const get = jest.fn()
const patch = jest.fn()
const post = jest.fn()
const put = jest.fn()

const useFetchResponse = {
  del,
  get,
  patch,
  post,
  put,
  data: undefined as undefined | string,
  isLoading: false,
  error: false as boolean | FetchError,
  isSuccess: false,
}

jest.mock('hooks/useFetch')

describe('Export component', () => {
  let response = useFetchResponse

  beforeEach(() => {
    Object.defineProperties(global, {
      location: {
        writable: true,
        value: {
          ...global.location,
          assign: jest.fn(),
        },
      },
      URL: {
        writable: true,
        value: {
          ...global.URL,
          createObjectURL: jest.fn(),
        },
      },
    })

    response = {
      ...useFetchResponse,
    }
    jest.mocked(useFetch).mockImplementation(() => response)
    jest.mocked(global.URL.createObjectURL).mockImplementation(() => 'url')
  })

  afterEach(() => {
    jest.mocked(global.location.assign).mockRestore()
  })

  it('should render', () => {
    render(withAppContext(<Export />))

    const button = screen.getByText(/Download export/i)

    expect(screen.getByText(labels.title)).toBeInTheDocument()
    expect(button).toBeInTheDocument()
    expect(button).toBeEnabled()
    expect(screen.queryByText(labels.downloading)).not.toBeInTheDocument()
    expect(screen.queryByText(labels.error)).not.toBeInTheDocument()
  })

  it('should disable button and show label when loading', async () => {
    const { rerender } = render(withAppContext(<Export />))

    const button = screen.getByText(labels.button)

    expect(screen.queryByText(labels.downloading)).not.toBeInTheDocument()
    expect(button).toBeEnabled()

    response.isLoading = true
    rerender(withAppContext(<Export />))

    expect(screen.getByText(labels.downloading)).toBeInTheDocument()
    expect(button).not.toBeEnabled()
  })

  it('should show error', () => {
    const { rerender } = render(withAppContext(<Export />))

    expect(screen.queryByText(labels.error)).not.toBeInTheDocument()

    response.error = {} as FetchError
    rerender(withAppContext(<Export />))

    expect(screen.getByText(labels.error)).toBeInTheDocument()

    response.error = { message: 'message' } as FetchError
    rerender(withAppContext(<Export />))

    expect(screen.getByText(labels.error)).toBeInTheDocument()
    expect(screen.getByText(/message/i)).toBeInTheDocument()
  })

  it('should fetch export', () => {
    render(withAppContext(<Export />))

    expect(get).not.toHaveBeenCalled()

    const button = screen.getByText(labels.button)
    fireEvent.click(button)

    expect(get).toHaveBeenCalledTimes(1)
    expect(get).toHaveBeenCalledWith(
      expect.stringContaining(configuration.EXPORT_ENDPOINT),
      {},
      expect.objectContaining({ responseType: 'blob' })
    )
  })

  it('should sevre data for download', () => {
    const { rerender } = render(withAppContext(<Export />))

    expect(global.URL.createObjectURL).not.toHaveBeenCalled()
    expect(global.window.location.assign).not.toHaveBeenCalled()

    response.data = 'data'
    rerender(withAppContext(<Export />))

    expect(global.URL.createObjectURL).toHaveBeenCalledTimes(1)
    expect(global.URL.createObjectURL).toHaveBeenCalledWith('data')
    expect(global.window.location.assign).toHaveBeenCalledTimes(1)
    expect(global.window.location.assign).toHaveBeenCalledWith('url')
  })
})
