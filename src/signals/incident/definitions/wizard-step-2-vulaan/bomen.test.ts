import bomen from './bomen'

describe('definition bomen', () => {
  it('has a defined set of controls', () => {
    const keys = Object.keys(bomen)

    expect(keys).toStrictEqual(['extra_bomen'])
  })
})
