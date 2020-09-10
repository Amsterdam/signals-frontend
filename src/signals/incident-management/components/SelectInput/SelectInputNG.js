import React from 'react';
import styled from 'styled-components';
// import PropTypes from 'prop-types';

import SelectInputComponent from 'components/SelectInput';

const Wrapper = styled.div`
  width: 100%;
`;

export const SelectInputNG = ({ name, value, onChange, display, values, useSlug, emptyOptionText }) => {
  const options = values.map(({ key, value, slug }) => ({
    key: useSlug ? slug : key,
    name: key ? value : emptyOptionText || value,
    value: useSlug ? slug : key,
  }));

  return (
    <Wrapper>
      <SelectInputComponent
        label={<strong>{display}</strong>}
        name={name}
        data-testid={name}
        id={`form${name}`}
        onChange={onChange}
        options={options}
        value={value}
      />
    </Wrapper>
  );
};

// SelectInputNG.defaultProps = {
//   touched: false,
//   size: 10,
// };
//
// SelectInputNG.propTypes = {
//   // onChange: PropTypes.func.isRequired,
//   size: PropTypes.number,
//   touched: PropTypes.bool,
// };

export default SelectInputNG;
