import { isPdf } from './isPdf'

describe('isPdf', () => {
  it('should return true for links to a pdf', () => {
    expect(isPdf('www.books.nl/lotr.pdf?param=1')).toBe(true)
  })

  it('should return false for different links', () => {
    expect(isPdf('www.books.nl/lotrcover.jpg?param=1')).toBe(false)
  })
})
