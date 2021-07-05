export const getIconUrl = (iconSvg?: string) => {
  return `data:image/svg+xml;base64,${btoa(iconSvg || '')}`
}
