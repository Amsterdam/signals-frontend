import afval from './afval'

describe('definition afval', () => {
  it('has a defined set of controls', () => {
    const keys = Object.keys(afval)

    expect(keys).toStrictEqual([
      'locatie',
      'dateTime',
      'extra_afval_handhaving',
      'extra_afval_handhaving_owner',
      'extra_afval_handhaving_owner_confirmation',
      'extra_afval',
    ])
  })
})
