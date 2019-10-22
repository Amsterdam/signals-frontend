import mapLocation from './index';

describe('The map location service', () => {
  it('should map geometry', () => {
    expect(mapLocation({
      query: {
        longitude: 4,
        latitude: 52,
      },
    })).toEqual({
      geometrie: {
        type: 'Point',
        coordinates: [
          4,
          52,
        ],
      },
    });
  });

  it('should map omgevingsinfo', () => {
    expect(mapLocation({
      omgevingsinfo: {
        buurtcode: 'A02d',
        stadsdeelcode: 'A',
      },
    })).toEqual({
      buurt_code: 'A02d',
      stadsdeel: 'A',
    });
  });

  it('should map dichtstbijzijnd_adres', () => {
    expect(mapLocation({
      dichtstbijzijnd_adres: {
        openbare_ruimte: 'Keizersgracht',
        huisnummer: 666,
        huisletter: 'D',
        huisnummer_toevoeging: 3,
        postcode: '1016EJ',
      },
    })).toEqual({
      address: {
        openbare_ruimte: 'Keizersgracht',
        huisnummer: '666',
        huisletter: 'D',
        huisnummer_toevoeging: '3',
        postcode: '1016EJ',
      },
    });
  });
});
