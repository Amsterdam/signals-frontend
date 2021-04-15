// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2021 Gemeente Amsterdam
import randomStringGenerator from './random-string-generator';

describe('The state token generator service', () => {
  const byteString = '048>IYceiv{ÈÌÐàð';
  const asciiString = 'abcd+efgh==';

  let origBtoa;
  let origCrypto;

  beforeEach(() => {
    origBtoa = global.btoa;
    global.btoa = jest.fn();
    global.btoa.mockImplementation(() => asciiString);

    origCrypto = global.crypto;
    global.crypto = {};
    global.crypto.getRandomValues = jest.fn();
    global.crypto.getRandomValues.mockImplementation(list => {
      /* eslint-disable no-param-reassign */
      list[0] = 48; // 0
      list[1] = 52; // 4
      list[2] = 56; // 8
      list[3] = 62; // >
      list[4] = 73; // I
      list[5] = 89; // Y
      list[6] = 99; // c
      list[7] = 101; // e
      list[8] = 105; // i
      list[9] = 118; // v
      list[10] = 123; // {
      list[11] = 200; // È
      list[12] = 204; // Ì
      list[13] = 208; // Ð
      list[14] = 224; // à
      list[15] = 240; // ð
      /* eslint-enable no-param-reassign */
    });
  });

  afterEach(() => {
    global.btoa = origBtoa;
    global.crypto = origCrypto;
    global.msCrypto = undefined;
  });

  it('uses the msCrypto library when crypto is not available (IE11)', () => {
    global.msCrypto = global.crypto;
    global.crypto = undefined;
    const randomString = randomStringGenerator();

    expect(global.btoa).toHaveBeenCalledWith(byteString);
    expect(randomString).toBe(asciiString);
  });

  it('returns an empty string when the crypto library is not available', () => {
    global.crypto = undefined;
    const randomString = randomStringGenerator();

    expect(global.btoa).not.toHaveBeenCalled();
    expect(randomString).toBe('');
  });

  it('it generates a random string of characters and url encodes it', () => {
    const randomString = randomStringGenerator();
    expect(global.btoa).toHaveBeenCalledWith(byteString);
    expect(randomString).toBe(asciiString);
  });
});
