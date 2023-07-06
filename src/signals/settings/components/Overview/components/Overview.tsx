// Copyright (C) 2023 Gemeente Amsterdam
import type { FunctionComponent } from 'react'
import { useEffect } from 'react'

import {
  PersonalLogin,
  Student,
  Buildings,
  ThumbnailResults,
  Download,
} from '@amsterdam/asc-assets'
import { CompactThemeProvider, Row } from '@amsterdam/asc-ui'

import PageHeader from 'components/PageHeader'
import configuration from 'shared/services/configuration/configuration'
import {
  USERS_URL,
  ROLES_URL,
  DEPARTMENTS_URL,
  SUBCATEGORIES_URL,
  EXPORT_URL,
  MAIN_CATEGORIES_URL,
} from 'signals/settings/routes'

import {
  StyledVersionNumbers,
  StyledNavLink,
  StyledTopTaskLink,
  Item,
  Wrapper,
} from './styled'
import useFetch from '../../../../../hooks/useFetch'

type Keys =
  | 'departments'
  | 'groups'
  | 'settings'
  | 'users'
  | 'categories'
  | 'export'

interface Props {
  showItems: Record<Keys, boolean | undefined>
}

const Overview: FunctionComponent<Props> = ({ showItems }) => {
  const { data, get } = useFetch<{ version: string }>()

  useEffect(() => {
    get(`${configuration.apiBaseUrl}/signals/`)
  }, [get])

  if (!showItems.settings) {
    return null
  }

  return (
    <CompactThemeProvider>
      <PageHeader title="Instellingen">
        <StyledVersionNumbers>
          {`
            Versienummer frontend: ${process.env.FRONTEND_TAG}
            Versienummer backend: ${data?.version}
          `}
        </StyledVersionNumbers>
      </PageHeader>
      <Row>
        <Wrapper>
          {showItems.users && (
            <Item data-testid="users">
              <StyledNavLink to={USERS_URL}>
                <StyledTopTaskLink
                  forwardedAs="div"
                  icon={PersonalLogin}
                  title="Gebruikers"
                />
              </StyledNavLink>
              <p>
                Om toegang te krijgen tot de applicatie Signalen is het
                noodzakelijk dat een medewerker is toegevoegd, waarbij het
                emailadres gelijk is aan het inlogaccount. Het wachtwoord kan
                niet worden aangepast in dit instellingenscherm. Elke gebruiker
                moet een rol toegekend krijgen en een afdeling, deze combinatie
                zorgt voor de juiste rechten. Het is niet mogelijk om in dit
                instellingenscherm een medewerker rechten te geven om gebruikers
                aan te maken of te muteren, deze zogenaamde superrol kan enkel
                worden aangemaakt in Django door de functioneel beheerder.
              </p>
            </Item>
          )}
          {showItems.groups && (
            <Item data-testid="groups">
              <StyledNavLink to={ROLES_URL}>
                <StyledTopTaskLink
                  forwardedAs="div"
                  icon={Student}
                  title="Rollen"
                />
              </StyledNavLink>
              <p>
                De applicatie Signalen kent verscheidene rollen. In het
                instellingenscherm is het mogelijk om de rechten per rol aan te
                passen. Te denken valt aan enkel leesrechten, het wijzingen van
                statussen, een notitie toevoegen of het kunnen gebruiken van de
                THOR knop. Wijzigingen in een rol worden van toepassing op alle
                gebruikers met deze betreffende rol.
              </p>
            </Item>
          )}
          {showItems.departments && (
            <Item data-testid="departments">
              <StyledNavLink to={DEPARTMENTS_URL}>
                <StyledTopTaskLink
                  forwardedAs="div"
                  icon={Buildings}
                  title="Afdelingen"
                />
              </StyledNavLink>
              <p>
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
              </p>
            </Item>
          )}
          {showItems.categories && (
            <Item data-testid="categories">
              <StyledNavLink to={SUBCATEGORIES_URL}>
                <StyledTopTaskLink
                  forwardedAs="div"
                  icon={ThumbnailResults}
                  title="Subcategorieën"
                />
              </StyledNavLink>
              <p>
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
              </p>
            </Item>
          )}
          {configuration.featureFlags.showMainCategories &&
            showItems.categories && (
              <Item data-testid="main-categories">
                <StyledNavLink to={MAIN_CATEGORIES_URL}>
                  <StyledTopTaskLink
                    forwardedAs="div"
                    icon={ThumbnailResults}
                    title="Hoofdcategorieën"
                  />
                </StyledNavLink>
                <p>
                  Een melding in Signalen wordt automatisch door de machine
                  learning tool toegekend aan een hoofdcategorie. In deze
                  instellingspagina is het per hoofdcategorie mogelijk om de
                  weergave op de publieke kaarten aan te passen. De
                  zichtbaarheid van de hoofdcategorie op de kaart kan worden
                  ingesteld. De openbare naam en het icoon kan worden gewijzigd.
                  Voor de meldingenkaart kan worden aangegeven of de
                  subcategorieën van de hoofdcategorie zichtbaar moeten zijn in
                  het filtermenu.
                </p>
              </Item>
            )}
          {configuration.featureFlags.enableCsvExport && showItems.export && (
            <Item data-testid="export">
              <StyledNavLink to={EXPORT_URL}>
                <StyledTopTaskLink
                  forwardedAs="div"
                  icon={Download}
                  title="CSV Export"
                />
              </StyledNavLink>
              <p>Voor het downloaden van alle meldingen in CSV formaat.</p>
            </Item>
          )}
        </Wrapper>
      </Row>
    </CompactThemeProvider>
  )
}

export default Overview
