// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2021 Gemeente Amsterdam
import { useState, useCallback } from 'react'
import PropTypes from 'prop-types'
import FileInputComponent from 'components/FileInput'
import fileSize from '../../../services/file-size'

const FileInput = ({ handler, parent, meta }) => {
  const [errors, setErrors] = useState()
  const maxNumberOfFiles = (meta && meta.maxNumberOfFiles) || 3
  const checkMinFileSize = useCallback(
    (file) => file.size >= meta.minFileSize,
    [meta]
  )

  const checkMaxFileSize = useCallback(
    (file) => file.size < meta.maxFileSize,
    [meta]
  )

  const checkFileType = useCallback(
    (file) => meta.allowedFileTypes.includes(file.type),
    [meta]
  )

  const checkNumberOfFiles = useCallback(
    (file, index) => index < maxNumberOfFiles,
    [maxNumberOfFiles]
  )

  const getErrorMessages = useCallback(
    (files) => {
      const errorMessages = []

      if (meta.minFileSize && !files.every(checkMinFileSize)) {
        errorMessages.push(
          `Dit bestand is te klein. De minimale bestandgrootte is ${fileSize(
            meta.minFileSize
          )}.`
        )
      }

      if (meta.maxFileSize && !files.every(checkMaxFileSize)) {
        errorMessages.push(
          `Dit bestand is te groot. De maximale bestandgrootte is ${fileSize(
            meta.maxFileSize
          )}.`
        )
      }

      if (meta.allowedFileTypes && !files.every(checkFileType)) {
        errorMessages.push(
          `Dit bestandstype wordt niet ondersteund. Toegestaan zijn: ${meta.allowedFileTypes
            .map((type) => type.replace(/.*\//, ''))
            .join(', ')}.`
        )
      }

      if (!files.every(checkNumberOfFiles)) {
        errorMessages.push(
          `U kunt maximaal ${maxNumberOfFiles} bestanden uploaden.`
        )
      }

      return errorMessages
    },
    [
      meta,
      checkMinFileSize,
      checkMaxFileSize,
      checkFileType,
      checkNumberOfFiles,
      maxNumberOfFiles,
    ]
  )

  const handleChange = useCallback(
    (batchFiles) => {
      const minFileSizeFilter = meta.minFileSize ? checkMinFileSize : () => true
      const maxFileSizeFilter = meta.maxFileSize ? checkMaxFileSize : () => true
      const allowedFileTypesFilter = meta.allowedFileTypes
        ? checkFileType
        : () => true
      const maxNumberOfFilesFilter = checkNumberOfFiles

      const files = batchFiles
        .filter(minFileSizeFilter)
        .filter(maxFileSizeFilter)
        .filter(allowedFileTypesFilter)
        .filter(maxNumberOfFilesFilter)
      setErrors(getErrorMessages(batchFiles))
      parent.meta.updateIncident({
        [meta.name]: files,
        [`${meta.name}_previews`]: files.map((file) =>
          window.URL.createObjectURL(file)
        ),
      })
    },
    [
      checkMinFileSize,
      checkMaxFileSize,
      checkFileType,
      checkNumberOfFiles,
      getErrorMessages,
      meta,
      parent,
    ]
  )

  const files = handler()?.value || []

  return (
    <FileInputComponent
      errorMessages={errors}
      name={meta.name}
      onChange={handleChange}
      files={files}
      maxNumberOfFiles={maxNumberOfFiles}
      maxFileSize={meta.maxFileSize}
      minFileSize={meta.minFileSize}
      allowedFileTypes={meta.allowedFileTypes}
    />
  )
}

FileInput.propTypes = {
  handler: PropTypes.func,
  meta: PropTypes.object,
  parent: PropTypes.object,
}

export default FileInput
