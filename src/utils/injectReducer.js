import React from 'react';
import PropTypes from 'prop-types';
import hoistNonReactStatics from 'hoist-non-react-statics';

import getInjectors from './reducerInjectors';

/**
 * Dynamically injects a reducer
 *
 * @param {string} key A key of the reducer
 * @param {function} reducer A reducer that will be injected
 *
 */
export default ({ key, reducer }) => WrappedComponent => {
  class ReducerInjector extends React.Component {
    static WrappedComponent = WrappedComponent;

    constructor(props, context) {
      super(props, context);

      const { injectReducer } = this.injectors;

      injectReducer(key, reducer);
    }

    injectors = getInjectors(this.context.store);

    render() {
      return <WrappedComponent {...this.props} />;
    }
  }

  ReducerInjector.displayName = `withReducer(${WrappedComponent.displayName
    || WrappedComponent.name
    || 'Component'})`;

  ReducerInjector.contextTypes = {
    store: PropTypes.object.isRequired,
  };

  return hoistNonReactStatics(ReducerInjector, WrappedComponent);
};
