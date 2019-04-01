import mapDynamicFields from './index';

describe('The map dynamic fields service', () => {
  it('should do nothing by default', () => {
    expect(mapDynamicFields('foo bar', {
    })).toEqual('foo bar');
  });

  it('should be undefined by default', () => {
    expect(mapDynamicFields('foo {incident.id} bar {incident.text}', {
      incident: {
        id: 666,
        text: 'Deze tekst dus'
      }
    })).toEqual('foo 666 bar Deze tekst dus');
  });
});
