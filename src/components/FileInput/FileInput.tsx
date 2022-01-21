import { Enlarge, TrashBin } from '@amsterdam/asc-assets'
import { ErrorWrapper } from 'components/ErrorMessage'
import type { FunctionComponent } from 'react'
import { useCallback, useState, useEffect } from 'react'
import Label from 'components/Label'
import Paragraph from 'components/Paragraph'
import FileInputStyle, {
  AddButton,
  AddIcon,
  DeleteButton,
  FileInputEmptyBox,
  FileInputPreviewBox,
  FileInputUploadButton,
  FilePreview,
  ScreenReaderOnly,
  StyledErrorMessage,
} from './styles'

interface FileInputProps {
  maxNumberOfFiles?: number
  minFileSize?: number
  maxFileSize?: number
  allowedFileTypes?: string[]
  name: string
  label: string
  helpText?: string
  required?: boolean
  errorMessages?: string[]
  onChange: (files: File[]) => void
  files?: File[]
}

const FileInput: FunctionComponent<FileInputProps> = ({
  maxNumberOfFiles = 3,
  allowedFileTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'],
  required = false,
  files = [],
  errorMessages = [],
  name,
  label,
  helpText,
  onChange,
}) => {
  const [previews, setPreviews] = useState<string[]>([])
  const [keyValue, setKeyValue] = useState(1)

  useEffect(() => {
    setKeyValue(keyValue + 1)
    setPreviews(files.map(window.URL.createObjectURL))
  }, [files])

  const numberOfEmtpy = maxNumberOfFiles - files.length - 1
  const empty = numberOfEmtpy < 0 ? [] : [...Array(numberOfEmtpy).keys()]

  const addFiles = useCallback(
    (event) => {
      const newFiles = files.concat([...event.target.files])
      onChange(newFiles)
    },
    [files, onChange]
  )

  const removeFile = useCallback(
    (_event, index: number) => {
      window.URL.revokeObjectURL(previews[index])

      const newFiles = files.filter((_file, fileIndex) => fileIndex !== index)

      onChange(newFiles)
    },
    [files, onChange, previews]
  )

  return (
    <ErrorWrapper invalid={errorMessages.length > 0}>
      {label && (
        <Label inline htmlFor="fileUpload">
          <strong>{label}</strong>
          {!required && ' (niet verplicht)'}
        </Label>
      )}

      {helpText && (
        <Paragraph id={`subtitle-${name}`} light>
          {helpText}
        </Paragraph>
      )}

      {errorMessages.length > 0 &&
        errorMessages.map((message, index) => (
          <StyledErrorMessage
            key={index}
            data-testid="fileInputError"
            message={message}
          />
        ))}

      <FileInputStyle
        id={name}
        data-testid="fileInput"
        aria-describedby={helpText && `subtitle-${name}`}
      >
        {previews.length > 0 &&
          previews.map((preview, index) => (
            <FileInputPreviewBox
              key={`${preview}-${index}`}
              data-testid="fileInputPreviewBox"
            >
              <FilePreview preview={preview}>
                <DeleteButton
                  variant="blank"
                  icon={<TrashBin />}
                  data-testid="deleteFotoButton"
                  aria-label={`Verwijder foto ${index + 1}`}
                  type="button"
                  onClick={(event) => removeFile(event, index)}
                />
              </FilePreview>
            </FileInputPreviewBox>
          ))}

        {files.length < maxNumberOfFiles && (
          <FileInputUploadButton data-testid="fileInputUploadButton">
            <input
              key={keyValue}
              type="file"
              id="fileUpload"
              data-testid="fileInputUpload"
              accept={allowedFileTypes.join(',')}
              onChange={addFiles}
              name={name}
              multiple
              aria-label="Toevoegen foto"
            />

            <label htmlFor="fileUpload">
              <AddButton as="span">
                <ScreenReaderOnly>Toevoegen foto</ScreenReaderOnly>

                <AddIcon size={22}>
                  <Enlarge />
                </AddIcon>
              </AddButton>
            </label>
          </FileInputUploadButton>
        )}

        {empty.map((key) => (
          <FileInputEmptyBox data-testid="fileInputEmptyBox" key={key} />
        ))}
      </FileInputStyle>
    </ErrorWrapper>
  )
}

export default FileInput
