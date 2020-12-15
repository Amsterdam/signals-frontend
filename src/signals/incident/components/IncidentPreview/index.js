import React from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import { Link } from 'react-router-dom';
import { Heading, Link as AscLink, themeSpacing, themeColor, Hidden } from '@amsterdam/asc-ui';

import { incidentType } from 'shared/types';
import { isAuthenticated } from 'shared/services/auth/auth';

const Section = styled.section`
  padding: ${themeSpacing(4, 0)};
  border-top: 2px solid ${themeColor('tint', 'level3')};

  &:last-of-type {
    border-bottom: 2px solid ${themeColor('tint', 'level3')};
  }

  ${({ hasHeading }) =>
    hasHeading &&
    css`
      padding-bottom: ${themeSpacing(8)};

      header {
        padding-bottom: ${themeSpacing(3)};
      }
    `}
`;

const Header = styled.header`
  display: grid;
  position: relative;
  column-gap: ${themeSpacing(5)};
  grid-template-columns: 8fr 4fr;

  ${() =>
    isAuthenticated() &&
    css`
      @media (min-width: ${({ theme }) => theme.layouts.large.min}px) {
        grid-template-columns: 4fr 6fr 2fr;
      }
    `}
`;

const LinkContainer = styled.div`
  padding-top: ${themeSpacing(5)};

  ${({ positionTop }) =>
    positionTop &&
    css`
      text-align: right;
      padding-top: 0;
    `}

  ${({ absolutePosLink }) =>
    absolutePosLink &&
    css`
      position: relative;

      a {
        position: absolute;
        top: 0;
        right: 0;
      }
    `}
`;

const Ul = styled.ul`
  display: grid;
  grid-row-gap: ${themeSpacing(4)};
  margin: 0;
  padding: 0;
`;

const Li = styled.li`
  display: grid;
  column-gap: ${themeSpacing(5)};
  margin: 0;

  @media (min-width: ${({ theme }) => theme.layouts.big.min}px) {
    grid-template-columns: 4fr 6fr;
  }

  ${() =>
    isAuthenticated() &&
    css`
      @media (min-width: ${({ theme }) => theme.layouts.large.min}px) {
        grid-template-columns: 4fr 6fr 2fr;
      }
    `}

  dt {
    color: ${themeColor('tint', 'level5')};
  }
`;

const Wrapper = styled.div`
  margin-bottom: ${themeSpacing(8)};
`;

const heading = previewKey => {
  switch (previewKey) {
    case 'beschrijf':
      return (
        <Heading as="h2" styleAs="h3">
          Melding
        </Heading>
      );

    case 'vulaan':
      return (
        <Heading as="h2" styleAs="h3">
          Aanvullende informatie
        </Heading>
      );

    default:
      return null;
  }
};

const getEditLinkText = (section, value) => {
  if (section === 'beschrijf') return 'Wijzig melding';
  if (section === 'vulaan') return 'Wijzig aanvullende informatie';

  const entry = Object.entries(value)[0];
  if (entry && entry[1].label) return `Wijzig ${entry[1].label.toLowerCase()}`;

  return 'Wijzigen';
};

const IncidentPreview = ({ incident, preview }) => (
  <Wrapper data-testid="incidentPreview">
    {Object.entries(preview).map(([section, value]) => {
      const sectionHeading = heading(section);
      const hasHeading = Boolean(sectionHeading);
      const editLinkText = getEditLinkText(section, value);
      const visibleEntries = Object.entries(value).filter(([entryKey, { optional, authenticated }]) => {
        if (authenticated && !isAuthenticated()) {
          return false;
        }

        if (!optional) {
          return true;
        }

        if (Array.isArray(incident[entryKey])) {
          return incident[entryKey].length > 0;
        }

        return Boolean(incident[entryKey]);
      });

      return (
        visibleEntries.length > 0 && (
          <Section hasHeading={hasHeading} key={section}>
            <Header>
              {sectionHeading || <div />}
              <Hidden maxBreakpoint="laptop">
                <LinkContainer absolutePosLink={!hasHeading} positionTop>
                  <AscLink as={Link} to={`/incident/${section}`} variant="inline">
                    {editLinkText}
                  </AscLink>
                </LinkContainer>
              </Hidden>
            </Header>

            <Ul>
              {visibleEntries.map(([itemKey, itemValue]) => (
                <Li key={itemKey}>
                  <dt>{itemValue.label}</dt>
                  <dd>
                    {itemValue.render({
                      ...itemValue,
                      value: incident[itemKey],
                      incident,
                    })}
                  </dd>
                </Li>
              ))}
            </Ul>
            <Hidden minBreakpoint="laptop">
              <LinkContainer>
                <AscLink as={Link} to={`/incident/${section}`} variant="inline">
                  {editLinkText}
                </AscLink>
              </LinkContainer>
            </Hidden>
          </Section>
        )
      );
    })}
  </Wrapper>
);

IncidentPreview.propTypes = {
  incident: incidentType.isRequired,
  preview: PropTypes.object,
};

export default IncidentPreview;
