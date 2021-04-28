import { Component, ComponentType, useEffect } from 'react'
import hoistNonReactStatics from 'hoist-non-react-statics'
import { ReactReduxContext, useStore } from 'react-redux'

import type { InjectedStore, InjectSagaParams } from 'types'
import { getInjectors } from './sagaInjectors'

/**
 * Dynamically injects a saga, passes component's props as saga arguments
 *
 * @param {string} key A key of the saga
 * @param {function} saga A root saga that will be injected
 * @param {string} [mode] By default (constants.DAEMON) the saga will be started
 * on component mount and never canceled or started again. Another two options:
 *   - constants.RESTART_ON_REMOUNT — the saga will be started on component mount and
 *   cancelled with `task.cancel()` on component unmount for improved performance,
 *   - constants.ONCE_TILL_UNMOUNT — behaves like 'RESTART_ON_REMOUNT' but never runs it again.
 *
 */
export default function hocWithSaga<P>({ key, saga, mode }: InjectSagaParams) {
  function wrap(WrappedComponent: ComponentType<P>): ComponentType<P> {
    // dont wanna give access to HOC. Child only
    class InjectSaga extends Component<P> {
      // eslint-disable-next-line react/static-property-placement
      public static displayName = `withSaga(${
        (WrappedComponent.displayName ?? WrappedComponent.name) || 'Component'
      })`

      public static WrappedComponent = WrappedComponent

      public static contextType = ReactReduxContext
      public injectors: ReturnType<typeof getInjectors>

      public constructor(props: any, context: any) {
        super(props, context)
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        this.injectors = getInjectors(context.store)

        this.injectors.injectSaga(key, { saga, mode }, this.props)
      }

      public componentWillUnmount() {
        this.injectors.ejectSaga(key)
      }

      public render() {
        return <WrappedComponent {...this.props} />
      }
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return hoistNonReactStatics(InjectSaga, WrappedComponent) as any
  }
  return wrap
}

const useInjectSaga = ({ key, saga, mode }: InjectSagaParams) => {
  const store = useStore() as InjectedStore
  useEffect(() => {
    const injectors = getInjectors(store)
    injectors.injectSaga(key, { saga, mode })

    return () => {
      injectors.ejectSaga(key)
    }
  }, [key, mode, saga, store])
}

export { useInjectSaga }
