import verkeersoverlast from './verkeersoverlast'

describe('definition verkeersoverlast', () => {
  it('has a defined set of controls', () => {
    const keys = Object.keys(verkeersoverlast)

    expect(keys).toStrictEqual(['locatie', 'dateTime'])
  })
})
