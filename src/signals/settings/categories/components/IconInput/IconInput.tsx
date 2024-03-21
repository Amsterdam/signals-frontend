// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam
import { useCallback, useEffect, useState } from 'react'

import { TrashBin } from '@amsterdam/asc-assets'
import { Controller } from 'react-hook-form'
import { useParams } from 'react-router-dom'

import { useConfirm } from 'hooks/useConfirm'
import useFetch from 'hooks/useFetch'
import { RequestType } from 'hooks/useFetch'
import configuration from 'shared/services/configuration/configuration'
import FileInput from 'signals/incident-management/containers/IncidentDetail/components/FileInput'
import useUpload from 'signals/incident-management/containers/IncidentDetail/hooks/useUpload'

import { Detail } from '../../../../../components/Detail'
import useFetchResponseNotification from '../../../hooks/useFetchResponseNotification'
import { ICONEXAMPLE } from '../../constants'
import type { Props as CategoryFormProps } from '../CategoryForm'
import {
  DeleteButton,
  FieldGroup,
  StyledButton,
  StyledHeading,
  StyledIcon,
  Wrapper,
} from '../styled'
import { StyledDiv } from '../styled'

export interface Props {
  icon: string | null
  formMethods: CategoryFormProps['formMethods']
}

export const IconInput = ({ formMethods, icon }: Props) => {
  const [file, setFile] = useState<File | null>(null)
  const [fileDataURL, setFileDataURL] = useState<string | null>(icon)

  const { isConfirmed } = useConfirm()
  const { upload, uploadSuccess, uploadError } = useUpload()
  const { categoryId } = useParams<{ categoryId: string }>()

  const label = fileDataURL ? 'Icoon wijzigen' : 'Icoon toevoegen'

  const { del: deleteIcon, isLoading, isSuccess, error, type } = useFetch()

  useFetchResponseNotification({
    entityName: 'Icoon',
    error: error || uploadError,
    isLoading,
    isSuccess: isSuccess || uploadSuccess,
    requestType: type || RequestType.PUT,
  })

  const handleOnChange = useCallback(
    async (files: File[]) => {
      let confirmed
      if (!fileDataURL) confirmed = true
      if (fileDataURL) {
        confirmed = await isConfirmed(
          'Let op, je wijzigt het icoon ',
          'Er wordt geen back-up van het icoon gemaakt.'
        )
      }

      if (confirmed) {
        setFile(files[0])
        categoryId &&
          upload(
            files,
            Number(categoryId),
            `${configuration.CATEGORIES_PRIVATE_ENDPOINT}${categoryId}/icon`,
            'icon',
            RequestType.PUT
          )
      }

      if (!confirmed) {
        setFile(null)
      }
    },
    [categoryId, fileDataURL, isConfirmed, upload]
  )

  const handleOnDelete = useCallback(
    async (event) => {
      event.preventDefault()

      const confirmed = await isConfirmed(
        'Let op, je verwijdert het icoon ',
        'Er wordt geen back-up van het icoon gemaakt.'
      )

      if (confirmed) {
        deleteIcon(
          `${configuration.CATEGORIES_PRIVATE_ENDPOINT}${categoryId}/icon`
        )
        setFile(null)
        setFileDataURL(null)
      }
    },
    [categoryId, deleteIcon, isConfirmed]
  )

  // istanbul ignore next
  useEffect(() => {
    let fileReader: FileReader
    let isCancel = false

    if (file) {
      fileReader = new FileReader()
      fileReader.onload = (e) => {
        const result = e?.target?.result as string
        if (result && !isCancel) {
          setFileDataURL(result)
        }
      }
      fileReader.readAsDataURL(file)
    }
    return () => {
      isCancel = true
      if (fileReader && fileReader.readyState === 1) {
        fileReader.abort()
      }
    }
  }, [file])

  useEffect(() => {
    setFileDataURL(icon)
  }, [icon])

  return (
    <FieldGroup>
      <StyledHeading>Icoon</StyledHeading>
      <Detail
        header={'Het icoon wordt getoond op de openbare meldingenkaart.'}
        content={'Zorg voor een cirkel en exporteer als SVG.'}
      >
        {ICONEXAMPLE}
      </Detail>
      <Controller
        name="icon"
        control={formMethods.control}
        render={({ field: { name } }) => (
          <StyledDiv>
            {fileDataURL && (
              <StyledIcon size={32}>
                <img width={32} height={32} alt="Icoon" src={fileDataURL} />
              </StyledIcon>
            )}

            <Wrapper>
              <FileInput
                allowedFileTypes={['image/svg+xml']}
                name={name}
                onChange={handleOnChange}
                multiple={false}
              >
                <StyledButton
                  forwardedAs={'span'}
                  tabIndex={0}
                  variant="primaryInverted"
                  type="button"
                >
                  {label}
                </StyledButton>
              </FileInput>

              {fileDataURL && (
                <DeleteButton
                  icon={<TrashBin />}
                  iconSize={16}
                  title="Icoon verwijderen"
                  variant="application"
                  onClick={handleOnDelete}
                />
              )}
            </Wrapper>
          </StyledDiv>
        )}
      />
    </FieldGroup>
  )
}
