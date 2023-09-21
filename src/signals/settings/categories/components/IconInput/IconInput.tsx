import { useEffect, useState } from 'react'

import { Controller } from 'react-hook-form'
import { useParams } from 'react-router-dom'

import Button from 'components/Button'
import { useConfirm } from 'hooks/useConfirm'
import configuration from 'shared/services/configuration/configuration'
import FileInput from 'signals/incident-management/containers/IncidentDetail/components/FileInput'

import {
  StyeldAlert as Alert,
  FieldGroup,
  StyledHeading,
  StyledIcon,
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
  const { categoryId } = useParams<{ categoryId: string }>()
  const categoryURL = `${configuration.CATEGORIES_PRIVATE_ENDPOINT}${categoryId}/icon`
  const label = icon ? 'Icoon wijzigen' : 'Icoon toevoegen'
  const handleOnChange = async (e: File[]) => {
    setFile(e[0])

    const confirmed = await isConfirmed(
      'Let op! Je veranderd een icoon. ',
      'Er wordt geen back-up van het icoon gemaakt.'
    )

    if (confirmed) {
      categoryURL
      // TODO: patch to categoryURL
    }
  }

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
            {fileDataURL && (
              <StyledIcon size={32}>
                <img alt="Icoon" src={fileDataURL} />
              </StyledIcon>
            )}

            {file && (
              <Alert
                level="info"
                heading="Let op! Er wordt geen back-up van het icoon gemaakt."
                content="Om te annuleren gebruik de knop onderaan de pagina."
              />
            )}

            <FileInput
              allowedFileTypes={['image/svg']}
              name={name}
              onChange={(event) => handleOnChange(event)}
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
          </StyledDiv>
        )}
      />
    </FieldGroup>
  )
}
