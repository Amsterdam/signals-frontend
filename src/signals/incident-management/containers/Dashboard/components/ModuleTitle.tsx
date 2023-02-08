// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam
import { Amount, Title, Subtitle } from './styled'

interface Props {
  title: string
  subtitle?: string
  amount?: number | string
}

export const ModuleTitle = ({ title, subtitle, amount }: Props) => (
  <>
    <Title>
      {title}
      {amount && <Amount> {amount}</Amount>}
    </Title>
    {subtitle && <Subtitle>{subtitle}</Subtitle>}
  </>
)
