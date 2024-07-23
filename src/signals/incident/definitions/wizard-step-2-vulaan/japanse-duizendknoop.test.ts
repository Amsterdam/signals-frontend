import japanseDuizendknoop from './japanse-duizendknoop'

describe('definition Japanse duizendknoop', () => {
  it('has a defined set of controls', () => {
    const keys = Object.keys(japanseDuizendknoop)

    expect(keys).toStrictEqual([
      'locatie',
      'extra_japanse_duizendknoop_onveilig',
      'extra_japanse_duizendknoop_onveilig_uitleg',
    ])
  })
})
