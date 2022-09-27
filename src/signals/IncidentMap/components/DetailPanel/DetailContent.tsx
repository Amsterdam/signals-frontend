import { Heading } from '@amsterdam/asc-ui'

import { StyledList } from './styled'

interface Props {
  incident: any
}

// TODO: get correct data (and formatted)

export const DetailContent = ({ incident }: Props) => {
  const { properties, address } = incident

  return (
    <StyledList>
      <dt>Melding</dt>
      <Heading forwardedAs="h2">{properties.category.name}</Heading>
      <dt>Datum melding</dt>
      <dd>{properties.created_at}</dd>
      <dt>Adres dichtbij</dt>
      <dd>{address}</dd>
    </StyledList>
  )
}
