import fietswrak from './fietswrak'

describe('definition fietswrak', () => {
  it('has a defined set of controls', () => {
    const keys = Object.keys(fietswrak)

    expect(keys).toStrictEqual(['locatie', 'extra_fietswrak'])
  })
})
