// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2021 Gemeente Amsterdam
import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import Select from 'components/Select';

const Wrapper = styled.div`
  width: 100%;
`;

export const SelectInput = ({ name: inputName, display, values, groups, emptyOption }) => {
  const options = values.map(({ key, value, group }) => ({
    key: key || '',
    name: value,
    value: key || '',
    group,
  }));

  const render = ({ handler }) => (
    <Wrapper>
      <Select
        id={inputName}
        label={<strong>{display}</strong>}
        name={inputName}
        {...handler()}
        options={options}
        groups={groups}
        emptyOption={emptyOption}
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
