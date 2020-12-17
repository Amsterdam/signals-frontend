export namespace NodeJS {
  interface Global {
    document: Document;
    window: Window;
    navigator: Navigator;
    AbortController: {
      new (): AbortController;
      prototype: AbortController;
    };
  }
}