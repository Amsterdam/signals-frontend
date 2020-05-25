import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import Label from 'components/Label';
import SelectInputComponent from 'components/SelectInput';

import { themeSpacing, themeColor, Paragraph } from '@datapunt/asc-ui';

const Wrapper = styled.div`
  width: 100%;
  margin-bottom: ${themeSpacing(5)};
`;

const Info = styled(Paragraph)`
  margin-top: ${themeSpacing(1)};
  color: ${themeColor('tint', 'level5')};
`;

export const SelectInput = ({ name, display, values, useSlug, emptyOptionText }) => {
  const options = values.map(({ key, value, slug }) => ({
    key: useSlug ? slug : key,
    name: key ? value : emptyOptionText || value,
    value: useSlug ? slug : key,
  }));

  const render = ({ handler }) => {
    const value = handler()?.value;
    const { description } = (value && values.find(p => p && p.description === value)) || {};

    return (
      <Wrapper>
        {display && <Label htmlFor={`form${name}`}>{display}</Label>}

        <SelectInputComponent name={name} data-testid={name} id={`form${name}`} {...handler()} options={options}/>

        {description && <Info>{description}</Info>}
      </Wrapper>
    );
  };

  render.defaultProps = {
    touched: false,
    size: 10,
  };

  render.propTypes = {
    handler: PropTypes.func.isRequired,
    size: PropTypes.number,
    touched: PropTypes.bool,
  };
  return render;
};

export default SelectInput;
