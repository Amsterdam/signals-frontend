import { Heading, Icon, themeSpacing, List, ListItem } from '@amsterdam/asc-ui'
import styled from 'styled-components'
import { dateToString } from 'shared/services/date-utils'

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
  font-weight: bold;
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
      <Title data-testid="subcategory-label">
        Subcategorie (verantwoordelijke afdeling)
      </Title>
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
        <Title data-testid="status-label">Status</Title>
        <List>
          <ListItem>
            <StyledIcon size={ICON_SIZE}>
              <img
                alt="Groene locatie pin"
                src="/assets/images/area-map/icon-pin.svg"
              />
            </StyledIcon>
            Openstaand
          </ListItem>
          <ListItem>
            <StyledIcon size={ICON_SIZE}>
              <img
                alt="Zwarte locatie pin"
                src="/assets/images/area-map/icon-pin-green.svg"
              />
            </StyledIcon>
            Afgehandeld
          </ListItem>
        </List>
      </Field>

      <Field>
        <Title data-testid="period-label">Periode</Title>
        <List>
          <ListItem data-testid="period">
            Van {dateToString(new Date(props.startDate))} t/m NU
          </ListItem>
        </List>
      </Field>

      <Field>
        <Title data-testid="area-label">Omgeving</Title>
        <List>
          <ListItem>
            <StyledIcon size={ICON_SIZE}>
              <img
                alt="Draadkruis"
                src="/assets/images/area-map/icon-cross-small.svg"
              />
            </StyledIcon>
            Locatie huidige melding
          </ListItem>
          <ListItem>
            <StyledIcon size={ICON_SIZE}>
              <img alt="Straal" src="/assets/images/area-map/icon-radius.svg" />
            </StyledIcon>
            Straal 50m
          </ListItem>
        </List>
      </Field>
      <Field>
        <Title forwardedAs="h4" data-testid="kind-label">
          Soort
        </Title>
        <List>
          <ListItem>Standaardmelding</ListItem>
          <ListItem>Deelmelding</ListItem>
        </List>
      </Field>
    </Wrapper>
  )
}

export default Filter
