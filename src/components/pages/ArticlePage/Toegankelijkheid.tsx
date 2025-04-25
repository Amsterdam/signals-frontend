import type { FC } from 'react'

import { Heading, Paragraph, List, ListItem, Link } from '@amsterdam/asc-ui'
import styled from 'styled-components'

import BasePage from '../BasePage'

const StyledHeader = styled(Heading)`
  font-size: 1.125rem;
`

const Toegankelijkheid: FC = () => (
  <BasePage documentTitle="Toegankelijkheid" pageTitle="Toegankelijkheid">
    <article>
      <Paragraph>Opgesteld op 02-11-2024</Paragraph>

      <Paragraph>
        Iedereen moet de informatie op www.amsterdam.nl gemakkelijk kunnen
        gebruiken en bekijken. Ook bijvoorbeeld blinden en slechtzienden of
        mensen met een andere beperking. De gemeente Amsterdam werkt er hard aan
        om de website zo gebruiksvriendelijk mogelijk te maken. Hiervoor volgen
        we de richtlijnen van de overheid. Zo maken we de website voor iedereen
        toegankelijk.
      </Paragraph>

      <Paragraph>Deze verklaring geldt voor de websites:</Paragraph>

      <List>
        <ListItem>
          <Link inList href="https://meldingen.amsterdam.nl">
            meldingen.amsterdam.nl
          </Link>
        </ListItem>
        <ListItem>
          <Link inList href="https://meldingenamsterdamsebos.amsterdam.nl">
            meldingenamsterdamsebos.amsterdam.nl
          </Link>
        </ListItem>
        <ListItem>
          <Link inList href="https://meldingenweesp.amsterdam.nl">
            meldingenweesp.amsterdam.nl
          </Link>
        </ListItem>
      </List>

      <StyledHeader as="h2">Toegankelijkheidsverklaring</StyledHeader>

      <Paragraph>
        De meldingen website voldoet aan de toegankelijkheidseisen van
        <Link variant="inline" href="https://www.digitoegankelijk.nl/">
          DigiToegankelijk.nl
        </Link>{' '}
        op niveau B. Voldoen aan deze standaard maakt onze website
        gebruiksvriendelijker en beter toegankelijk voor verschillende
        doelgroepen. Onderdelen die nog niet toegankelijk zijn kunt u vinden in
        onze{' '}
        <Link
          variant="inline"
          href="https://www.toegankelijkheidsverklaring.nl/register/17013"
        >
          toegankelijkheidsverklaring
        </Link>
        .
      </Paragraph>

      <StyledHeader as="h2">
        Aanpak om de toegankelijkheid van onze website te bevorderen
      </StyledHeader>

      <Paragraph>
        Dit is wat wij doen om het online melden toegankelijk te maken en te
        houden voor iedereen:
      </Paragraph>
      <List variant="bullet">
        <ListItem>
          Onafhankelijke deskundigen toetsen regelmatig (onderdelen van) onze
          website op toegankelijkheid.
        </ListItem>
        <ListItem>
          Wij ontwikkelen het online melden samen met u, de Amsterdammer.
        </ListItem>
        <ListItem>
          Bij het ontwikkelen houden we rekening met de toegankelijkheid.
        </ListItem>
        <ListItem>
          Onze medewerkers houden hun kennis over toegankelijkheid op peil.
        </ListItem>
      </List>

      <StyledHeader as="h2">
        Probleem met de toegankelijkheid van deze website?
      </StyledHeader>

      <List variant="bullet">
        <ListItem>
          Als u ondanks de maatregelen die wij al hebben genomen een
          toegankelijkheidsprobleem ervaart op onze site, laat het ons dan weten
          via{' '}
          <Link
            variant="inline"
            href="mailto:digitaletoegankelijkheid@amsterdam.nl"
          >
            digitaletoegankelijkheid@amsterdam.nl
          </Link>
          .
        </ListItem>
      </List>
    </article>
  </BasePage>
)

export default Toegankelijkheid
