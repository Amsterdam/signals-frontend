// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam

import { useState } from 'react'

import { TrashBin } from '@amsterdam/asc-assets'
import { Alert } from '@amsterdam/asc-ui'

import {
  DeleteButton,
  FileInputWrapper,
  StyledButton,
  StyledImg,
  WrapperIconAdd,
} from './styled'
import { default as AddIcon } from '../../../../incident-management/containers/IncidentDetail/components/FileInput/index'

export const FileInput = () => {
  const [file, setFile] = useState<File>()

  const icon = file ? window.URL.createObjectURL(file) : ''
  const IconButtonText = file ? 'Icoon wijzigen' : 'Icoon toevoegen'
  const removeFile = () => {
    return 1 + 1
  }
  const handleIconClick = (file: File[]) => {
    setFile(file[0])
  }

  // const removeFile = useCallback(
  //   (_event, index: number) => {
  //     setKeyValue(keyValue + 1)
  //
  //     window.URL.revokeObjectURL(previews[index])
  //
  //     const newFiles = files.filter((_file, fileIndex) => fileIndex !== index)
  //
  //     onChange(newFiles)
  //   },
  //   [files, onChange, previews, keyValue]
  // )
  return (
    <>
      <FileInputWrapper>
        {file && (
          <>
            <StyledImg alt={'icon added'} src={icon} />
            <Alert level="info">
              Let op! Er wordt geen back-up van het icoon gemaakt. Om te
              annuleren gebruik de knop onderaan de pagina{' '}
            </Alert>
          </>
        )}
        <WrapperIconAdd>
          <AddIcon multiple={false} name="addIcon" onChange={handleIconClick}>
            <StyledButton
              variant="application"
              type="button"
              forwardedAs={'span'}
              tabIndex={0}
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
