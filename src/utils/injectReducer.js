import React from 'react';
import PropTypes from 'prop-types';
import hoistNonReactStatics from 'hoist-non-react-statics';
import isArray from 'lodash/isArray';

import getInjectors from './reducerInjectors';

/**
 * Dynamically injects a reducer
 *
 * @param {string} key A key of the reducer
 * @param {function} reducer A reducer that will be injected
 *
 */
export default (descriptors) => (WrappedComponent) => {
  const reducerDescriptorsArray = isArray(descriptors) ? descriptors : [{
    key: descriptors.key,
    reducer: descriptors.reducer
  }];

  class ReducerInjector extends React.Component {
    static WrappedComponent = WrappedComponent;
    static displayName = `withReducer(${(WrappedComponent.displayName || WrappedComponent.name || 'Component')})`;
    static contextTypes = {
      store: PropTypes.object.isRequired,
    };

    componentWillMount() {
      const { injectReducer } = this.injectors;

      reducerDescriptorsArray.forEach(({ key, reducer }) => {
        injectReducer(key, reducer);
      });
    }

    injectors = getInjectors(this.context.store);

    render() {
      return <WrappedComponent {...this.props} />;
    }
  }

  return hoistNonReactStatics(ReducerInjector, WrappedComponent);
};
