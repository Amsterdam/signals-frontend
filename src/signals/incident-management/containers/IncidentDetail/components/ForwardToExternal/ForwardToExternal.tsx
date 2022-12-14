// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 Vereniging van Nederlandse Gemeenten
import { useRef, useContext, useCallback, useState, useEffect } from 'react'

import { Label } from '@amsterdam/asc-ui'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import * as yup from 'yup'

import { ErrorWrapper } from 'components/ErrorMessage'
import Input from 'components/Input'
import TextArea from 'components/TextArea'
import { showGlobalNotification } from 'containers/App/actions'
import { TYPE_LOCAL, VARIANT_ERROR } from 'containers/Notification/constants'
import { useFetch } from 'hooks'
import configuration from 'shared/services/configuration/configuration'
import { DOORGEZET_NAAR_EXTERN } from 'signals/incident-management/definitions/statusList'

import { PATCH_TYPE_STATUS } from '../../constants'
import IncidentDetailContext from '../../context'
import type { EmailTemplate } from '../../types'
import EmailPreview from '../EmailPreview/EmailPreview'
import {
  Form,
  Image,
  ImageWrapper,
  StyledButton,
  StyledErrorMessage,
  StyledH2,
  StyledParagraph,
  StyledSection,
} from './styled'

export const MAX_MESSAGE_LENGTH = 3000
const schema = yup.object({
  email: yup
    .string()
    .email('Dit is geen geldig e-mail adres.')
    .required(
      'Dit veld is verplicht voor het doorzetten naar een externe partij.'
    ),
  message: yup
    .string()
    .max(
      MAX_MESSAGE_LENGTH,
      `Je hebt meer dan de maximale ${MAX_MESSAGE_LENGTH} tekens ingevoerd.`
    )
    .required(
      'Dit veld is verplicht voor het doorzetten naar een externe partij.'
    ),
})

type Form = {
  email: string
  message: string
}

type ForwardToExternalProps = {
  onClose: () => void
}

const ForwardToExternal = ({ onClose }: ForwardToExternalProps) => {
  const { incident, update, attachments } = useContext(IncidentDetailContext)
  const storeDispatch = useDispatch()
  const formRef = useRef<HTMLFormElement>(null)
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<Form>({
    resolver: yupResolver(schema),
  })

  const [modalEmailPreviewIsOpen, setModalEmailPreviewIsOpen] = useState(false)

  const {
    post: getEmailTemplate,
    data: emailTemplate,
    error: emailTemplateError,
    isLoading: isLoadingEmailTemplate,
  } = useFetch<EmailTemplate>()

  const closeEmailPreview = useCallback(() => {
    setModalEmailPreviewIsOpen(false)
  }, [setModalEmailPreviewIsOpen])

  const handleUpdateStatus = useCallback(() => {
    update({
      type: PATCH_TYPE_STATUS,
      patch: {
        status: {
          state: DOORGEZET_NAAR_EXTERN.key,
          text: getValues('message'),
          send_email: true,
          email_override: getValues('email'),
        },
      },
    })

    closeEmailPreview()
    onClose()
  }, [closeEmailPreview, getValues, onClose, update])

  const handleGetEmailTemplate = useCallback(async () => {
    getEmailTemplate(
      `${configuration.INCIDENTS_ENDPOINT}${incident?.id}/email/preview`,
      {
        status: DOORGEZET_NAAR_EXTERN.key,
        text: getValues('message'),
        email_override: getValues('email'),
      }
    )
    setModalEmailPreviewIsOpen(true)
  }, [getEmailTemplate, getValues, incident?.id])

  // ensure component is in view
  useEffect(() => {
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    }
  }, [formRef])

  useEffect(() => {
    if (emailTemplateError) {
      storeDispatch(
        showGlobalNotification({
          title:
            'Er is geen email template beschikbaar voor de gegeven statustransitie',
          variant: VARIANT_ERROR,
          type: TYPE_LOCAL,
        })
      )
    }
  }, [emailTemplateError, storeDispatch])

  return (
    <Form
      ref={formRef}
      onSubmit={handleSubmit(handleGetEmailTemplate)}
      data-testid="forwardToExternal"
    >
      <StyledH2 forwardedAs="h2">Doorzetten naar externe partij</StyledH2>

      <StyledSection>
        <ErrorWrapper invalid={Boolean(errors.email?.message)}>
          <Label
            htmlFor="externalEmail"
            label={<strong>E-mail behandelaar</strong>}
          />

          {errors.email?.message && (
            <StyledErrorMessage message={errors.email?.message} />
          )}

          <Input
            id="externalEmail"
            {...register('email')}
            placeholder="E-mailadres"
          />
        </ErrorWrapper>
      </StyledSection>

      <StyledSection>
        <ErrorWrapper invalid={Boolean(errors.message?.message)}>
          <Label
            htmlFor="externalEmailMessage"
            label={<strong>Toelichting behandelaar</strong>}
          />

          {errors.message?.message && (
            <StyledErrorMessage message={errors.message?.message} />
          )}

          <TextArea
            id="externalEmailMessage"
            maxContentLength={MAX_MESSAGE_LENGTH}
            rows={12}
            {...register('message')}
          />
        </ErrorWrapper>
      </StyledSection>

      {attachments?.count ? (
        <StyledSection>
          <StyledParagraph strong>Foto&apos;s</StyledParagraph>
          <ImageWrapper>
            {attachments.results.map((attachment) => (
              <Image
                key={attachment.location}
                src={attachment.location}
                alt={attachment._display}
              />
            ))}
          </ImageWrapper>
        </StyledSection>
      ) : null}

      <div>
        <StyledButton
          data-testid="formSubmitButton"
          type="submit"
          variant="secondary"
        >
          Verstuur
        </StyledButton>

        <StyledButton
          data-testid="formCancelButton"
          variant="tertiary"
          onClick={onClose}
        >
          Annuleer
        </StyledButton>
      </div>

      {modalEmailPreviewIsOpen && (
        <EmailPreview
          isLoading={isLoadingEmailTemplate}
          title="Controleer bericht aan behandelaar"
          emailBody={emailTemplate?.html}
          onClose={closeEmailPreview}
          onUpdate={handleUpdateStatus}
        />
      )}
    </Form>
  )
}

export default ForwardToExternal
