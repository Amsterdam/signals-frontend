// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Gemeente Amsterdam
declare module '*.svg' {
  const svgUrl: string;
  export default svgUrl;
  export { svgComponent as ReactComponent };
}

declare module '*.jpg';

declare module '*.png';

interface URLSearchParams {
  keys: () => string[];
}
