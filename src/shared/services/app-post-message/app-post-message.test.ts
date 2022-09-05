import { postMessage } from '.'

describe('postMessage()', () => {
  it('should call postmessage', () => {
    jest.spyOn(parent.window, 'postMessage')

    postMessage('bar')

    expect(parent.window.postMessage).toHaveBeenCalledWith('signals/bar', '*')
  })
})
