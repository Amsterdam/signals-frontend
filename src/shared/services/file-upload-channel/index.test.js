import fileUploadChannel from '.';

describe('The file upload channel service', () => {
  let addEventListener;
  let removeEventListener;
  let abort;
  let open;
  let send;

  beforeEach(() => {
    addEventListener = jest.fn();
    removeEventListener = jest.fn();
    abort = jest.fn();
    open = jest.fn();
    send = jest.fn();

    window.XMLHttpRequest = jest.fn();
    window.XMLHttpRequest.mockImplementation(() => ({
      abort,
      open,
      send,
      upload: {
        addEventListener,
        removeEventListener,
      },
    }));
  });

  afterEach(() => {
  });

  it('should map status by default', () => {
    const channel = fileUploadChannel('https://acc.api.data.amsterdam.nl/signals/signal/image/', 'blob:http://host/c00d2e14-ae1c-4bb3-b67c-86ea93130b1c', 666);

    expect(open).toHaveBeenCalledWith('POST', 'https://acc.api.data.amsterdam.nl/signals/signal/image/', true);
    expect(send).toHaveBeenCalledWith(expect.any(Object));

    expect(addEventListener).toHaveBeenCalledWith('progress', expect.any(Function));
    expect(addEventListener).toHaveBeenCalledWith('error', expect.any(Function));
    expect(addEventListener).toHaveBeenCalledWith('abort', expect.any(Function));

    channel.close();

    expect(removeEventListener).toHaveBeenCalledWith('progress', expect.any(Function));
    expect(removeEventListener).toHaveBeenCalledWith('error', expect.any(Function));
    expect(removeEventListener).toHaveBeenCalledWith('abort', expect.any(Function));

    expect(abort).toHaveBeenCalledWith();
  });
});
