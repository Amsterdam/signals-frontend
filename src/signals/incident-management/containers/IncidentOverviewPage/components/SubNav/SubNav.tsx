// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Gemeente Amsterdam
import styled from 'styled-components'
import { themeSpacing, themeColor, Heading } from '@amsterdam/asc-ui'
import { Link } from 'react-router-dom'

import type { FC } from 'react'

import configuration from 'shared/services/configuration/configuration'

import { MAP_URL, INCIDENTS_URL } from '../../../../routes'

const MapHeading = styled(Heading).attrs({
  forwardedAs: 'h2',
})`
  margin: 0;
  font-size: 16px;
  font-family: Avenir Next LT W01 Demi, arial, sans-serif;
  font-weight: 400;
`

const TabContainer = styled.div`
  border-bottom: 2px solid ${themeColor('tint', 'level3')};
  display: flex;
  padding-bottom: ${themeSpacing(1)};

  a {
    text-decoration: none;
  }
`

const Tab = styled.span`
  line-height: 24px;
  font-size: 18px;
  font-family: Avenir Next LT W01 Demi, arial, sans-serif;
  box-shadow: 0px 6px 0px 0px rgba(0, 0, 0, 0);
  padding: 0 10px 6px;
  color: ${themeColor('tint', 'level6')};

  &.active {
    pointer-events: none;
    box-shadow: 0px 6px 0px 0px ${themeColor('secondary')};
    color: ${themeColor('secondary')};
  }

  &:not(.active):hover {
    box-shadow: 0px 6px 0px 0px rgba(0, 0, 0, 1);
    color: ${themeColor('tint', 'level6')};
  }

  & + & {
    margin-left: ${themeSpacing(7)};
  }
`

type SubNavProps = {
  showsMap?: boolean
}

const SubNav: FC<SubNavProps> = ({ showsMap }) => (
  <>
    {showsMap && configuration.featureFlags.mapFilter24Hours && (
      <MapHeading data-testid="subNavHeader">Afgelopen 24 uur</MapHeading>
    )}

    <TabContainer>
      {showsMap ? (
        <>
          <Tab data-testid="subNavListLink" as={Link} to={INCIDENTS_URL}>
            Lijst
          </Tab>
          <Tab className="active">
            <span>Kaart</span>
          </Tab>
        </>
      ) : (
        <>
          <Tab className="active">
            <span>Lijst</span>
          </Tab>
          <Tab data-testid="subNavMapLink" as={Link} to={MAP_URL}>
            Kaart
          </Tab>
        </>
      )}
    </TabContainer>
  </>
)

SubNav.defaultProps = {
  showsMap: false,
}

export default SubNav
