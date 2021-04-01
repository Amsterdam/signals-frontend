// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2021 Gemeente Amsterdam
import invariant from 'invariant';
import isEmpty from 'lodash/isEmpty';
import isFunction from 'lodash/isFunction';
import isString from 'lodash/isString';
import conformsTo from 'lodash/conformsTo';

import type { InjectedStore } from 'types';
import type React from 'react';
import checkStore from './checkStore';
import { DAEMON, ONCE_TILL_UNMOUNT, RESTART_ON_REMOUNT } from './constants';

const allowedModes = [RESTART_ON_REMOUNT, DAEMON, ONCE_TILL_UNMOUNT];
interface SagaDescriptor {
  saga?: any;
  mode?: string | undefined;
}

interface Task { cancel: () => void }

const checkKey = (key: string) =>
{ invariant(
  isString(key) && !isEmpty(key),
  '(src/utils...) injectSaga: Expected `key` to be a non empty string'
); };

const checkDescriptor = (descriptor: SagaDescriptor) => {
  const shape = {
    saga: isFunction,
    mode: (mode: string | undefined) => isString(mode) && allowedModes.includes(mode),
  };
  invariant(
    conformsTo(descriptor, shape),
    '(app/utils...) injectSaga: Expected a valid saga descriptor'
  )
}

export function injectSagaFactory(store: InjectedStore, isValid = false) {
  return function injectSaga(key: string, descriptor: SagaDescriptor = {}, args?: React.ComponentProps<any>) {
    if (!isValid) checkStore(store);

    const newDescriptor: SagaDescriptor = {
      ...descriptor,
      mode: descriptor.mode ?? DAEMON,
    };

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const { saga, mode } = newDescriptor;

    checkKey(key)
    checkDescriptor(newDescriptor)

    let hasSaga = Reflect.has(store.injectedSagas, key)

    if (process.env.NODE_ENV !== 'production') {
      const oldDescriptor = store.injectedSagas[key] as { saga: any; task: Task };
      // enable hot reloading of daemon and once-till-unmount sagas
      if (hasSaga && oldDescriptor.saga !== saga) {
        oldDescriptor.task.cancel()
        hasSaga = false
      }
    }

    if (
      !hasSaga ||
      (hasSaga && mode !== DAEMON && mode !== ONCE_TILL_UNMOUNT)
    ) {
      /* eslint-disable no-param-reassign */
      store.injectedSagas[key] = {
        ...newDescriptor,
        task: store.runSaga(saga, args) as Task,
      };
      /* eslint-enable no-param-reassign */
    }
  }
}

export function ejectSagaFactory(store: InjectedStore, isValid = false) {
  return function ejectSaga(key: string) {
    if (!isValid) checkStore(store);

    checkKey(key)

    if (Reflect.has(store.injectedSagas, key)) {
      const descriptor = store.injectedSagas[key] as { mode: string; task: Task };
      if (descriptor.mode && descriptor.mode !== DAEMON) {
        descriptor.task.cancel()
        // Clean up in production; in development we need `descriptor.saga` for hot reloading
        if (process.env.NODE_ENV === 'production') {
          // Need some value to be able to detect `ONCE_TILL_UNMOUNT` sagas in `injectSaga`
          store.injectedSagas[key] = 'done' // eslint-disable-line no-param-reassign
        }
      }
    }
  }
}

export default function getInjectors(store: InjectedStore) {
  checkStore(store);

  return {
    injectSaga: injectSagaFactory(store, true),
    ejectSaga: ejectSagaFactory(store, true),
  }
}
