// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2022 Gemeente Amsterdam
import { Fragment } from 'react'
import type { FC } from 'react'

import { Heading, Link as AscLink } from '@amsterdam/asc-ui'
import { Link } from 'react-router-dom'

import { getIsAuthenticated } from 'shared/services/auth/auth'
import type { Sections } from 'signals/incident/definitions/wizard'
import type { Incident, ValueObject } from 'types/incident'

import { Dl, Header, LinkContainer, Section, Wrapper } from './styled'

type Section = {
  authenticated?: boolean
  canBeNull?: boolean
  label: string
  optional?: boolean
  render: FC<{ value: any; incident: Incident }> | FC<{ value: any }>
}

type Preview = {
  [Key in Sections]: Record<string, Section>
}

export type SectionLabels = {
  [Key in 'heading' | 'edit']: {
    [Key in Sections | string]: string
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
  <Wrapper data-testid="incident-preview">
    {Object.entries(preview).map(([sectionId, value]) => {
      const editLinkLabel = sectionLabels.edit[sectionId as keyof Preview]
      const sectionHeadingLabel =
        sectionLabels.heading[sectionId as keyof Preview]

      const visibleEntries = Object.entries(value).filter(
        ([entryKey, { optional, authenticated, canBeNull }]) => {
          const incidentProp = entryKey as keyof Incident

          if (authenticated && !getIsAuthenticated()) {
            return false
          }

          if (!optional) {
            return true
          }

          if (canBeNull && incident[incidentProp] === null) {
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
        <Section key={sectionId}>
          {sectionHeadingLabel && (
            <Header>
              <Heading as="h2" styleAs="h3">
                {sectionHeadingLabel}
              </Heading>
            </Header>
          )}

          {visibleEntries.length > 0 ? (
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
          ) : (
            'U hebt geen contactgegevens ingevuld. We kunnen u niet laten weten wat wij hebben gedaan met uw melding.'
          )}

          <LinkContainer>
            <AscLink as={Link} to={`/incident/${sectionId}`} variant="inline">
              {editLinkLabel}
            </AscLink>
          </LinkContainer>
        </Section>
      )
    })}
  </Wrapper>
)

export default IncidentPreview
