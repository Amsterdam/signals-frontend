// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 - 2022 Vereniging van Nederlandse Gemeenten, Gemeente Amsterdam
import { useCallback, useState } from 'react'

import type { Control } from 'react-hook-form'
import { useController } from 'react-hook-form'

import FileInputComponent from 'components/FileInput'
import fileSize from 'signals/incident/services/file-size'

export const MIN = 30 * 2 ** 10 // 30 KiB
const MAX = 20 * 2 ** 20 // 20 MiB
const MAX_NUMBER_OF_FILES = 3
export const ALLOWED_FILE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/gif',
]
// const ALLOWED_EXTENSIONS = ALLOWED_FILE_TYPES.map((type) => type.split('/')[1])

type FileInputProps = {
  shortLabel: string
  id: string
  label: string
  trigger: (id: string) => void
  control: Control<Record<string, unknown>>
  errorMessage?: string
}

const FileInput = ({
  errorMessage,
  shortLabel,
  id,
  label,
  trigger,
  control,
}: FileInputProps) => {
  const [files, setFiles] = useState<File[]>([])
  const controller = useController({
    control,
    name: id,
    defaultValue: [],
    rules: {
      validate: {
        // // fileType: (files) => {
        // //   if (
        // //     (files as File[]).find(
        // //       (file) => !ALLOWED_FILE_TYPES.includes(file.type)
        // //     )
        // //   ) {
        // //     return `Dit bestandstype wordt niet ondersteund. Toegestaan zijn: ${ALLOWED_EXTENSIONS.join(
        // //       ', '
        // //     )}`
        // //   }
        // },
        numberOfFiles: (files) => {
          if ((files as File[]).length > MAX_NUMBER_OF_FILES)
            return `U kunt maximaal ${MAX_NUMBER_OF_FILES} bestanden uploaden`
        },
        minFileSize: (files) =>
          (files as File[]).find((file) => file.size < MIN) &&
          `Dit bestand is te klein. De minimale bestandsgrootte is ${fileSize(
            MIN
          )}.`,
        maxFileSize: (files) =>
          (files as File[]).find((file) => file.size > MAX) &&
          `Dit bestand is te groot. De maximale bestandsgrootte is ${fileSize(
            MAX
          )}.`,
      },
    },
  })

  const handleChange = useCallback(
    (files: File[]) => {
      controller.field.onChange(files)
      setFiles(files)
      trigger(id)
    },
    [controller.field, id, trigger]
  )

  return (
    <FileInputComponent
      name={id}
      label={shortLabel}
      helpText={label}
      errorMessages={errorMessage ? [errorMessage] : []}
      onChange={handleChange}
      files={files}
    />
  )
}

export default FileInput
