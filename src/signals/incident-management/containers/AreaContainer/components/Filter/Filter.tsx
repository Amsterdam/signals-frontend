import { Heading, Icon, themeSpacing, List, ListItem } from '@amsterdam/asc-ui'
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

const Title = styled.div`
  font-family: Avenir Next LT W01 Demi, arial, sans-serif;
  margin-bottom: ${themeSpacing(2)};
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
      <Title>Subcategorie (verantwoordelijke afdeling)</Title>
      <List>
        <ListItem>
          <span data-testid="subcategory">{props.subcategory} </span>
          <span data-testid="departments">({props.departments})</span>
        </ListItem>
      </List>
    </Field>
  ) : null

  return (
    <Wrapper>
      <Heading>Filter</Heading>
      {subcategory}
      <Field>
        <Title>Status</Title>
        <List>
          <ListItem>
            <StyledIcon size={ICON_SIZE}>
              <IconPin />
            </StyledIcon>
            Openstaand
          </ListItem>
          <ListItem>
            <StyledIcon size={ICON_SIZE}>
              <IconPinGreen />
            </StyledIcon>
            Afgehandeld
          </ListItem>
        </List>
      </Field>

      <Field>
        <Title>Periode</Title>
        <List>
          <ListItem data-testid="period">
            Van {dateToString(new Date(props.startDate))} t/m NU
          </ListItem>
        </List>
      </Field>

      <Field>
        <Title>Omgeving</Title>
        <List>
          <ListItem>
            <StyledIcon size={ICON_SIZE}>
              <IconCrossSmall />
            </StyledIcon>
            Locatie huidige melding
          </ListItem>
          <ListItem>
            <StyledIcon size={ICON_SIZE}>
              <IconRadius />
            </StyledIcon>
            Straal 250m
          </ListItem>
        </List>
      </Field>
      <Field>
        <Title forwardedAs="h4">Soort</Title>
        <List>
          <ListItem>Standaardmelding</ListItem>
          <ListItem>Deelmelding</ListItem>
        </List>
      </Field>
    </Wrapper>
  )
}

export default Filter
