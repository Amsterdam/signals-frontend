// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2019 - 2023 Gemeente Amsterdam
import { useEffect, useRef } from 'react'
import type {
  BaseSyntheticEvent,
  ChangeEvent,
  Dispatch,
  SetStateAction,
} from 'react'

import { Heading } from '@amsterdam/asc-ui'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm, FormProvider } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import * as yup from 'yup'

import Button from 'components/Button'
import Checkbox from 'components/Checkbox'
import CheckboxList from 'components/CheckboxList'
import FormField from 'components/FormField'
import GlobalError from 'components/GlobalError'
import RadioButtonList from 'components/RadioButtonList'
import configuration from 'shared/services/configuration/configuration'
import { filesUpload } from 'shared/services/files-upload/files-upload'
import FileInput from 'signals/incident/components/form/FileInput'
import { updateIncident } from 'signals/incident/containers/IncidentContainer/actions'

import {
  Form,
  GridArea,
  FieldSet,
  StyledLabel,
  CheckboxWrapper,
  Optional,
  HelpText,
  StyledTextArea,
} from './styled'
import { makeSelectIncidentContainer } from '../../../IncidentContainer/selectors'
import type { FeedbackFormData, OptionMapped } from '../../types'

interface Props {
  contactAllowed: boolean
  dataFeedbackForms: FeedbackFormData
  isSatisfied: boolean
  onSubmit: (formData: Omit<FormData, 'text_list_extra'>) => void
  options: OptionMapped[]
  setContactAllowed: Dispatch<SetStateAction<boolean>>
}

interface FormData {
  allows_contact: boolean
  is_satisfied: boolean
  text_list: string[]
  text_list_extra: string
  text_extra: string
}

interface FileInputPayload {
  images: File[]
  images_previews: string[]
}

