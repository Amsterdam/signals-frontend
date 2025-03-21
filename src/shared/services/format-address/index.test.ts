import configuration from 'shared/services/configuration/configuration'
import type { Address } from 'types/address'

import { formatAddress } from '.'

jest.mock('shared/services/configuration/configuration')

const testAddress: Address = {
  openbare_ruimte: 'Keizersgracht',
  huisnummer: 666,
  huisletter: 'D',
  huisnummer_toevoeging: '3',
  postcode: '1016EJ',
  woonplaats: 'Amsterdam',
}

describe('formatAddress', () => {
  afterEach(() => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    configuration.__reset()
  })
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

  it('should format the address without woonplaats and postcode when feature flag showPostcodeSortColumn is set to true', () => {
    configuration.featureFlags.showPostcodeSortColumn = true

    expect(formatAddress(testAddress)).toEqual('Keizersgracht 666D-3')
  })
})
