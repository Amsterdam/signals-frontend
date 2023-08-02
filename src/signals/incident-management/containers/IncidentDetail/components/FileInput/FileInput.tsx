// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 - 2023 Gemeente Amsterdam
import type { ReactNode } from 'react'
import { useCallback, useRef } from 'react'

import onButtonPress from 'utils/on-button-press'

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
  allowedFileTypes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    '.pdf',
  ],
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

  const inputRef = useRef<HTMLInputElement>(null)
  /* istanbul ignore next */
  const onKeyDownHandler = useCallback((event) => {
    onButtonPress(event, () => inputRef.current?.click())
  }, [])

  return (
    <FileInputUploadButton
      onKeyDown={onKeyDownHandler}
      data-testid="file-input-upload-button"
    >
      <input
        ref={inputRef}
        type="file"
        id="fileUpload"
        data-testid="file-input-upload"
        accept={allowedFileTypes.join(',')}
        onChange={addFiles}
        name={name}
        multiple={multiple}
        aria-label="Toevoegen bestand"
      />

      <label htmlFor="fileUpload">{children}</label>
    </FileInputUploadButton>
  )
}

export default FileInput