const KtoForm = ({
  contactAllowed,
  dataFeedbackForms,
  isSatisfied,
  onSubmit,
  options,
  setContactAllowed,
}: Props) => {
  const formRef = useRef<HTMLFormElement>(null)
  const { satisfactionIndication } = useParams()
  const dispatchRedux = useDispatch()

  const { incident } = useSelector(makeSelectIncidentContainer)
  const extraTextMaxLength = 1000

  const negativeContactEnabled =
    configuration.featureFlags.reporterMailHandledNegativeContactEnabled

  const schema = yup
    .object({
      allows_contact: yup.boolean().required(),
      is_satisfied: yup.boolean().required(),
      text_list: yup
        .array()
        .min(1, 'Dit veld is verplicht')
        .required('Dit veld is verplicht'),
      text_list_extra: yup.string().when('text_list', (text_list, schema) => {
        return (Array.isArray(text_list) ? text_list : [text_list]).includes(
          options.slice(-1)[0].value
        )
          ? schema.required('Dit veld is verplicht')
          : schema
      }),
      text_extra: yup.string(),
    })
    .required()

  const formMethods = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      allows_contact: contactAllowed,
      is_satisfied: isSatisfied,
      text_list: [],
      text_list_extra: '',
      text_extra: '',
    },
  })

  const {
    setValue,
    watch,
    trigger,
    getValues,
    formState: { errors },
  } = formMethods

  async function handleSubmit(e: BaseSyntheticEvent) {
    e.preventDefault()
    // Trigger form validation
    const isValid = await trigger()

    if (isValid) {
      if (incident.images.length > 0) {
        await filesUpload({
          url: `${configuration.INCIDENT_PUBLIC_ENDPOINT}${dataFeedbackForms.signal_id}/attachments/`,
          files: incident.images,
        })
      }
      const allFormData = getValues()

      allFormData.text_list = [
        ...allFormData.text_list,
        allFormData.text_list_extra,
      ].filter(Boolean)

      // eslint-disable-next-line no-unused-vars
      const { text_list_extra, ...formData } = allFormData

      onSubmit(formData)
    } else {
      const invalidElement = formRef.current?.querySelector(
        '[class^=ErrorMessage]'
      )
      invalidElement?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const watchTextList = watch('text_list')
  const watchTextExtra = watch('text_extra')

  useEffect(() => {
    if (!watchTextList.includes('Over iets anders')) {
      setValue('text_list_extra', '')
    }
  }, [setValue, watchTextList])

  return (
    <FormProvider {...formMethods}>
      <FieldSet>
        <GlobalError />
        <Form ref={formRef} data-testid="kto-form" onSubmit={handleSubmit}>
          <GridArea>
            <FormField
              meta={{
                label: ` Waarom bent u ${!isSatisfied ? 'on' : ''}tevreden?`,
                name: 'input',
                subtitle: configuration.featureFlags.enableMultipleKtoAnswers
                  ? 'U kunt meer keuzes maken'
                  : 'Kies één van de onderstaande antwoorden',
              }}
              hasError={(errorType) => errors['text_list']?.type === errorType}
              getError={(errorType) => errors['text_list']?.type === errorType}
              options={{ validators: ['min'] }}
            >
              {configuration.featureFlags.enableMultipleKtoAnswers ? (
                <CheckboxList<OptionMapped>
                  aria-describedby="subtitle-kto"
                  options={options}
                  name={'input'}
                  onChange={(_groupName, options: OptionMapped[]) => {
                    setValue(
                      'text_list',
                      options.map((option) => option.value)
                    )
                    trigger('text_list')
                    if (
                      !getValues().text_list?.includes(
                        options.slice(-1)[0]?.value
                      )
                    ) {
                      trigger('text_list_extra')
                    }
                  }}
                />
              ) : (
                <RadioButtonList<OptionMapped>
                  aria-describedby="subtitle-kto"
                  error={false}
                  groupName="kto"
                  hasEmptySelectionButton={false}
                  onChange={(_groupName, option: OptionMapped) => {
                    setValue('text_list', [option.value])
                    trigger('text_list')
                  }}
                  options={options}
                />
              )}
            </FormField>

            {watchTextList?.includes(options.slice(-1)[0].value) && (
              <FormField
                meta={{
                  label: ``,
                  name: 'text',
                  subtitle: '',
                }}
                hasError={(errorType) =>
                  errors['text_list_extra']?.type === errorType
                }
                getError={(errorType) =>
                  errors['text_list_extra']?.type === errorType
                }
              >
                <StyledTextArea
                  data-testid="kto-text"
                  maxRows={5}
                  name="text"
                  onChange={(event) => {
                    setValue('text_list_extra', event.target.value)
                    trigger('text_list_extra')
                  }}
                  rows={2}
                />
              </FormField>
            )}
          </GridArea>

          {satisfactionIndication === 'nee' && (
            <GridArea>
              <StyledLabel htmlFor="text_extra">
                {"Foto's toevoegen? "}
                <Optional>(niet verplicht)</Optional>
              </StyledLabel>
              <HelpText id="subtitle-kto">
                Voeg een foto toe om de situatie te verduidelijken.
              </HelpText>
              <FileInput
                handler={() => ({ value: incident.images })}
                parent={{
                  meta: {
                    updateIncident: (payload: FileInputPayload) =>
                      dispatchRedux(updateIncident(payload)),
                  },
                }}
                meta={{
                  name: 'images',
                  label: "Foto's toevoegen",
                  subtitle:
                    'Voeg een foto toe om de situatie te verduidelijken',
                  minFileSize: 30 * 2 ** 10, // 30 KiB.
                  maxFileSize: 20 * 2 ** 20, // 20 MiB.
                  allowedFileTypes: [
                    'image/jpeg',
                    'image/jpg',
                    'image/png',
                    'image/gif',
                  ],
                  maxNumberOfFiles: 3,
                }}
              />
            </GridArea>
          )}

          <GridArea>
            <StyledLabel htmlFor="text_extra">
              Wilt u verder nog iets vermelden of toelichten?{' '}
              <Optional>(niet verplicht)</Optional>
            </StyledLabel>
            <StyledTextArea
              id="text_extra"
              data-testid="kto-text-extra"
              infoText={`${watchTextExtra?.length}/${extraTextMaxLength} tekens`}
              maxLength={extraTextMaxLength}
              name="text_extra"
              onChange={(event) => setValue('text_extra', event.target.value)}
            />
          </GridArea>

          {!isSatisfied && (
            <GridArea>
              {negativeContactEnabled ? (
                <>
                  <Heading forwardedAs="h2">Contact</Heading>
                  <p
                    id="subtitle-allows-contact"
                    data-testid="subtitle-allows-contact"
                  >
                    Uw reactie is belangrijk voor ons. Wij laten u graag weten
                    wat wij ermee doen. En misschien willen wij u nog iets
                    vragen of vertellen. Wij bellen u dan of sturen een e-mail.{' '}
                  </p>
                </>
              ) : (
                <StyledLabel id="subtitle-allows-contact">
                  Mogen wij contact met u opnemen naar aanleiding van uw
                  feedback? <Optional>(niet verplicht)</Optional>
                </StyledLabel>
              )}

              <CheckboxWrapper
                inline
                htmlFor="allows-contact"
                data-testid="allows-contact"
              >
                <Checkbox
                  data-testid="kto-allows-contact"
                  id="allows-contact"
                  aria-describedby="subtitle-allows-contact"
                  name="allows-contact"
                  onChange={(event: ChangeEvent<HTMLInputElement>) => {
                    let checked = event.target.checked

                    if (negativeContactEnabled) {
                      checked = !checked
                    }
                    setValue('allows_contact', checked)
                    setContactAllowed(checked)
                  }}
                />

                {negativeContactEnabled
                  ? 'Nee, bel of e-mail mij niet meer over deze melding of over mijn reactie.'
                  : 'Ja'}
              </CheckboxWrapper>
            </GridArea>
          )}

          <GridArea>
            <Button data-testid="kto-submit" type="submit" variant="secondary">
              Verstuur
            </Button>
          </GridArea>
        </Form>
      </FieldSet>
    </FormProvider>
  )
}

export default KtoForm
