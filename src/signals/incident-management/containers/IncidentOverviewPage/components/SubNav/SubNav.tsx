// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Gemeente Amsterdam
import { Link } from 'react-router-dom'

import type { FC } from 'react'

import configuration from 'shared/services/configuration/configuration'

import { MAP_URL, INCIDENTS_URL } from '../../../../routes'
import { MapHeading, TabContainer, Tab } from './styled'

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
