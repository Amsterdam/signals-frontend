// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2021 Gemeente Amsterdam
import type { FunctionComponent } from 'react'
import React, { Fragment } from 'react'
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
  margin-bottom: 0;
  line-height: ${themeSpacing(6)};
`

const Optional = styled.span`
  font-family: Avenir Next LT W01-Regular, arial, sans-serif;
  margin-left: ${themeSpacing(2)};
`

const SubTitle = styled.p`
  color: ${themeColor('tint', 'level5')};
  margin-top: 0;
  margin-bottom: 0;
  line-height: ${themeSpacing(6)};
`

type PickedProps = 'touched' | 'hasError' | 'getError'
export interface HeaderProps extends Pick<ReactiveFormMeta, PickedProps> {
  className?: string
  meta: FormMeta
  options?: FormOptions
}

const Header: FunctionComponent<HeaderProps> = ({
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

  return (
    <StyledErrorWrapper className={className} invalid={containsErrors}>
      {meta?.label && (
        <StyledLabel htmlFor={meta.name}>
          {meta.label}

          {isOptional && <Optional>(niet verplicht)</Optional>}
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
    </StyledErrorWrapper>
  )
}

export default Header
