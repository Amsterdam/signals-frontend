import FileInputComponent from 'components/FileInput'
import { FunctionComponent, useCallback } from 'react'
import { useController } from 'react-hook-form'
import fileSize from 'signals/incident/services/file-size'
import { FieldProps } from '../../types'

const MIN = 30 * 2 ** 10 // 30 KiB
const MAX = 8 * 2 ** 20 // 8 MiB
const MAX_NUMBER_OF_FILES = 3

const FileInput: FunctionComponent<FieldProps> = ({
  errorMessage,
  id,
  label,
  trigger,
  control,
}) => {
  const controller = useController({
    control,
    name: id,
    defaultValue: null,
    rules: {
      validate: {
        minFileSize: (fileList: FileList) =>
          Array.from(fileList).find((file) => file.size < MIN) &&
          `Dit bestand is te klein. De minimale bestandgrootte is ${fileSize(
            MIN
          )}.`,
        maxFileSize: (fileList: FileList) =>
          Array.from(fileList).find((file) => file.size > MAX) &&
          `Dit bestand is te groot. De minimale bestandgrootte is ${fileSize(
            MAX
          )}.`,
        numberOfFiles: (fileList: FileList) => {
          if (fileList.length > MAX_NUMBER_OF_FILES)
            return `U kunt maximaal ${MAX_NUMBER_OF_FILES} bestanden uploaden`
        },
      },
    },
  })

  const handleChange = useCallback(
    (files: File[]) => {
      controller.field.onChange(files)
      trigger(id)
    },
    [controller.field, id, trigger]
  )

  return (
    <FileInputComponent
      onChange={handleChange}
      name={id}
      errorMessage={errorMessage}
      helpText="Voeg een foto toe om de situatie te verduidelijken."
      label={label}
    />
  )
}

export default FileInput
