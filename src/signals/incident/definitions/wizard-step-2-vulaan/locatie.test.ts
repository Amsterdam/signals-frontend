import locatie, { locatieFn } from './locatie'

describe('locatie', () => {
  it('return a config object', () => {
    expect(locatie).toMatchSnapshot()
  })

  describe('locatieFn', () => {
    it('returns a config object', () => {
      expect(locatieFn()).toStrictEqual(locatie)
    })

    it('returns a config object with display conditions', () => {
      const displayConds = {
        ifOneOf: {
          category: 'Zork',
        },
      }

      const locatieConfig = locatieFn(displayConds)

      expect(locatieConfig).toEqual(
        expect.objectContaining({
          meta: expect.objectContaining({
            ...displayConds,
          }),
        })
      )
    })
  })
})
