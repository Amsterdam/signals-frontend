import afvalContainer from './afval-container'

describe('definition afvalContainer', () => {
  it('has a defined set of controls', () => {
    const keys = Object.keys(afvalContainer)

    expect(keys).toStrictEqual(['extra_container'])
  })
})
