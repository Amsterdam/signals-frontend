import locatie from './locatie'

describe('locatie', () => {
  it('return a config object', () => {
    expect(locatie).toMatchSnapshot()
  })
})
