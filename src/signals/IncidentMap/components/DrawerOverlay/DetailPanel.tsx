// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 Gemeente Amsterdam
import { Close } from '@amsterdam/asc-assets'

import { DetailContent } from '../DetailContent'
import { CloseButton, DetailsWrapper } from './styled'

interface Props {
  onClose: () => void
  incident: any
}

export const DetailPanel = ({ onClose, incident }: Props) => {
  if (!incident) {
    return null
  }

  return (
    <DetailsWrapper id="device-details">
      <CloseButton
        type="button"
        variant="blank"
        title="Legenda"
        data-testid="legenda"
        iconSize={20}
        onClick={onClose}
        iconLeft={<Close />}
      />
      <DetailContent incident={incident} />
    </DetailsWrapper>
  )
}
