// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam

import { useCallback, useState } from 'react'

import { TrashBin } from '@amsterdam/asc-assets'

import {
  DeleteButton,
  FileInputWrapper,
  StyledAlert,
  StyledButton,
  StyledImg,
  WrapperIconAdd,
} from './styled'
import ErrorMessage from '../../../../../components/ErrorMessage'
import { default as AddIcon } from '../../../../incident-management/containers/IncidentDetail/components/FileInput/index'

const ALLOWED_FILE_TYPE = 'svg'
const MAX = 20 * 2 ** 20 // 20 MiB

export interface Props {
  updateErrorUploadIcon: (arg: boolean) => void
}
export const FileInput = ({ updateErrorUploadIcon }: Props) => {
  const [file, setFile] = useState<File>()
  const [error, setError] = useState('')
  const [$hasError, set$hasError] = useState(false)

  const icon = file ? window.URL.createObjectURL(file) : ''
  const IconButtonText = file ? 'Icoon wijzigen' : 'Icoon toevoegen'
  const handleIconClick = useCallback(
    (file: File[]) => {
      setError('')
      setFile(undefined)
      set$hasError(false)
      if (file[0].name.slice(file[0].name.length - 3) != ALLOWED_FILE_TYPE) {
        updateErrorUploadIcon(true)
        set$hasError(true)
        setError('Dit is het verkeerde bestandstype. Upload een .svg-bestand.')
        return
      }
      if (file[0].size > MAX) {
        updateErrorUploadIcon(true)
        set$hasError(true)
        setError(
          `De afmetingen van het bestand zijn te groot. Maximaal 32px bij 32px.`
        )
        return
      }

      if (file && !error) setFile(file[0])
    },
    [error, updateErrorUploadIcon]
  )

  const removeFile = () => {
    setError('')
    setFile(undefined)
  }

  return (
    <>
      <FileInputWrapper>
        {file && (
          <>
            <StyledImg alt={'icon added'} src={icon} />
            <StyledAlert>
              <b>Let op! Er wordt geen back-up van het icoon gemaakt.</b>
              <p>Om te annuleren gebruik de knop onderaan de pagina.</p>
            </StyledAlert>
          </>
        )}
        {error && <ErrorMessage message={error} />}
        <WrapperIconAdd>
          <AddIcon multiple={false} name="addIcon" onChange={handleIconClick}>
            <StyledButton
              name="Icon"
              variant="application"
              type="button"
              forwardedAs={'span'}
              tabIndex={0}
              $hasError={$hasError}
            >
              {IconButtonText}
            </StyledButton>
          </AddIcon>
          {file && (
            <DeleteButton
              variant="blank"
              icon={<TrashBin />}
              data-testid="delete-icon-button"
              aria-label={`Verwijder icoon`}
              type="button"
              onClick={() => removeFile()}
            />
          )}
        </WrapperIconAdd>
      </FileInputWrapper>
    </>
  )
}
