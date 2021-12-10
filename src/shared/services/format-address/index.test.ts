import type { Address } from 'types/address'
import { formatAddress } from '.'

const testAddress: Address = {
  openbare_ruimte: 'Keizersgracht',
  huisnummer: 666,
  huisletter: 'D',
  huisnummer_toevoeging: '3',
  postcode: '1016EJ',
  woonplaats: 'Amsterdam',
}

describe('formatAddress', () => {
  it('should return an empty string when no data', () => {
    expect(formatAddress({} as Address)).toEqual('')
  })

  it('should format the address name', () => {
    expect(formatAddress(testAddress)).toEqual(
      'Keizersgracht 666D-3, 1016EJ Amsterdam'
    )
  })

  it('should format the address without toevoeging', () => {
    expect(
      formatAddress({ ...testAddress, huisnummer_toevoeging: '' })
    ).toEqual('Keizersgracht 666D, 1016EJ Amsterdam')
  })

  it('should format the address when some address properties are only a space character', () => {
    expect(
      formatAddress({
        postcode: ' ',
        huisletter: '',
        huisnummer: ' ',
        woonplaats: 'Amsterdam',
        openbare_ruimte: 'Rozengracht',
        huisnummer_toevoeging: '',
      })
    ).toEqual('Rozengracht, Amsterdam')
  })
})
