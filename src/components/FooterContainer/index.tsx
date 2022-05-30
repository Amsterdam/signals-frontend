// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2019 - 2021 Gemeente Amsterdam
import { Link, Footer, FooterTop, FooterBottom } from '@amsterdam/asc-ui'
import styled from 'styled-components'

import configuration from 'shared/services/configuration/configuration'
import { useSelector } from 'react-redux'
import { makeSelectIncidentContainer } from 'signals/incident/containers/IncidentContainer/selectors'

const StyledFooterTop = styled(FooterTop)`
  margin-top: 80px;
  min-height: 80px;
`
const StyledFooterBottom = styled(FooterBottom)`
  a {
    font-size: 16px;
    line-height: 20px;
  }
`

const FooterContainer = () => {
  const { mapActive } = useSelector(makeSelectIncidentContainer)
  return (
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
  )
}

export default FooterContainer
