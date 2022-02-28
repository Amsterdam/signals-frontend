import bouwSloopOverlast from './bouw-sloop-overlast'

describe('definition bouwSloopOverlast', () => {
  it('has a defined set of controls', () => {
    const keys = Object.keys(bouwSloopOverlast)

    expect(keys).toStrictEqual(['locatie', 'dateTime'])
  })
})
