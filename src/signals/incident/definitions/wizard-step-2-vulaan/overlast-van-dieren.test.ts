import overlastVanDieren from './overlast-van-dieren'

describe('definition overlast-van-dieren', () => {
  it('has a defined set of controls', () => {
    const keys = Object.keys(overlastVanDieren)

    expect(keys).toStrictEqual([
      'locatie',
      'extra_dieren_welk_dier',
      'extra_dieren_waar_wespen',
      'extra_dieren_waar_wespen_woning',
      'extra_dieren_waar_dode_dieren',
      'extra_dieren_waar_dode_dieren_woning',
      'extra_dieren_waar_dode_dieren_water',
      'extra_dieren_waar_dode_dieren_openbaar_huisdieren_vogels',
      'extra_dieren_waar_duiven',
      'extra_dieren_waar_duiven_openbaar',
      'extra_dieren_waar_meeuwen',
      'extra_dieren_waar_meeuwen_openbaar',
      'extra_dieren_waar_ganzen',
      'extra_dieren_waar_ganzen_openbaar',
      'extra_dieren_waar_duiven_meeuwen_ganzen',
      'extra_dieren_waar_duiven_meeuwen_ganzen_woning',
      'extra_dieren_waar_duiven_meeuwen_ganzen_openbaar',
      'extra_dieren_waar_ratten',
      'extra_dieren_waar_ratten_woning',
      'extra_dieren_waar_ratten_tuin',
      'extra_dieren_waar_ratten_ander_gebouw',
    ])
  })
})
