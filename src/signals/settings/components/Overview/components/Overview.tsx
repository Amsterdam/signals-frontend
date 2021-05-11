import type { FunctionComponent } from 'react'
import styled from 'styled-components'
import PageHeader from 'signals/settings/components/PageHeader'
import { NavLink } from 'react-router-dom'
import {
  PersonalLogin,
  Student,
  Buildings,
  ThumbnailResults,
} from '@amsterdam/asc-assets'
import {
  TopTaskLink,
  CompactThemeProvider,
  Paragraph,
  themeSpacing,
  Row,
} from '@amsterdam/asc-ui'

type Keys = 'departments' | 'groups' | 'settings' | 'users' | 'categories'

interface Props {
  showItems: Record<Keys, boolean | undefined>
}

const Wrapper = styled.div`
  display: flex;
`

const Item = styled.div`
  flex: 1;
  padding-right: ${themeSpacing(8)};
  &:last-of-type {
    padding-right: 0;
  }
`

const StyledNavLink = styled(NavLink)`
  margin-bottom: ${themeSpacing(4)};
  display: block;
  text-decoration: none;
`

const StyledTopTaskLink = styled(TopTaskLink)`
  min-height: 132px;
`

const Overview: FunctionComponent<Props> = ({ showItems }) => {
  if (!showItems.settings) {
    return null
  }

  return (
    <CompactThemeProvider>
      <PageHeader title="Instellingen" />
      <Row>
        <Wrapper>
          {showItems.users && (
            <Item data-testid="users">
              <StyledNavLink to="/instellingen/gebruikers">
                <StyledTopTaskLink icon={PersonalLogin} title="Gebruikers" />
              </StyledNavLink>
              <Paragraph>
                Om toegang te krijgen tot de applicatie Signalen is het
                noodzakelijk dat een medewerker is toegevoegd, waarbij het
                emailadres gelijk is aan het inlogaccount. Het wachtwoord kan
                niet worden aangepast in dit instellingenscherm. Elke gebruiker
                moet een rol toegekend krijgen en een afdeling, deze combinatie
                zorgt voor de juiste rechten. Het is niet mogelijk om in dit
                instellingenscherm een medewerker rechten te geven om gebruikers
                aan te maken of te muteren, deze zogenaamde superrol kan enkel
                worden aangemaakt in Django door de functioneel beheerder.
              </Paragraph>
            </Item>
          )}
          {showItems.groups && (
            <Item data-testid="groups">
              <StyledNavLink to="/instellingen/rollen">
                <StyledTopTaskLink icon={Student} title="Rollen" />
              </StyledNavLink>
              <Paragraph>
                De applicatie Signalen kent verscheidene rollen. In het
                instellingenscherm is het mogelijk om de rechten per rol aan te
                passen. Te denken valt aan enkel leesrechten, het wijzingen van
                statussen, een notitie toevoegen of het kunnen gebruiken van de
                THOR knop. Wijzigingen in een rol worden van toepassing op alle
                gebruikers met deze betreffende rol.
              </Paragraph>
            </Item>
          )}
          {showItems.departments && (
            <Item data-testid="departments">
              <StyledNavLink to="/instellingen/afdelingen">
                <StyledTopTaskLink icon={Buildings} title="Afdelingen" />
              </StyledNavLink>
              <Paragraph>
                De applicatie Signalen maakt gebruik van afdelingen. Per
                afdeling is het mogelijk om in te stellen welke subcategorieën
                ingezien mogen worden. Door het geven van toegang aan een
                afdeling tot een subcategorie kunnen alle medewerkers die zijn
                toegekend aan deze betreffende afdelingen alle meldingen zien
                die op deze subcategorie staan. Daarnaast is het mogelijk om een
                afdeling verantwoordelijk te maken voor een bepaalde
                subcategorie. Indien een afdeling verantwoordelijk voor een
                bepaalde subcategorie is dat zichtbaar op de detailpagina, de
                betreffende afdeling staat dan tussen haakjes aan de
                subcategorie. De rol van verantwoordelijkheid wordt ook gebruikt
                in de maandrapportages. Het toekennen van deze
                verantwoordelijkheid heeft automatisch tot gevolg dat er toegang
                is toegekend aan deze subcategorie.
              </Paragraph>
            </Item>
          )}
          {showItems.categories && (
            <Item data-testid="categories">
              <StyledNavLink to="/instellingen/categorieen">
                <StyledTopTaskLink
                  icon={ThumbnailResults}
                  title="Subcategorieën"
                />
              </StyledNavLink>
              <Paragraph>
                Elke melding in de applicatie Signalen wordt bij het aanmaken
                door een machinelearning tool toegekend aan een subcategorie.
                Elke subcategorie heeft een omschrijving, die enkel gebruikt
                worden voor intern gebruik. De servicebelofte die hoort bij de
                subcategorie die is toegekend door de machinelearning tool,
                wordt gebruikt bij de terugkoppeling aan de melder. Indien een
                melding eenmaal in de applicatie staat, is het mogelijk de
                subcategorie aan te passen. De afhandeltermijn in week of
                werkdagen wordt niet teruggekoppeld aan de melder, die is
                bedoeld om intern te sturen op de afhandeling van meldingen. In
                deze instellingspagina is het mogelijk om de gegevens per
                subcategorie aan te passen.
              </Paragraph>
            </Item>
          )}
        </Wrapper>
      </Row>
    </CompactThemeProvider>
  )
}

export default Overview
