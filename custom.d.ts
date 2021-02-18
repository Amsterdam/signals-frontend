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
