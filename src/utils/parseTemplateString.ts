// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2012 Delta10 B.V.

const TEMPLATE_REGEX = /\{\{.+?\}\}/g

export function isTemplateString(template: string): boolean {
  return (template.match(TEMPLATE_REGEX) || []).length > 0
}

export function parseTemplateString(template: string, context: any): string {
  return template.replace(TEMPLATE_REGEX, (match: string) => {
    const fallback = match
    const path = match.slice(2, match.length - 3).trim()
    return String(
      path.split('.').reduce((res, key) => res[key] || fallback, context)
    )
  })
}
