import maaien from './maaien'

describe('definition maaien', () => {
  it('has a defined set of controls', () => {
    const keys = Object.keys(maaien)

    expect(keys).toStrictEqual([
      'locatie',
      'extra_gras_of_berm_onveilig',
      'extra_groen_voor_recreatie',
      'extra_maaien_geen_melding',
    ])
  })
})
