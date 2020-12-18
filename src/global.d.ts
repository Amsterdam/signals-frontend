export namespace NodeJS {
// @ts-expect-error Suppress error: Global is not being used
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
