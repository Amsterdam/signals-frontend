import afval from './afval'

describe('definition afval', () => {
  it('has a defined set of controls', () => {
    const keys = Object.keys(afval)

    expect(keys).toStrictEqual([
      'locatie',
      'dateTime',
      'extra_afval',
      'extra_afval_eigenaar',
      'extra_afval_eigenaar_ja',
    ])
  })
})
