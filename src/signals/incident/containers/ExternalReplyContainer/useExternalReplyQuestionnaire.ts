// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 Vereniging van Nederlandse Gemeenten
import { useEffect, useMemo, useState } from 'react'

import { useDispatch } from 'react-redux'

import type { Attachment } from 'components/AttachmentViewer/AttachmentViewer'
import { showGlobalNotification } from 'containers/App/actions'
import { VARIANT_ERROR, TYPE_LOCAL } from 'containers/Notification/constants'
import { useFetch } from 'hooks'
import { useBuildGetter } from 'hooks/api/useBuildGetter'
import type { FetchError } from 'hooks/useFetch'
import configuration from 'shared/services/configuration/configuration'
import { FieldType } from 'types/api/qa/question'
import type { Session } from 'types/api/qa/session'

import * as constants from './constants'
import type { FormAnswer } from './types'

/**
 * Get error message after get questionnaire request failed
 */
const getQuestionnaireErrorMessage = (
  detail = ''
): {
  title: string
  content: string
} => {
  if (detail === constants.EXPIRED) {
    return {
      title: constants.INACCESSIBLE_TITLE,
      content: constants.INACCESSIBLE_CONTENT,
    }
  } else if (detail === constants.SUBMITTED_PREVIOUSLY) {
    return {
      title: constants.SUBMITTED_PREVIOUSLY_TITLE,
      content: constants.SUBMITTED_PREVIOUSLY_CONTENT,
    }
  }

  return {
    title: constants.GENERIC_ERROR_TITLE,
    content: constants.GENERIC_ERROR_CONTENT,
  }
}

/**
 * Get FormData object with attachment files appended as answer to a questionnaire question
 * @param attachmentsToUpload attachments to upload
 */
const getAttachmentsAsFormData = (attachmentsToUpload: FormAnswer) => {
  const formData = new FormData()
  const files = attachmentsToUpload.value as FileList
  Array.from(files).map((file) => {
    formData.append('file', file)
  })

  formData.append('question_uuid', attachmentsToUpload.uuid)

  return formData
}

const useExternalReplyQuestionnaire = (id: string) => {
  const dispatch = useDispatch()
  const [isSubmittingForm, setIsSubmittingForm] = useState(false)
  const [submitFormError, setSubmitFormError] = useState(false)

  const {
    get: getQuestionnaire,
    error: getQuestionnaireError,
    isLoading: isFetchingQuestionnaire,
    data: questionnaireData,
  } = useBuildGetter<Session>((id: string) => [
    `${configuration.QA_SESSIONS_ENDPOINT}${id}`,
  ])

  const { post: postAnswers, error: postAnswerError } = useFetch()

  const {
    post: submitQuestionnaire,
    isSuccess: questionnaireIsSubmitted,
    error: submitQuestionnaireError,
  } = useFetch()

  useEffect(() => {
    getQuestionnaire(id)
  }, [getQuestionnaire, id])

  const questionnaireErrorMessage = useMemo(() => {
    if (!getQuestionnaireError) return null

    const detail: string | undefined = (getQuestionnaireError as FetchError)
      ?.detail

    return getQuestionnaireErrorMessage(detail)
  }, [getQuestionnaireError])

  const failedToSubmitQuestionnaire =
    postAnswerError || submitQuestionnaireError || submitFormError
  const submitQuestionnaireSuccessMessage = questionnaireIsSubmitted
    ? {
        title: constants.SUBMITTED_TITLE,
        content: constants.SUBMITTED_CONTENT,
      }
    : null

  /**
   * Submit the questionnaire:
   *  - Submit the attachments if any were added
   *  - Submit the answers to plain text questions
   *  - Submit the questionnaire
   *
   * @param answers Answers to questionnaire questions
   */
  const submit = async (answers: FormAnswer[]): Promise<void> => {
    try {
      if (!questionnaireData) throw 'Cannot submit questionnaire'

      setSubmitFormError(false)
      setIsSubmittingForm(true)

      // Filter answers where attachments have been added
      const answersWithAttachments = answers.filter(
        (answer) =>
          answer.fieldType === FieldType.FileInput &&
          (answer.value as FileList).length > 0
      )

      // Submit the attachments
      if (answersWithAttachments.length > 0) {
        answersWithAttachments.forEach(async (answer) => {
          const formData = getAttachmentsAsFormData(answer)
          const response = await fetch(
            questionnaireData._links['sia:post-attachments'].href,
            {
              body: formData,
              method: 'POST',
            }
          )

          if (!response.ok) {
            throw new Error('Failed to upload attachments')
          }
        })
      }

      // Submit the plain text answers
      const plainTextQuestions = answers.filter(
        (answer) =>
          answer.fieldType === FieldType.PlainText &&
          Boolean(answer.value as string)
      )
      await postAnswers(
        questionnaireData._links['sia:post-answers'].href,
        plainTextQuestions.map((answer) => ({
          payload: answer.value as string,
          question_uuid: answer.uuid,
        }))
      )

      // Submit the questionnaire
      await submitQuestionnaire(
        questionnaireData._links['sia:post-submit'].href
      )
    } catch (error) {
      setSubmitFormError(true)
    } finally {
      setIsSubmittingForm(false)
    }
  }

  // Show an error message when submitting the questionnaire failed
  useEffect(() => {
    if (failedToSubmitQuestionnaire) {
      dispatch(
        showGlobalNotification({
          title: constants.GENERIC_ERROR_TITLE,
          message: constants.GENERIC_ERROR_CONTENT,
          variant: VARIANT_ERROR,
          type: TYPE_LOCAL,
        })
      )
    }
  }, [dispatch, failedToSubmitQuestionnaire])

  const attachments =
    questionnaireData?.questionnaire_explanation.sections.reduce(
      (previous, current) => [
        ...previous,
        ...current.files.map(({ file }) => ({
          location: file,
        })),
      ],
      [] as Attachment[]
    ) || []

  return {
    isFetchingQuestionnaire,
    isSubmittingForm,
    attachments,
    questionnaireErrorMessage,
    submitQuestionnaireSuccessMessage,
    location: questionnaireData?.location,
    explanation: questionnaireData?.questionnaire_explanation,
    questions: questionnaireData?.path_questions,
    submit,
  }
}

export default useExternalReplyQuestionnaire
