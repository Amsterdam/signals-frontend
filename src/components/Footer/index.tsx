// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2019 - 2021 Gemeente Amsterdam
import { Fragment } from 'react'
import { Row, Heading, Link, themeColor, themeSpacing } from '@amsterdam/asc-ui'
import styled from 'styled-components'

import configuration from 'shared/services/configuration/configuration'
import stringFormatter from 'shared/services/stringFormatter'

const Disclaimer = styled.div`
  color: ${themeColor('bright', 'main')};
  min-height: ${themeSpacing(25)};
  height: 100%;
`

const StyledLink = styled(Link)`
  font-size: 16px;
  font-family: Avenir Next LT W01 Demi, arial, sans-serif;
  font-weight: normal;

  span {
    align-self: center;
  }
`

const Privacy = styled.div`
  background: ${themeColor('bright', 'main')};
  padding-top: ${themeSpacing(2)};
  padding-bottom: ${themeSpacing(2)};
  height: ${themeSpacing(11)};
`

const StyledHeading = styled(Heading)`
  margin: 0 0 ${themeSpacing(3)} 0;
  color: ${themeColor('bright', 'main')};
`

const FooterWrapper = styled.div`
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

const Footer = () => (
  <Fragment>
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

    <Container>
      <Privacy>
        <StyledLink href={configuration.links.privacy} inList>
          Privacy
        </StyledLink>
      </Privacy>
    </Container>
  </Fragment>
)

export default Footer
