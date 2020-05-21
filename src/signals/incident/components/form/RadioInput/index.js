import React, { useCallback } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { Radio, Label } from '@datapunt/asc-ui';

import { resetExtraState, updateIncident } from 'signals/incident/containers/IncidentContainer/actions';

const StyledLabel = styled(Label)`
  & > * {
    font-family: AvenirNextLTW01-Regular, arial, sans-serif;
  }
`;

const RadioInput = ({ checked, id, idAttr, label, info, name, resetsStateOnChange }) => {
  const dispatch = useDispatch();

  const onChange = useCallback(() => {
    if (resetsStateOnChange) {
      dispatch(resetExtraState());
    }

    dispatch(
      updateIncident({
        [name]: {
          id,
          label,
          info,
        },
      })
    );
  }, [dispatch, id, info, label, name, resetsStateOnChange]);

  return (
    <StyledLabel htmlFor={idAttr} label={label}>
      <Radio
        checked={checked}
        data-testid="inputUsingDispatch"
        id={idAttr}
        onChange={onChange}
        type="radio"
      />
    </StyledLabel>
  );
};

RadioInput.defaultProps = {
  checked: false,
  info: '',
  resetsStateOnChange: false,
};

RadioInput.propTypes = {
  checked: PropTypes.bool,
  id: PropTypes.string.isRequired,
  idAttr: PropTypes.string.isRequired,
  info: PropTypes.string,
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  resetsStateOnChange: PropTypes.bool,
};

export default RadioInput;
