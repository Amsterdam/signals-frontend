// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 Gemeente Amsterdam
import type { ReactNode } from 'react'
import { useCallback } from 'react'

import { FileInputUploadButton } from './styles'

interface FileInputProps {
  allowedFileTypes?: string[]
  multiple?: boolean
  name: string
  onChange: (files: File[]) => void
  files?: File[]
  children: ReactNode
}

const FileInput = ({
  allowedFileTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'],
  files = [],
  multiple = true,
  name,
  onChange,
  children,
}: FileInputProps) => {
  const addFiles = useCallback(
    (event) => {
      const newFiles = files.concat([...event.target.files])
      onChange(newFiles)
    },
    [files, onChange]
  )

  return (
    <FileInputUploadButton data-testid="file-input-upload-button">
      <input
        type="file"
        id="fileUpload"
        data-testid="file-input-upload"
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
