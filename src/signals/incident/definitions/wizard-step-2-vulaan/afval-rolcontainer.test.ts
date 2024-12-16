import afvalRolcontainer from './afval-rolcontainer'

describe('definition afvalRolcontainer', () => {
  it('has a defined set of controls', () => {
    const keys = Object.keys(afvalRolcontainer)

    expect(keys).toStrictEqual([
      'locatie',
      'extra_afval_rolcontainer',
      'extra_afval_rolcontainer_kapot',
      'extra_afval_rolcontainer_oneens',
    ])
  })
})
