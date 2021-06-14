import { Heading, Icon, themeSpacing } from '@amsterdam/asc-ui'
import styled from 'styled-components'
import { dateToString } from 'shared/services/date-utils'
import { ReactComponent as IconPin } from '../../../../../../shared/images/area-map/icon-pin.svg'
import { ReactComponent as IconPinGreen } from '../../../../../../shared/images/area-map/icon-pin-green.svg'
import { ReactComponent as IconCrossSmall } from '../../../../../../shared/images/area-map/icon-cross-small.svg'
import { ReactComponent as IconRadius } from '../../../../../../shared/images/area-map/icon-radius.svg'

interface FilterProps {
  subcategory?: string
  departments?: string
  startDate: string
}

const ICON_SIZE = 20

const Wrapper = styled.section`
  padding: ${themeSpacing(4)};
`

const Field = styled.div`
  margin-top: ${themeSpacing(4)};
`

const StyledIcon = styled(Icon)`
  display: inline-block;
  margin-right: ${themeSpacing(4)};
  position: relative;
  top: 4px;
`

const Filter: React.FC<FilterProps> = (props) => {
  const subcategory = props.subcategory ? (
    <Field>
      <Heading forwardedAs="h4">
        Subcategorie (verantwoordelijke afdeling)
      </Heading>
      <p>
        <span data-testid="subcategory">{props.subcategory} </span>
        <span data-testid="departments">({props.departments})</span>
      </p>
    </Field>
  ) : null

  return (
    <Wrapper>
      <Heading>Filter</Heading>
      {subcategory}
      <Field>
        <Heading forwardedAs="h4">Status</Heading>
        <p>
          <StyledIcon size={ICON_SIZE}>
            <IconPin />
          </StyledIcon>
          Openstaand <br />
          <StyledIcon size={ICON_SIZE}>
            <IconPinGreen />
          </StyledIcon>
          Afgehandeld
        </p>
      </Field>

      <Field>
        <Heading forwardedAs="h4">Periode</Heading>
        <p data-testid="period">
          Van {dateToString(new Date(props.startDate))} t/m NU
        </p>
      </Field>

      <Field>
        <Heading forwardedAs="h4">Omgeving</Heading>
        <p>
          <StyledIcon size={ICON_SIZE}>
            <IconCrossSmall />
          </StyledIcon>
          Locatie huidige melding <br />
          <StyledIcon size={ICON_SIZE}>
            <IconRadius />
          </StyledIcon>
          Straal 250m
        </p>
      </Field>

      <Field>
        <Heading forwardedAs="h4">Soort</Heading>
        <p>
          Standaardmelding <br />
          Deelmelding
        </p>
      </Field>
    </Wrapper>
  )
}

export default Filter
