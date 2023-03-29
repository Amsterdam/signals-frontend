// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 - 2023 Vereniging van Nederlandse Gemeenten, Gemeente Amsterdam
import isEmpty from 'lodash/isEmpty'
import { useFormContext } from 'react-hook-form'

import { StyledErrorAlert } from './styled'
import type { Meta } from '../../signals/incident/components/form/MapSelectors/types'

type Props = {
  meta?: Meta
}

const GlobalError = ({ meta }: Props) => {
  const { formState } = useFormContext()
  return !isEmpty(formState?.errors) ? (
    <StyledErrorAlert>
      {meta?.label ||
        'U hebt niet alle vragen beantwoord. Vul hieronder aan alstublieft.'}
    </StyledErrorAlert>
  ) : null
}
export default GlobalError
