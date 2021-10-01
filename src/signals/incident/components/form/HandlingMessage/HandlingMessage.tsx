// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 Gemeente Amsterdam
import { Fragment, ReactElement } from 'react'
import type { FunctionComponent } from 'react'
import { Heading } from '@amsterdam/asc-ui'
import isString from 'lodash/isString'
import get from 'lodash/get'
import styled from 'styled-components'

const Paragraph = styled.p`
  margin: 0;
`

const renderText = (
  key: string,
  name: string,
  parent: Record<string, any>
): ReactElement => {
  const replacedValue = get(parent, `meta.incidentContainer.${key}`) as string
  if (replacedValue) {
    return (
      <Fragment>
        {replacedValue.split('\n\n').map((item: string, index: number) => (
          <Paragraph key={`${name}-${index + 1}`}>{item}</Paragraph>
        ))}
      </Fragment>
    )
  }

  return <Paragraph>We gaan zo snel mogelijk aan de slag.</Paragraph>
}

interface HandlingMessageProps {
  meta: {
    title: string
    key: string
    name: string
    isVisible: boolean
  }
  parent: Record<string, any>
}

const HandlingMessage: FunctionComponent<HandlingMessageProps> = ({
  meta,
  parent,
}) =>
  meta.isVisible ? (
    <div>
      <Heading as="h2" styleAs="h3">
        {meta.title}
      </Heading>

      {meta.key &&
        isString(meta.key) &&
        renderText(meta.key, meta.name, parent)}
    </div>
  ) : null

export default HandlingMessage
