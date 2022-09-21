import type { FunctionComponent } from 'react'
import { useCallback } from 'react'
import { FileInputUploadButton } from './styles'

interface FileInputProps {
  allowedFileTypes?: string[]
  multiple?: boolean
  name: string
  onChange: (files: File[]) => void
  files?: File[]
}

const FileInput: FunctionComponent<FileInputProps> = ({
  allowedFileTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'],
  files = [],
  multiple = true,
  name,
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
    <FileInputUploadButton data-testid="fileInputUploadButton">
      <input
        type="file"
        id="fileUpload"
        data-testid="fileInputUpload"
        accept={allowedFileTypes.join(',')}
        onChange={addFiles}
        name={name}
        multiple={multiple}
        aria-label="Toevoegen foto"
      />

      <label htmlFor="fileUpload">{children}</label>
    </FileInputUploadButton>
  )
}

export default FileInput
