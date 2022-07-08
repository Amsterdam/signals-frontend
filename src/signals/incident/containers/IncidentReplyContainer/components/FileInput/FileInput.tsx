// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 - 2022 Gemeente Amsterdam
import FileInputComponent from 'components/FileInput'
import type { FunctionComponent } from 'react'
import { useCallback, useState } from 'react'
import { useController } from 'react-hook-form'
import fileSize from 'signals/incident/services/file-size'
import type { FieldProps } from '../../types'

const MIN = 30 * 2 ** 10 // 30 KiB
const MAX = 20 * 2 ** 20 // 20 MiB
const MAX_NUMBER_OF_FILES = 3
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif']
const ALLOWED_EXTENSIONS = ALLOWED_FILE_TYPES.map((type) => type.split('/')[1])

const FileInput: FunctionComponent<FieldProps> = ({
  errorMessage,
  id,
  label,
  trigger,
  control,
}) => {
  const [files, setFiles] = useState<File[]>([])
  const controller = useController({
    control,
    name: id,
    defaultValue: [],
    rules: {
      validate: {
        fileType: (files) => {
          if (
            (files as File[]).find(
              (file) => !ALLOWED_FILE_TYPES.includes(file.type)
            )
          ) {
            return `Dit bestandstype wordt niet ondersteund. Toegestaan zijn: ${ALLOWED_EXTENSIONS.join(
              ', '
            )}`
          }
        },
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
      label={label}
      helpText="Voeg een foto toe om de situatie te verduidelijken."
      errorMessages={errorMessage ? [errorMessage] : []}
      onChange={handleChange}
      files={files}
    />
  )
}

export default FileInput
