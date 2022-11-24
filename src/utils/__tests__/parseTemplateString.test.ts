// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 Delta10 B.V.
import { isTemplateString, parseTemplateString } from '../parseTemplateString'

describe('parseTemplateString', () => {
  it('should correctly detect a templateString', () => {
    const templateString = 'This contains {{ a_template }} string'
    const noTemplateString = 'This does not contain a template string'

    expect(isTemplateString(templateString)).toEqual(true)
    expect(isTemplateString(noTemplateString)).toEqual(false)
  })

  it('should correctly parse a templateString', () => {
    const templateString = 'The {{ animal }} jumps over the {{ item }}'
    const context = { animal: 'dog', item: 'fence' }
    expect(parseTemplateString(templateString, context)).toEqual(
      'The dog jumps over the fence'
    )
  })

  it('should correctly parse a nested templateString', () => {
    const templateString = 'The {{ my.animal }} jumps over the {{ item }}'
    const context = { my: { animal: 'cow' }, item: 'fence' }
    expect(parseTemplateString(templateString, context)).toEqual(
      'The cow jumps over the fence'
    )
  })

  it('should not parse a templateString that is not in context', () => {
    const templateString = 'The {{ animal }} jumps'
    const context = { noAnimal: 'beer' }
    expect(parseTemplateString(templateString, context)).toEqual(
      'The {{ animal }} jumps'
    )
  })
})
