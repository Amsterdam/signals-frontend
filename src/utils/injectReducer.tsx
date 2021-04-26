import hoistNonReactStatics from 'hoist-non-react-statics'
import { Component, ComponentType, useEffect } from 'react'
import { useStore, ReactReduxContext } from 'react-redux'

import type { InjectReducerParams, InjectedStore } from 'types'
import { getInjectors } from './reducerInjectors'

/**
 * Dynamically injects a reducer
 *
 * @param {string} key A key of the reducer
 * @param {function} reducer A reducer that will be injected
 *
 */

export default function hocWithReducer<P>({
  key,
  reducer,
}: InjectReducerParams) {
  function wrap(WrappedComponent: ComponentType<P>): ComponentType<P> {
    // dont wanna give access to HOC. Child only
    class ReducerInjector extends Component<P> {
      // eslint-disable-next-line react/static-property-placement
      public static contextType = ReactReduxContext

      public static WrappedComponent = WrappedComponent

      // eslint-disable-next-line react/static-property-placement
      public static displayName = `withReducer(${
        (WrappedComponent.displayName ?? WrappedComponent.name) || 'Component'
      })`

      // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility
      constructor(props: any, context: any) {
        super(props, context)

        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        getInjectors(context.store).injectReducer(key as string, reducer)
      }

      public render() {
        return <WrappedComponent {...this.props} />
      }
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return hoistNonReactStatics(ReducerInjector, WrappedComponent) as any
  }
  return wrap
}

const useInjectReducer = ({ key, reducer }: InjectReducerParams) => {
  const store = useStore() as InjectedStore
  useEffect(() => {
    getInjectors(store).injectReducer(key as string, reducer)
  }, [key, reducer, store])
}

export { useInjectReducer }
