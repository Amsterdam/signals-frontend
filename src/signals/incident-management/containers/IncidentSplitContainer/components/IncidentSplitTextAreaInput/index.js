import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import Label from 'components/Label';
import TextArea from 'components/TextArea';

const IncidentSplitTextAreaInput = ({ id, display, register, name, rows = 7 }) => (
  <Fragment>
    <Label inline htmlFor={id}>
      {display}
    </Label>
    <TextArea data-testid={id} name={name} id={id} ref={register} rows={rows} />
  </Fragment>
);

IncidentSplitTextAreaInput.propTypes = {
  id: PropTypes.string.isRequired,
  display: PropTypes.node.isRequired,
  name: PropTypes.string.isRequired,
  register: PropTypes.func.isRequired,
  rows: PropTypes.number,
};

export default IncidentSplitTextAreaInput;
