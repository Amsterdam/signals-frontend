// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2019 - 2022 Gemeente Amsterdam
import {
  Link,
  Footer,
  FooterTop,
  FooterBottom,
  themeSpacing,
  themeColor,
} from '@amsterdam/asc-ui'
import { useSelector } from 'react-redux'
import styled from 'styled-components'

import { getIsAuthenticated } from 'shared/services/auth/auth'
import configuration from 'shared/services/configuration/configuration'
import { makeSelectIncidentContainer } from 'signals/incident/containers/IncidentContainer/selectors'

const FooterWrapper = styled.div`
  background-color: ${themeColor('tint', 'level1')};
  margin: 0 auto;
  max-width: 1400px;
  width: 100%;
  padding-top: 0;
`

const StyledFooterTop = styled(FooterTop)`
  margin-top: ${themeSpacing(20)};
  min-height: ${themeSpacing(20)};
`

const StyledFooterBottom = styled(FooterBottom)`
  a {
    font-size: 16px;
    line-height: 20px;
  }
`

const StyledFooterApp = styled.div`
  min-height: ${themeSpacing(4)};
  background-color: ${themeColor('tint', 'level1')};
`

const FooterContainer = () => {
  const { mapActive } = useSelector(makeSelectIncidentContainer)

  if (configuration.featureFlags.appMode) {
    return <StyledFooterApp />
  }

  if (getIsAuthenticated()) {
    return null
  }

  return (
    <FooterWrapper>
      <Footer>
        <StyledFooterTop data-testid="siteFooter" />
        <StyledFooterBottom>
          {!mapActive && (
            <>
              {configuration.links.about && (
                <Link href={configuration.links.about} inList tabFocus>
                  Over deze site
                </Link>
              )}
              <Link href={configuration.links.privacy} inList>
                Privacy
              </Link>
              {configuration.links.accessibility && (
                <Link href={configuration.links.accessibility} inList>
                  Toegankelijkheid
                </Link>
              )}
            </>
          )}
        </StyledFooterBottom>
      </Footer>
    </FooterWrapper>
  )
}

export default FooterContainer
