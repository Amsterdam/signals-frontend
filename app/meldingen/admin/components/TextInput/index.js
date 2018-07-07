import React from 'react';
import PropTypes from 'prop-types';

import { FieldControl } from 'react-reactive-form';
import './style.scss';

export const TextInput = ({ name, control, ...props }) => (
  <div>
    <FieldControl name={name} control={control} render={TextInputRender(props)} />
  </div>);

TextInput.propTypes = {
  name: PropTypes.string.isRequired,
  control: PropTypes.object.isRequired
};

export const TextInputRender = (props) => {
  const { name, display } = props;
  const render = ({ handler }) => (<div>
    <div className="row mode_input text rij_verplicht">
      <div className="label">
        <label htmlFor={`form${name}`}>{display}</label>
      </div>

      <div className="invoer">
        <input name="" id={`form${name}`} value="" className="input" type="text" {...handler()} />
      </div>

    </div>
  </div>);

  render.defaultProps = {
    touched: false
  };

  render.propTypes = {
    handler: PropTypes.func.isRequired,
  };
  return render;
};

export class TextInputWrapper extends React.Component {
  TextInputRender = (props) => {
    const { name, display, control } = props;
    const renderContent = ({ handler, touched, hasError }) => (<div>
      <div className="row mode_input text rij_verplicht">
        <div className="label">
          <label htmlFor={`form${name}`}>{display}</label>
        </div>

        <div className="invoer">
          <input name="" id={`form${name}`} value="" className="input" type="text" {...handler()} />
        </div>
        <div>
          {touched
            && hasError('required')
            && 'Name is required'}
        </div>

      </div>
    </div>);

    return renderContent(control);
  };

  render() {
    const { name, control } = this.props;
    return (
      <div>
        <FieldControl name={name} control={control} render={TextInputRender} />
      </div>
    );
  }
}

TextInputWrapper.propTypes = {
  name: PropTypes.string.isRequired,
  display: PropTypes.string.isRequired,
  control: PropTypes.shape({
    handler: PropTypes.func.isRequired,
    hasError: PropTypes.func.isRequired,
    touched: PropTypes.boolean,
    pristine: PropTypes.boolean,
  })
};
