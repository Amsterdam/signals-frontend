// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2019 - 2021 Gemeente Amsterdam
import {
  Row,
  Heading,
  Link,
  themeColor,
  themeSpacing,
  Footer,
  FooterBottom,
} from '@amsterdam/asc-ui'
import styled from 'styled-components'

import configuration from 'shared/services/configuration/configuration'
import stringFormatter from 'shared/services/stringFormatter'

const StyledFooterBottom = styled(FooterBottom)`
  span {
    font-family: Avenir Next LT W01 Demi, arial, sans-serif;
    font-size: 14px;
    font-weight: normal;
    line-height: 22px;
  }
  a:hover {
    text-decoration: underline solid 2px;
    text-underline-offset: 4px;
  }
`

const Disclaimer = styled.div`
  color: ${themeColor('bright', 'main')};
  min-height: ${themeSpacing(25)};
  height: 100%;
`

const StyledHeading = styled(Heading)`
  margin: 0 0 ${themeSpacing(3)} 0;
  color: ${themeColor('bright', 'main')};
`

const FooterWrapper = styled.div`
  contain: content;
  background-color: ${themeColor('tint', 'level5')};
  width: 100%;
  margin-top: 50px;
  color: ${themeColor('bright', 'main')};

  & > * {
    padding-top: ${themeSpacing(7)};
    padding-bottom: ${themeSpacing(7)};
  }

  a {
    color: ${themeColor('bright', 'main')};
  }
`

const Container = styled(Row)`
  width: 100%;
  grid-template-columns: 6fr 6fr;
  grid-column-gap: 20px;

  & > p {
    margin: 0;
  }

  @media (min-width: ${({ theme }) => theme.layouts.medium.max}px) {
    display: grid;
  }
`

const FooterContainer = () => (
  <Footer>
    <FooterWrapper className="no-print" data-testid="siteFooter">
      <Container>
        <Disclaimer data-testid="disclaimer">
          <StyledHeading forwardedAs="h2">
            Lukt het niet om een melding te doen?
          </StyledHeading>
          <span
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{
              __html: stringFormatter(configuration.language.footer1, {
                '##GENERAL_PHONE_NUMBER_FORMATTED##':
                  configuration.language.phoneNumber.replace(' ', ''),
                '##GENERAL_PHONE_NUMBER##': configuration.language.phoneNumber,
              }),
            }}
          />
          <br />
          <span>{configuration.language.footer2}</span>
        </Disclaimer>

        <span
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{
            __html: stringFormatter(configuration.language.avgDisclaimer, {
              '##AVG_DISCLAIMER_URL##': configuration.links.privacy,
            }),
          }}
        />
      </Container>
    </FooterWrapper>

    <StyledFooterBottom>
      <Link href={configuration.links.about} inList>
        Over deze site
      </Link>
      <Link href={configuration.links.privacy} inList>
        Privacy
      </Link>
      <Link href={configuration.links.accessibility} inList>
        Toegankelijkheid
      </Link>
    </StyledFooterBottom>
  </Footer>
)

export default FooterContainer
