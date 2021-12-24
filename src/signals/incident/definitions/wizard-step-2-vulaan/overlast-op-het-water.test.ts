import overlastOpHetWater from './overlast-op-het-water'

describe('definition overlast-op-het-water', () => {
  it('has a defined set of controls', () => {
    const keys = Object.keys(overlastOpHetWater)

    expect(keys).toStrictEqual([
      'locatie',
      'extra_boten_snelheid_typeboot',
      'extra_boten_snelheid_rederij',
      'extra_boten_snelheid_naamboot',
      'extra_boten_snelheid_meer',
      'extra_boten_geluid_meer',
      'extra_boten_gezonken_meer',
    ])
  })
})
