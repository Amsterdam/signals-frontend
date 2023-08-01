// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam
import { StyledHeader } from './styles'
import type { FormMeta } from '../../../../../types/reactive-form'

type Props = {
  meta: FormMeta
}

export const QuestionHeader = ({ meta }: Props) => (
  <StyledHeader>{meta.label}</StyledHeader>
)
