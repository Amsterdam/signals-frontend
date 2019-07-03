import React from 'react';
import PropTypes from 'prop-types';
import map from 'lodash.map';
import get from 'lodash.get';
import { injectIntl } from 'react-intl';
import isObject from 'lodash.isobject';

import Header from '../Header/';
import flattenObject from '../../../services/object-flatten';

const renderOption = (intl, key, name, value, handler, parent) => {
  const id = `${name}-${key + 1}`;

  // console.log(name, key);
  let label;
  if (typeof value === 'object') {
    const incident = get(parent, 'meta.incident', {});
    const shallowValues = flattenObject(incident, '', ':');
    const descriptor = value;
    label = intl.formatMessage(descriptor, shallowValues);
  } else {
    label = value;
  }

  return (
    <div className="antwoord" key={key}>
      <input
        id={id}
        className="kenmerkradio"
        type="radio"
        checked={handler().value.id === key}
        onClick={() => parent.meta.updateIncident({ [name]: {
            id: key,
            label
          } })}
      />
      <label htmlFor={id}>{label}</label>
    </div>
  );
};

// const RadioInput = ({ handler, touched, hasError, meta={}, parent, getError, validatorsOrOpts, intl}) => {
//   const { className, isVisible, name, values } = meta;
//   return (
//     <div className={`${isVisible ? 'row' : ''}`}>
//       {isVisible ?
//         <div className={`${className || 'col-12'} mode_input`}>
//           <Header
//             meta={meta}
//             options={validatorsOrOpts}
//             touched={touched}
//             hasError={hasError}
//             getError={getError}
//           >
//             <div className="antwoorden">
//               {values && isObject(values) && map(values, (value, key) => (
//                   renderOption(intl, key, name, value, handler, parent)
//               ))}
//             </div>
//           </Header>
//         </div>
//         : ''}
//     </div>
//   );
// };
class RadioInput extends React.Component {
  render() {
    const { handler, touched, hasError, meta={}, parent, getError, validatorsOrOpts } = this.props;
    const { intl } = this.context;
    // console.log('context', this.context);
    // console.log('parent', parent);
    const { className, isVisible, name, values } = meta;
    return (
      <div className={`${isVisible ? 'row' : ''}`}>
        {isVisible ?
          <div className={`${className || 'col-12'} mode_input`}>
            <Header
              meta={meta}
              options={validatorsOrOpts}
              touched={touched}
              hasError={hasError}
              getError={getError}
              parent={parent}
            >
              <div className="antwoorden">
                {values && isObject(values) && map(values, (value, key) => (
                  renderOption(intl, key, name, value, handler, parent)
                ))}
              </div>
            </Header>
          </div>
          : ''}
      </div>
    );
  }
}

const WrappedInput = (props) => {
  const WrappedComponent = injectIntl(RadioInput);
  // return <WrappedComponent {...props} parent={props.parent}/>;
  return <RadioInput {...props} parent={props.parent}/>;
};

RadioInput.propTypes = {
  handler: PropTypes.func,
  touched: PropTypes.bool,
  getError: PropTypes.func.isRequired,
  hasError: PropTypes.func.isRequired,
  meta: PropTypes.object,
  parent: PropTypes.object,
  validatorsOrOpts: PropTypes.object
};
RadioInput.contextTypes = {
  intl: PropTypes.object
};

export default WrappedInput;
