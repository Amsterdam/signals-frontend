import configuration from 'shared/services/configuration/configuration'
import type { Address } from 'types/address'

export const formatAddress = ({
  openbare_ruimte,
  huisnummer,
  huisletter,
  huisnummer_toevoeging,
  postcode,
  woonplaats,
}: Address) => {
  const postcodeAndWoonplaats = configuration.featureFlags
    .showPostcodeSortColumn
    ? []
    : [[postcode?.trim(), woonplaats]]

  return [
    [
      openbare_ruimte,
      `${huisnummer || ''}${huisletter || ''}${
        huisnummer_toevoeging ? `-${huisnummer_toevoeging}` : ''
      }`.trim(),
    ],
    ...postcodeAndWoonplaats,
  ]
    .flatMap((parts) => parts.filter(Boolean).join(' '))
    .filter(Boolean)
    .join(', ')
}
