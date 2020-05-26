import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import SelectInputComponent from 'components/SelectInput';

import { themeSpacing } from '@datapunt/asc-ui';

const Wrapper = styled.div`
  width: 100%;
  margin-bottom: ${themeSpacing(5)};
`;

export const SelectInput = ({ name, display, values, useSlug, emptyOptionText }) => {
  const options = values.map(({ key, value, slug }) => ({
    key: useSlug ? slug : key,
    name: key ? value : emptyOptionText || value,
    value: useSlug ? slug : key,
  }));

  const render = ({ handler }) => (
    <Wrapper>
      <SelectInputComponent
        label={<strong>{display}</strong>}
        name={name}
        data-testid={name}
        id={`form${name}`}
        {...handler()}
        options={options}
      />
    </Wrapper>
  );

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
