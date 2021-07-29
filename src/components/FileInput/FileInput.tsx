import { Enlarge, TrashBin } from '@amsterdam/asc-assets'
import ErrorMessage, { ErrorWrapper } from 'components/ErrorMessage'
import { useCallback, useState, useEffect, FunctionComponent } from 'react'
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
  errorMessage?: string
  onChange: (files: File[]) => void
}

const FileInput: FunctionComponent<FileInputProps> = ({
  maxNumberOfFiles = 3,
  allowedFileTypes = ['image/jpeg', 'image/png', 'image/gif'],
  required = false,
  name,
  label,
  helpText,
  errorMessage,
  onChange,
}) => {
  const [files, setFiles] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])

  useEffect(() => {
    onChange(files)

    if (files.length) {
      const objectUrls = [...files].map(URL.createObjectURL)

      setPreviews(objectUrls)
    }
  }, [files, onChange])

  const addFiles = useCallback(
    (event) => {
      setFiles(files.concat([...event.target.files]))
    },
    [files]
  )

  const removeFile = useCallback(
    (event: any, index: number) => {
      event.preventDefault()

      window.URL.revokeObjectURL(previews[index])
      setPreviews(() =>
        previews.filter((_element, previewIndex) => previewIndex !== index)
      )
      setFiles(() =>
        files.filter((_element, filesIndex) => filesIndex !== index)
      )
    },
    [files, previews]
  )

  const numberOfEmtpy = maxNumberOfFiles - previews.length - 1
  const empty = numberOfEmtpy < 0 ? [] : [...Array(numberOfEmtpy).keys()]

  return (
    <ErrorWrapper invalid={Boolean(errorMessage)}>
      <Label inline htmlFor={name}>
        <strong>{label}</strong>
        {!required && ' (niet verplicht)'}
      </Label>
      {helpText && (
        <Paragraph id={`help-text-${name}`} light>
          {helpText}
        </Paragraph>
      )}
      {errorMessage && <ErrorMessage message={errorMessage} />}
      <FileInputStyle
        id={name}
        aria-describedby={helpText && `help-text-${name}`}
      >
        {previews.length > 0 &&
          previews.map((preview, index) => (
            <FileInputPreviewBox
              key={preview}
              data-testid="fileInputPreviewBox"
            >
              <FilePreview preview={preview}>
                <DeleteButton
                  variant="blank"
                  icon={<TrashBin />}
                  aria-label={`Verwijder foto ${index + 1}`}
                  onClick={(event) => removeFile(event, index)}
                />
              </FilePreview>
            </FileInputPreviewBox>
          ))}

        {previews.length < maxNumberOfFiles && (
          <FileInputUploadButton>
            <input
              type="file"
              id="fileUpload"
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

        {empty.map((item) => (
          <FileInputEmptyBox key={item} />
        ))}
      </FileInputStyle>
    </ErrorWrapper>
  )
}

export default FileInput
