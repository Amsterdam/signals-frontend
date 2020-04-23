import React from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import { Link } from 'react-router-dom';
import { Heading, Link as AscLink, themeSpacing, themeColor } from '@datapunt/asc-ui';

import { incidentType } from 'shared/types';

import isVisible from './services/is-visible';

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
  grid-template-columns: 10fr 2fr;

  @media (min-width: ${({ theme }) => theme.layouts.big.min}px) {
    column-gap: ${({ theme }) => theme.layouts.big.gutter}px;
  }

  @media (min-width: ${({ theme }) => theme.layouts.large.min}px) {
    column-gap: ${({ theme }) => theme.layouts.large.gutter}px;
  }

  a {
    position: absolute;
    right: 0;
  }
`;

const Body = styled.div`
  display: grid;
  grid-row-gap: ${themeSpacing(4)};
`;

const Dl = styled.div`
  display: grid;

  @media (min-width: ${({ theme }) => theme.layouts.medium.min}px) {
    column-gap: ${({ theme }) => theme.layouts.medium.gutter}px;
    grid-template-columns: 4fr 6fr;
  }

  @media (min-width: ${({ theme }) => theme.layouts.big.min}px) {
    column-gap: ${({ theme }) => theme.layouts.big.gutter}px;
  }

  @media (min-width: ${({ theme }) => theme.layouts.large.min}px) {
    column-gap: ${({ theme }) => theme.layouts.large.gutter}px;
  }

  dt {
    color: ${themeColor('tint', 'level5')};
  }
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

const IncidentPreview = ({ incident, preview }) => (
  <div data-testid="incidentPreview">
    {Object.entries(preview).map(([section, value]) => {
      const sectionHeading = heading(section);
      const hasHeading = Boolean(sectionHeading);

      return (
        <Section hasHeading={hasHeading} key={section}>
          <Header>
            {sectionHeading}
            <AscLink as={Link} to={`/incident/${section}`} variant="inline">
              Wijzigen
            </AscLink>
          </Header>

          <Body>
            {Object.entries(value).map(
              ([itemKey, itemValue]) =>
                isVisible(incident[itemKey], itemValue) && (
                  <Dl key={itemKey}>
                    <dt>{itemValue.label}</dt>
                    <dd>
                      {itemValue.render({
                        ...itemValue,
                        value: incident[itemKey],
                        incident,
                      })}
                    </dd>
                  </Dl>
                )
            )}
          </Body>
        </Section>
      );
    })}
  </div>
);

IncidentPreview.propTypes = {
  incident: incidentType.isRequired,
  preview: PropTypes.object,
};

export default IncidentPreview;
