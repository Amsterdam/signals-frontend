import React from 'react';
import PropTypes from 'prop-types';

export const HiddenInput = props => {
  const { name } = props;
  const render = ({ handler }) => (
    <div className="hidden-input">
      <input id={`form${name}`} type="hidden" {...handler()} />
    </div>
  );

  render.propTypes = {
    handler: PropTypes.func.isRequired,
  };
  return render;
};

export default HiddenInput;
