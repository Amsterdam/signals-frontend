import { ErrorWrapper } from 'components/ErrorMessage'
import type { FunctionComponent } from 'react'
import { useCallback } from 'react'
import { FileInputStyle, FileInputUploadButton } from './styles'

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
  allowedFileTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'],
  files = [],
  errorMessages = [],
  name,
  helpText,
  onChange,
  children,
}) => {
  const addFiles = useCallback(
    (event) => {
      const newFiles = files.concat([...event.target.files])
      onChange(newFiles)
    },
    [files, onChange]
  )

  return (
    <ErrorWrapper invalid={errorMessages.length > 0}>
      <FileInputStyle
        id={name}
        data-testid="fileInput"
        aria-describedby={helpText && `subtitle-${name}`}
      >
        <FileInputUploadButton data-testid="fileInputUploadButton">
          <input
            type="file"
            id="fileUpload"
            data-testid="fileInputUpload"
            accept={allowedFileTypes.join(',')}
            onChange={addFiles}
            name={name}
            multiple
            aria-label="Toevoegen foto"
          />

          <label htmlFor="fileUpload">{children}</label>
        </FileInputUploadButton>
      </FileInputStyle>
    </ErrorWrapper>
  )
}

export default FileInput
