import boomIllegaleKap from './boom-illegale-kap'

describe('definition boomIllegaleKap', () => {
  it('has a defined set of controls', () => {
    const keys = Object.keys(boomIllegaleKap)

    expect(keys).toStrictEqual(['locatie', 'dateTime'])
  })
})
