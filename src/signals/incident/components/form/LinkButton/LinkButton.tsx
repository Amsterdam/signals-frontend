// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 - 2024 Gemeente Amsterdam
import type { FunctionComponent } from 'react'

import { Button, Heading } from '@amsterdam/asc-ui'

interface ButtonProps {
  meta: {
    label: string
    href: string
    title?: string
  }
}

const LinkButton: FunctionComponent<ButtonProps> = ({
  meta: { label, href, title },
}) => (
  <div>
    {title && (
      <Heading as="h2" styleAs="h3">
        {title}
      </Heading>
    )}

    <Button
      type="button"
      variant="primary"
      as="a"
      href={href}
      onClick={() => {
        ;(window as any)?.dataLayer?.push({
          event: 'interaction.generic.component.linkClick',
          meta: {
            category: 'interaction.generic.component.linkClick',
            action: 'confirmationPageLink - intern',
            label: 'Doe een melding - /incident/beschrijf',
          },
        })
      }}
    >
      {label}
    </Button>
  </div>
)

export default LinkButton
