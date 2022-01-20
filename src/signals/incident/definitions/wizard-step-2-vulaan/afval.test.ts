import afval from './afval'

describe('definition afval', () => {
  it('has a defined set of controls', () => {
    const keys = Object.keys(afval)

    expect(keys).toStrictEqual(['location', 'extra_afval'])
  })
})
