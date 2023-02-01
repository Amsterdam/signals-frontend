// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2022 Gemeente Amsterdam
import type { FC } from 'react'

import { Link } from 'react-router-dom'

import configuration from 'shared/services/configuration/configuration'

import { MapHeading, TabContainer, Tab } from './styled'
import { MAP_URL, INCIDENTS_URL } from '../../../../routes'

type SubNavProps = {
  showsMap?: boolean
}

const SubNav: FC<SubNavProps> = ({ showsMap }) => (
  <>
    {showsMap && configuration.featureFlags.mapFilter24Hours && (
      <MapHeading data-testid="sub-nav-header">Afgelopen 24 uur</MapHeading>
    )}

    <TabContainer data-testid="sub-nav">
      {showsMap ? (
        <>
          <Tab data-testid="sub-nav-list-link" as={Link} to={INCIDENTS_URL}>
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
          <Tab data-testid="sub-nav-map-link" as={Link} to={MAP_URL}>
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
