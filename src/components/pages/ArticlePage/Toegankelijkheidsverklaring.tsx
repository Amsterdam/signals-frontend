import type { FC } from 'react'
import { Heading, Paragraph, List, ListItem, Link } from '@amsterdam/asc-ui'
import BasePage from '../BasePage'

const Toegankelijkheidsverklaring: FC = () => (
  <BasePage
    documentTitle="Toegankelijkheidsverklaring"
    pageTitle="Toegankelijkheidsverklaring"
  >
    <aside>
      <Paragraph>Opgesteld op 01-10-2021</Paragraph>

      <Paragraph>
        Wij streven ernaar het meldingsformulier toegankelijk te maken voor
        iedereen en op alle apparaten. Dit doen we door de eisen voor
        toegankelijkheid van DigiToegankelijk.nl na te leven. De eisen die
        hierin staan zijn gebaseerd op de internationale
        toegankelijkheidsstandaard WCAG 2.1 niveau AA. In deze verklaring leest
        u op welke punten we afwijken van deze eisen.
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
    </aside>

    <section>
      <header>
        <Heading as="h2">Toegankelijkheidsonderzoek</Heading>
      </header>
      <List variant="bullet">
        <ListItem>
          23-07-2021: Handmatig onderzoek door Firm Ground:{' '}
          <Link variant="inline" icon="download" href="/assets/files/">
            document downloaden
          </Link>
        </ListItem>
        <ListItem>
          De onderzoeksresultaten zijn terug te lezen op de site:{' '}
          <Link
            variant="inline"
            href="https://www.toegankelijkheidsverklaring.nl/"
          >
            toegankelijkheidsverklaring.nl
          </Link>
        </ListItem>
      </List>
    </section>

    <section>
      <header>
        <Heading as="h2">Onderdelen die nog niet toegankelijk zijn</Heading>
      </header>

      <List variant="bullet">
        <ListItem>
          Sommige kaarten hebben objecten die geselecteerd kunnen worden, zoals
          de kaart met afvalcontainers. Deze zijn met het toetsenbord te
          bereiken, maar de selectie verdwijnt automatisch. Gebruikers die met
          een toetsenbord door de site bladeren kunnen nu niet aangeven om welk
          object het gaat.
        </ListItem>
        <ListItem>
          De kaart waar lantaarnpalen geselecteerd kunnen worden, hebben voor
          screenreaders alleen een nummer. Dat is niet voor alle gebruikers even
          duidelijk.
        </ListItem>
        <ListItem>
          Wanneer de gebruiker een foto plaatst met een bestandsgrootte kleiner
          dan 30kB wordt er een tekst getoond: &lsquo;Dit bestand is te klein.
          De minimale bestandsgrootte is 30kB.&rsquo; Deze tekst wordt niet
          doorgegeven aan screenreaders.
        </ListItem>
      </List>
      <Paragraph>
        Voor 1 januari 2022 zullen deze onderdelen opgelost zijn. Vanaf dan
        voldoet de website aan alle eisen van de internationale
        toegankelijkheidsstandaard WCAG 2.1 niveau AA.
      </Paragraph>
    </section>

    <section>
      <header>
        <Heading as="h2">
          Aanpak om de toegankelijkheid van onze website te bevorderen
        </Heading>
      </header>

      <Paragraph>
        Dit is wat wij doen om het online melden toegankelijk te maken en te
        houden voor iedereen:
      </Paragraph>

      <List variant="bullet">
        <ListItem>
          Wij laten regelmatig een toegankelijkheidsonderzoek doen van
          (onderdelen van) onze website door een onafhankelijke partij.
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
    </section>

    <section>
      <header>
        <Heading as="h2">
          Probleem met de toegankelijkheid van deze website?
        </Heading>
      </header>

      <Paragraph>
        Als u ondanks de maatregelen die wij al hebben genomen een
        toegankelijkheidsprobleem hebt op onze website, laat het ons dan weten.
        Meld het via{' '}
        <Link
          variant="inline"
          href="https://formulieren.amsterdam.nl/TriplEforms/DirectRegelen/formulier/nl-NL/evAmsterdam/Klachtenformulier.aspx/fKlachtenformulier"
        >
          ons contactformulier
        </Link>
        .
      </Paragraph>
    </section>
  </BasePage>
)

export default Toegankelijkheidsverklaring
