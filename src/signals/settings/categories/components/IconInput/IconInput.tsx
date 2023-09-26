// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam
import { useCallback, useEffect, useState } from 'react'

import { TrashBin } from '@amsterdam/asc-assets'
import { Controller } from 'react-hook-form'
import { useParams } from 'react-router-dom'

import Button from 'components/Button'
import { useConfirm } from 'hooks/useConfirm'
import useFetch from 'hooks/useFetch'
import configuration from 'shared/services/configuration/configuration'
import FileInput from 'signals/incident-management/containers/IncidentDetail/components/FileInput'
import useUpload from 'signals/incident-management/containers/IncidentDetail/hooks/useUpload'

import useFetchResponseNotification from '../../../hooks/useFetchResponseNotification'
import {
  DeleteButton,
  FieldGroup,
  StyledHeading,
  StyledIcon,
  StyledSpan,
  Wrapper,
} from '../styled'
import { StyledDiv } from '../styled'

interface Props {
  icon: string | null
  formMethods: any
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
    requestType: type || 'PUT',
  })

  const handleOnChange = async (files: File[]) => {
    const confirmed = await isConfirmed(
      'Let op! Je veranderd een icoon. ',
      'Er wordt geen back-up van het icoon gemaakt.'
    )

    if (confirmed) {
      setFile(files[0])
      categoryId &&
        upload(
          files,
          Number(categoryId),
          `${configuration.CATEGORIES_PRIVATE_ENDPOINT}${categoryId}/icon`,
          'icon',
          'PUT'
        )
    }

    if (!confirmed) {
      setFile(null)
    }
  }

  const handleOnDelete = useCallback(
    async (event) => {
      event.preventDefault()

      const confirmed = await isConfirmed(
        'Let op! Je verwijderd een icoon. ',
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

  useEffect(() => {
    let fileReader: any
    let isCancel = false

    if (file) {
      fileReader = new FileReader()
      fileReader.onload = (e: { target: { result: string } }) => {
        const { result } = e.target
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

  return (
    <FieldGroup>
      <StyledHeading>Icoon</StyledHeading>

      {/* Informatie */}

      <Controller
        name="icon"
        control={formMethods.control}
        render={({ field: { name } }) => (
          <StyledDiv>
            {fileDataURL ? (
              <StyledIcon size={32}>
                <img alt="Icoon" src={fileDataURL} />
              </StyledIcon>
            ) : (
              <StyledSpan>Niet ingesteld</StyledSpan>
            )}

            <Wrapper>
              <FileInput
                allowedFileTypes={['image/svg+xml']}
                name={name}
                onChange={handleOnChange}
                multiple={false}
              >
                <Button
                  forwardedAs={'span'}
                  tabIndex={0}
                  variant="primaryInverted"
                  type="button"
                >
                  {label}
                </Button>
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
