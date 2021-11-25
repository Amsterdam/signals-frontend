// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2021 Gemeente Amsterdam
import PropTypes from 'prop-types'
import styled, { css } from 'styled-components'
import { Link } from 'react-router-dom'
import {
  Heading,
  Link as AscLink,
  themeSpacing,
  themeColor,
  breakpoint,
} from '@amsterdam/asc-ui'

import { incidentType } from 'shared/types'
import { getIsAuthenticated } from 'shared/services/auth/auth'

const Section = styled.section`
  position: relative;
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
`

const Header = styled.header`
  display: grid;
  position: relative;
  column-gap: ${themeSpacing(5)};
  grid-template-columns: 12fr;

  ${() =>
    getIsAuthenticated() &&
    css`
      @media (min-width: ${({ theme }) => theme.layouts.large.min}px) {
        grid-template-columns: 4fr 6fr 2fr;
      }
    `}
`

const LinkContainer = styled.div`
  padding-top: ${themeSpacing(5)};

  @media screen and ${breakpoint('min-width', 'laptopM')} {
    padding-top: 0;

    a {
      position: absolute;
      top: ${themeSpacing(4)};
      right: 0;
    }
  }
`

const Dl = styled.dl`
  display: grid;
  grid-row-gap: ${themeSpacing(4)};
  margin: 0;
  padding: 0;
`

const DefinitionsWrapper = styled.div`
  display: grid;
  column-gap: ${themeSpacing(5)};
  margin: 0;

  @media (min-width: ${({ theme }) => theme.layouts.big.min}px) {
    grid-template-columns: 4fr 6fr;
  }

  ${() =>
    getIsAuthenticated() &&
    css`
      @media (min-width: ${({ theme }) => theme.layouts.large.min}px) {
        grid-template-columns: 4fr 6fr 2fr;
      }
    `}

  dt {
    color: ${themeColor('tint', 'level5')};
  }
`

const Wrapper = styled.div`
  margin-bottom: ${themeSpacing(8)};
  word-break: normal;
`

const IncidentPreview = ({ incident, preview, sectionLabels }) => (
  <Wrapper data-testid="incidentPreview">
    {Object.entries(preview).map(([section, value]) => {
      const editLinkLabel = sectionLabels.edit[section]
      const sectionHeadingLabel = sectionLabels.heading[section]
      const hasHeading = Boolean(sectionHeadingLabel)
      const visibleEntries = Object.entries(value).filter(
        ([entryKey, { optional, authenticated }]) => {
          if (authenticated && !getIsAuthenticated()) {
            return false
          }

          if (!optional) {
            return true
          }

          if (Array.isArray(incident[entryKey])) {
            return incident[entryKey].length > 0
          }

          try {
            if (
              Object.prototype.hasOwnProperty.call(incident[entryKey], 'value')
            ) {
              return incident[entryKey].value
            }
          } catch {
            // no-op
          }

          return Boolean(incident[entryKey])
        }
      )

      return (
        visibleEntries.length > 0 && (
          <Section hasHeading={hasHeading} key={section}>
            {sectionHeadingLabel && (
              <Header>
                <Heading as="h2" styleAs="h3">
                  {sectionHeadingLabel}
                </Heading>
              </Header>
            )}

            <Dl>
              {visibleEntries.map(([itemKey, itemValue]) => (
                <DefinitionsWrapper key={itemKey}>
                  <dt>{itemValue.label}</dt>
                  <dd>
                    {itemValue.render({
                      ...itemValue,
                      value: incident[itemKey],
                      incident,
                    })}
                  </dd>
                </DefinitionsWrapper>
              ))}
            </Dl>

            <LinkContainer>
              <AscLink as={Link} to={`/incident/${section}`} variant="inline">
                {editLinkLabel}
              </AscLink>
            </LinkContainer>
          </Section>
        )
      )
    })}
  </Wrapper>
)

IncidentPreview.propTypes = {
  incident: incidentType.isRequired,
  preview: PropTypes.object,
  sectionLabels: PropTypes.shape({
    heading: PropTypes.object,
    edit: PropTypes.object,
  }),
}

export default IncidentPreview
