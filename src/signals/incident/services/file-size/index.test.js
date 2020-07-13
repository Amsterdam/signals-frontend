import fileSize from '.';

describe('The file size service', () => {
  it('should format values with 1 decimal by default', () => {
    expect(fileSize(66666)).toEqual('65,1 kB');
  });

  it('should format values with no decimal when it is zero', () => {
    expect(fileSize(2048)).toEqual('2 kB');
  });

  it('should format values with 4 decimals', () => {
    expect(fileSize(1234567890, 4)).toEqual('1,1498 GB');
  });

  it('should format values with 5 decimals and dot as delimiter', () => {
    expect(fileSize(42424242, 5, '.')).toEqual('40.45891 MB');
  });

  it('should format edge cases', () => {
    expect(fileSize()).toEqual(undefined);
    expect(fileSize(0)).toEqual(0);
  });
});
