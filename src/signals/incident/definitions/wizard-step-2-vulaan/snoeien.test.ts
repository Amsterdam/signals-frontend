import snoeien from './snoeien'

describe('definition snoeien', () => {
  it('has a defined set of controls', () => {
    const keys = Object.keys(snoeien)

    expect(keys).toStrictEqual([
      'locatie',
      'extra_plant_of_boom_onveilig',
      'extra_snoeien_geen_melding',
    ])
  })
})
