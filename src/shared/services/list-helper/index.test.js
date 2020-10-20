import { getListValueByKey } from './list-helper';

describe('The list helper service', () => {
  const list = [
    {
      key: null,
      value: 'null',
    },
    {
      key: 'A',
      value: 'Centrum',
    },
    {
      key: 'B',
      value: 'Westpoort',
    },
    {
      key: 'E',
      value: 'West',
    },
    {
      key: 'M',
      value: 'Oost',
    },
    {
      key: 'N',
      value: 'Noord',
    },
    {
      key: 'T',
      value: 'Zuidoost',
    },
    {
      key: 'K',
      value: 'Zuid',
    },
    {
      key: 'F',
      value: 'Nieuw-West',
    },
  ];

  it('by default should return false', () => {
    expect(getListValueByKey()).toEqual(false);
  });

  it('should return the correct value whem it exists', () => {
    expect(getListValueByKey(list, 'M')).toEqual('Oost');
    expect(getListValueByKey(list, 'F')).toEqual('Nieuw-West');
  });

  it('should return not found value whem it does not exist', () => {
    expect(getListValueByKey(list, 'NOT_FOUND')).toEqual('Niet gevonden');
  });

  it('should be able to handle null keys with any falsy key parameter', () => {
    expect(getListValueByKey(list)).toEqual('null');
    expect(getListValueByKey(list, null)).toEqual('null');
    expect(getListValueByKey(list, false)).toEqual('null');
    expect(getListValueByKey(list, 0)).toEqual('null');
    expect(getListValueByKey(list, '')).toEqual('null');
  });
});
