// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2021 Gemeente Amsterdam
import { Fragment } from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import {
  Heading,
  Link as AscLink,
  themeSpacing,
  themeColor,
  breakpoint,
} from '@amsterdam/asc-ui'

import type { FC } from 'react'
import type { Incident, ValueObject } from 'types/incident'

import { getIsAuthenticated } from 'shared/services/auth/auth'

const Section = styled.section`
  position: relative;
  padding: ${themeSpacing(6, 0, 0)};
  border-top: 2px solid ${themeColor('tint', 'level3')};

  &:last-of-type {
    border-bottom: 2px solid ${themeColor('tint', 'level3')};
  }
`

const Header = styled.header`
  display: grid;
  position: relative;
  column-gap: ${themeSpacing(5)};
  grid-template-columns: 12fr;
  margin-bottom: ${themeSpacing(4)};
`

const LinkContainer = styled.div`
  padding: ${themeSpacing(6)} 0;

  @media screen and ${breakpoint('min-width', 'laptopM')} {
    padding-top: 0;

    a {
      position: absolute;
      top: ${themeSpacing(6)};
      right: 0;
    }
  }
`

const Dl = styled.dl`
  margin: 0;
  padding: 0;
  line-height: 24px;
  dd:not(:last-of-type) {
    margin-bottom: ${themeSpacing(6)};
  }

  dt {
    font-weight: 700;
    margin-bottom: ${themeSpacing(1)};
  }
`

const Wrapper = styled.div`
  margin-bottom: ${themeSpacing(8)};
  word-break: normal;
`

type Sections = 'beschrijf' | 'vulaan' | 'contact'

type Section = {
  authenticated?: boolean
  label: string
  optional?: boolean
  render: FC<{ value: any; incident: Incident }> | FC<{ value: any }>
}

type Preview = {
  [Key in Sections]: Record<string, Section>
}

type SectionLabels = {
  [Key in 'heading' | 'edit']: {
    [Key in Sections]: string
  }
}

export interface IncidentPreviewProps {
  incident: Incident
  preview: Preview
  sectionLabels: SectionLabels
}

const IncidentPreview: FC<IncidentPreviewProps> = ({
  incident,
  preview,
  sectionLabels,
}) => (
  <Wrapper data-testid="incidentPreview">
    {Object.entries(preview).map(([section, value]) => {
      const editLinkLabel = sectionLabels.edit[section as keyof Preview]
      const sectionHeadingLabel =
        sectionLabels.heading[section as keyof Preview]

      const visibleEntries = Object.entries(value).filter(
        ([entryKey, { optional, authenticated }]) => {
          const incidentProp = entryKey as keyof Incident

          if (authenticated && !getIsAuthenticated()) {
            return false
          }

          if (!optional) {
            return true
          }

          if (Array.isArray(incident[incidentProp])) {
            return (incident[incidentProp] as []).length > 0
          }

          try {
            if (
              Object.prototype.hasOwnProperty.call(
                incident[incidentProp],
                'value'
              )
            ) {
              return (incident[incidentProp] as ValueObject).value
            }
          } catch {
            // no-op
          }

          return Boolean(incident[incidentProp])
        }
      )

      return (
        visibleEntries.length > 0 && (
          <Section key={section}>
            {sectionHeadingLabel && (
              <Header>
                <Heading as="h2" styleAs="h3">
                  {sectionHeadingLabel}
                </Heading>
              </Header>
            )}
            <Dl>
              {visibleEntries.map(([itemKey, itemValue]) => (
                <Fragment key={itemKey}>
                  <dt>{itemValue.label}</dt>
                  <dd>
                    {itemValue.render({
                      ...itemValue,
                      value: incident[itemKey as keyof Incident],
                      incident,
                    })}
                  </dd>
                </Fragment>
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

export default IncidentPreview
