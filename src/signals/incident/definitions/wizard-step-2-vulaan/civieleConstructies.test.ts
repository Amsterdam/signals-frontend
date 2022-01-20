import civieleConstructies from './civieleConstructies'

describe('definition civieleConstructies', () => {
  it('has a defined set of controls', () => {
    const keys = Object.keys(civieleConstructies)

    expect(keys).toStrictEqual(['location', 'extra_brug'])
  })
})
