// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 Vereniging van Nederlandse Gemeenten, Gemeente Amsterdam
import type endpointType from 'shared/services/configuration/endpoint-definitions';

import { prefixEndpoints } from '../endpoints';
import type configurationType from '../../../../../app.base.json';

const config: Record<string, unknown> = {};

const reset = () => {
  const windowConfig =
    (window as Window & typeof globalThis & { CONFIG?: Record<string, unknown> }).CONFIG ??
    ({} as Record<string, unknown>);
  const newConfig: Record<string, unknown> = JSON.parse(
    JSON.stringify({
      ...windowConfig,
      ...(prefixEndpoints(windowConfig.apiBaseUrl as string) as typeof endpointType),
    })
  ) as Record<string, unknown>;
  Object.keys(config).forEach(key => {
    // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
    delete config[key];
  });
  Object.keys(newConfig).forEach(key => {
    config[key] = newConfig[key];
  });
  config.__reset = reset;
};

reset();

export default config as typeof configurationType & typeof endpointType & { __reset: () => void };
