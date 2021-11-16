// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2021 Gemeente Amsterdam
import type { FunctionComponent } from 'react'
import { Fragment } from 'react'
import styled from 'styled-components'
import { themeSpacing, themeColor } from '@amsterdam/asc-ui'
import Label from 'components/Label'
import ErrorMessage, { ErrorWrapper } from 'components/ErrorMessage'
import type {
  ReactiveFormMeta,
  FormMeta,
  FormOptions,
} from 'types/reactive-form'

const StyledErrorWrapper = styled(ErrorWrapper)<{ invalid: boolean }>`
  display: flex;
  flex-direction: column;

  & > :last-child:not(& > :first-child) {
    margin-top: ${themeSpacing(3)};
  }
`

const StyledLabel = styled(Label)`
  width: 100%;
  margin-bottom: 0;
  line-height: ${themeSpacing(6)};
`

const FieldSet = styled.fieldset`
  border: 0;
  padding: 0;
  margin-bottom: 0;

  & > :last-child {
    margin-top: ${themeSpacing(3)};
  }
`

const Optional = styled.span`
  font-weight: 400;
  margin-left: ${themeSpacing(2)};
`

const SubTitle = styled.p`
  color: ${themeColor('tint', 'level5')};
  margin-top: 0;
  margin-bottom: 0;
  line-height: ${themeSpacing(6)};
`

type PickedProps = 'touched' | 'hasError' | 'getError'
export interface FormFieldProps extends Pick<ReactiveFormMeta, PickedProps> {
  className?: string
  meta: FormMeta
  options?: FormOptions
  isFieldSet?: boolean
}

const FormField: FunctionComponent<FormFieldProps> = ({
  isFieldSet,
  className,
  meta,
  options,
  touched,
  hasError,
  getError,
  children,
}) => {
  const containsErrors: boolean =
    touched &&
    (hasError('required') ||
      hasError('email') ||
      hasError('maxLength') ||
      hasError('custom'))
  const isOptional = !options?.validators?.some(
    (validator) => validator.name === 'required'
  )
  const FieldSetWrapper = isFieldSet ? FieldSet : Fragment

  return (
    <StyledErrorWrapper className={className} invalid={containsErrors}>
      <FieldSetWrapper>
        {meta?.label && (
          <StyledLabel
            {...(isFieldSet ? { as: 'legend' } : { htmlFor: meta.name })}
          >
            <Fragment>
              {meta.label}
              {isOptional && <Optional>(niet verplicht)</Optional>}
            </Fragment>
          </StyledLabel>
        )}

        {meta?.subtitle && (
          <SubTitle id={`subtitle-${meta.name}`}>{meta.subtitle}</SubTitle>
        )}

        {touched && containsErrors && (
          <Fragment>
            {hasError('required') && (
              <ErrorMessage
                data-testid={`${meta.name}-required`}
                message={
                  getError('required') === true
                    ? 'Dit is een verplicht veld'
                    : (getError('required') as string)
                }
              />
            )}

            {hasError('email') && (
              <ErrorMessage
                data-testid="invalid-mail"
                message="Vul een geldig e-mailadres in, met een @ en een domeinnaam. Bijvoorbeeld: naam@domein.nl"
              />
            )}

            {hasError('maxLength') && (
              <ErrorMessage
                message={`U heeft meer dan de maximale ${String(
                  (getError('maxLength') as { requiredLength: number })
                    .requiredLength
                )} tekens ingevoerd`}
              />
            )}

            {hasError('custom') && (
              <ErrorMessage message={getError('custom') as string} />
            )}
          </Fragment>
        )}

        {children}
      </FieldSetWrapper>
    </StyledErrorWrapper>
  )
}

export default FormField
