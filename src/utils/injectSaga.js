import React from 'react';
import PropTypes from 'prop-types';
import hoistNonReactStatics from 'hoist-non-react-statics';
import isArray from 'lodash/isArray';

import getInjectors from './sagaInjectors';

/**
 * Dynamically injects a saga, passes component's props as saga arguments
 *
 * @param {string} key A key of the saga
 * @param {function} saga A root saga that will be injected
 * @param {string} [mode] By default (constants.RESTART_ON_REMOUNT) the saga will be started on component mount and
 * cancelled with `task.cancel()` on component un-mount for improved performance. Another two options:
 *   - constants.DAEMON—starts the saga on component mount and never cancels it or starts again,
 *   - constants.ONCE_TILL_UNMOUNT—behaves like 'RESTART_ON_REMOUNT' but never runs it again.
 *
 */
export default (sagaDescriptors) => (WrappedComponent) => {
  const sagaDescriptorsArray = isArray(sagaDescriptors) ? sagaDescriptors : [{
    key: sagaDescriptors.key,
    saga: sagaDescriptors.saga,
    mode: sagaDescriptors.mode
  }];

  class InjectSaga extends React.Component {
    static WrappedComponent = WrappedComponent;
    static displayName = `withSaga(${(WrappedComponent.displayName || WrappedComponent.name || 'Component')})`;
    static contextTypes = {
      store: PropTypes.object.isRequired,
    };

    componentWillMount() {
      const { injectSaga } = this.injectors;

      sagaDescriptorsArray.forEach(({ key, saga, mode }) => {
        injectSaga(key, { saga, mode }, this.props);
      });
    }

    componentWillUnmount() {
      const { ejectSaga } = this.injectors;

      sagaDescriptorsArray.forEach(({ key }) => {
        ejectSaga(key);
      });
    }

    injectors = getInjectors(this.context.store);

    render() {
      return <WrappedComponent {...this.props} />;
    }
  }

  return hoistNonReactStatics(InjectSaga, WrappedComponent);
};
