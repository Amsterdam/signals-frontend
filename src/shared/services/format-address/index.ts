import { Address } from 'types/address'

export const formatAddress = ({
  openbare_ruimte,
  huisnummer,
  huisletter,
  huisnummer_toevoeging,
  postcode,
  woonplaats,
}: Address) =>
  [
    [
      openbare_ruimte,
      `${huisnummer || ''}${huisletter || ''}${
        huisnummer_toevoeging ? `-${huisnummer_toevoeging}` : ''
      }`.trim(),
    ],
    [postcode?.trim(), woonplaats],
  ]
    .flatMap((parts) => parts.filter(Boolean).join(' '))
    .filter(Boolean)
    .join(', ')
