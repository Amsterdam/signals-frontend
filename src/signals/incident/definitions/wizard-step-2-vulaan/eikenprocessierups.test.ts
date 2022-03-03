import eikenprocessierups from './eikenprocessierups'

describe('definition eikenprocessierups', () => {
  it('has a defined set of controls', () => {
    const keys = Object.keys(eikenprocessierups)

    expect(keys).toStrictEqual([
      'extra_eikenprocessierups',
      'extra_nest_grootte',
    ])
  })
})
