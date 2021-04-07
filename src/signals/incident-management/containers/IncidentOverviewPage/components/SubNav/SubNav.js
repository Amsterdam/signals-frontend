// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Gemeente Amsterdam
import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Row, Column, themeSpacing, themeColor, Heading } from '@amsterdam/asc-ui';
import { Link } from 'react-router-dom';

import configuration from 'shared/services/configuration/configuration';

import { MAP_URL, INCIDENTS_URL } from '../../../../routes';

export const Wrapper = styled(Row)`
  margin-bottom: ${themeSpacing(5)};
`;

export const MapHeading = styled(Heading).attrs({
  forwardedAs: 'h2',
})`
  margin: 0;
  font-size: 16px;
  font-family: Avenir Next LT W01 Demi, arial, sans-serif;
  font-weight: 400;
`;

export const TabContainer = styled.div`
  border-bottom: 2px solid ${themeColor('tint', 'level3')};
  display: flex;
  padding-bottom: ${themeSpacing(1)};

  a {
    text-decoration: none;
  }
`;

export const Tab = styled.span`
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
`;

export const TabWrapper = styled(Column)`
  justify-content: flex-end;
  align-items: center;
  height: ${themeSpacing(8)};
`;

const SubNav = ({ showsMap }) => (
  <Wrapper data-testid="subNav">
    <Column span={{ small: 1, medium: 1, big: 3, large: 6, xLarge: 6 }}>
      {showsMap && configuration.featureFlags.mapFilter24Hours && (
        <MapHeading data-testid="subNavHeader">Afgelopen 24 uur</MapHeading>
      )}
    </Column>

    <TabWrapper span={{ small: 1, medium: 1, big: 3, large: 6, xLarge: 6 }}>
      <TabContainer>
        {showsMap ? (
          <Fragment>
            <Tab data-testid="subNavListLink" as={Link} to={INCIDENTS_URL}>
              Lijst
            </Tab>
            <Tab className="active">
              <span>Kaart</span>
            </Tab>
          </Fragment>
        ) : (
          <Fragment>
            <Tab className="active">
              <span>Lijst</span>
            </Tab>
            <Tab data-testid="subNavMapLink" as={Link} to={MAP_URL}>
              Kaart
            </Tab>
          </Fragment>
        )}
      </TabContainer>
    </TabWrapper>
  </Wrapper>
);

SubNav.defaultProps = {
  showsMap: false,
};

SubNav.propTypes = {
  showsMap: PropTypes.bool,
};

export default SubNav;
