import type { FunctionComponent } from 'react';
import React, { Fragment } from 'react';
import styled, { css } from 'styled-components';
import { themeSpacing, themeColor } from '@amsterdam/asc-ui';
import Label from 'components/Label';
import type { ReactiveFormMeta, FormMeta, FormOptions } from 'types/reactive-form';

const Wrapper = styled.div<{ global: boolean; invalid: boolean }>`
  display: flex;
  flex-direction: column;

  ${({ global, invalid }) =>
    (global &&
      invalid &&
      css`
        border: ${themeColor('support', 'invalid')} 2px solid;
        padding: ${themeSpacing(3)};
      `) ||
    (invalid &&
      css`
        border-left: ${themeColor('support', 'invalid')} 2px solid;
        padding-left: ${themeSpacing(3)};
      `)}

  & > :last-child:not(& > :first-child) {
    margin-top: ${themeSpacing(3)};
  }
`;

const StyledLabel = styled(Label)`
  margin-bottom: 0;
  line-height: ${themeSpacing(6)};
`;

const Optional = styled.span`
  font-family: Avenir Next LT W01-Regular, arial, sans-serif;
  margin-left: ${themeSpacing(2)};
`;

const ErrorItem = styled.p`
  font-family: Avenir Next LT W01 Demi, arial, sans-serif;
  margin-top: 0;
  margin-bottom: 0;
  color: ${themeColor('support', 'invalid')};
  line-height: ${themeSpacing(6)};
`;

const SubTitle = styled.p`
  color: ${themeColor('tint', 'level5')};
  margin-top: 0;
  margin-bottom: 0;
  line-height: ${themeSpacing(6)};
`;

type PickedProps = 'touched' | 'hasError' | 'getError';
export interface HeaderProps extends Pick<ReactiveFormMeta, PickedProps> {
  className?: string;
  meta: FormMeta;
  options?: FormOptions;
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
    (hasError('required') || hasError('email') || hasError('maxLength') || hasError('custom') || hasError('global'));
  const isOptional = !options?.validators?.some(validator => validator.name === 'required');

  return (
    <Wrapper className={className} invalid={containsErrors} global={hasError('global')}>
      {meta.label && (
        <StyledLabel htmlFor={meta.name}>
          {meta.label}

          {isOptional && <Optional>(optioneel)</Optional>}
        </StyledLabel>
      )}

      {meta.subtitle && <SubTitle id={`subtitle-${meta.name}`}>{meta.subtitle}</SubTitle>}

      {touched && containsErrors && (
        <Fragment>
          {hasError('global') && (
            <ErrorItem data-testid="invalid-global">
              {getError('global') === true
                ? 'Er zijn vragen niet (of niet juist) ingevuld. Vul de vragen hieronder op de goede manier in.'
                : getError('global')}
            </ErrorItem>
          )}

          {hasError('required') && (
            <ErrorItem data-testid={`${meta.name}-required`}>
              {getError('required') === true ? 'Dit is een verplicht veld' : getError('required')}
            </ErrorItem>
          )}

          {hasError('email') && (
            <ErrorItem data-testid="invalid-mail">
              Vul een geldig e-mailadres in, met een @ en een domeinnaam. Bijvoorbeeld: naam@domein.nl
            </ErrorItem>
          )}

          {hasError('maxLength') && (
            <ErrorItem>
              U heeft meer dan de maximale{' '}
              {String((getError('maxLength') as { requiredLength: number }).requiredLength)} tekens ingevoerd
            </ErrorItem>
          )}

          {hasError('custom') && <ErrorItem>{getError('custom')}</ErrorItem>}
        </Fragment>
      )}

      {children}
    </Wrapper>
  );
};

export default Header;
