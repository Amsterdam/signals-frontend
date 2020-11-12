import React from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import { themeSpacing, themeColor } from '@amsterdam/asc-ui';

const LabelWrapper = styled.div`
  ${({ isGroupHeader }) => !isGroupHeader &&
    css`
      display: inline-block;
    `}
`;

const StyledLabel = styled.label`
  font-family: Avenir Next LT W01${({ inline }) => inline ? '-Regular' : ' Demi'}, arial, sans-serif;
  font-size: 16px;
  margin-bottom: ${themeSpacing(2)};
  display: inline-block;
  vertical-align: text-top;
  color: inherit;

  ${({ isGroupHeader }) =>
    isGroupHeader &&
    css`
    font-size: 18px;
    color: ${themeColor('secondary')};
  `}
`;

const Label = ({
  className, htmlFor, as, ...rest
}) => (
  <LabelWrapper className={`Label ${className}`}>
    <StyledLabel htmlFor={htmlFor} as={as} {...rest} />
  </LabelWrapper>
);

Label.defaultProps = {
  as: 'label',
  className: '',
  inline: false,
  isGroupHeader: false,
};

Label.propTypes = {
  /** HTMLElement render identifier. Allows rendering the Label component as a 'span' or other element */
  as: PropTypes.string,
  className: PropTypes.string,
  /** `for` Attribute that is required whenever `as` is undefined or has a value of `label`. In all other cases not required. */
  htmlFor: (props, propName, componentName) => {
    const as = props.as;
    const value = props[propName];

    if ((!as || as === 'label') && !value) {
      return new TypeError(
        `Failed prop type: The prop \`${propName}\` is marked as required in \`${componentName}\`, but its value is \`${value}\`.`
      );
    }

    return null;
  },
  /** When true, will render the label with a plain font instead of a bold font */
  inline: PropTypes.bool,
  /** When false, the Label component will render as an inline-block element without the red header colour */
  isGroupHeader: PropTypes.bool,
};

export default Label;
