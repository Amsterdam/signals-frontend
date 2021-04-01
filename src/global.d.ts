// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Gemeente Amsterdam
export namespace NodeJS {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface Global {
    document: Document;
    window: Window;
    navigator: Navigator;
    AbortController: {
      prototype: AbortController;
      new (): AbortController;
    };
  }
}
