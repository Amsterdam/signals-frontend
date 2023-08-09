import { isFetchError } from './index'

describe('isFetchError', () => {
  it('should returns true for a FetchError with detail property', () => {
    const fetchError = { detail: 'An error occurred' }
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const result = isFetchError(fetchError)

    expect(result).toBe(true)
  })

  it('should returns true for a FetchError with message property', () => {
    const fetchError = { status: 404, message: 'Not Found' }
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const result = isFetchError(fetchError)

    expect(result).toBe(true)
  })

  it('should returns false for a FetchError without detail property', () => {
    const fetchError = { status: 404, result: 'Not Found' }
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const result = isFetchError(fetchError)

    expect(result).toBe(false)
  })

  it('should returns false for a boolean value', () => {
    const booleanValue = true
    const result = isFetchError(booleanValue)

    expect(result).toBe(false)
  })

  it('should returns false for undefined', () => {
    const result = isFetchError(undefined)

    expect(result).toBe(false)
  })
})
