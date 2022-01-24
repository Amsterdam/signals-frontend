import openbaarGroenEnWater from './openbaarGroenEnWater'

describe('definition openbaarGroenEnWater', () => {
  it('has a defined set of controls', () => {
    const keys = Object.keys(openbaarGroenEnWater)

    expect(keys).toStrictEqual([
      'extra_eikenprocessierups',
      'extra_nest_grootte',
    ])
  })
})
