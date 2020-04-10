import reverseGeocoderService, { formatRequest } from '../services/reverseGeocoderService';

describe('formatRequest', () => {
  const testLocation = {
    latitude: 42,
    longitude: 4,
  };
  const result = 'https://base-url&X=39180.476027290264&Y=-667797.6751788945&distance=';

  it('should format correct without distance', () => {
    expect(formatRequest('https://base-url', testLocation)).toEqual(`${result}50`);
  });

  it('should format correct with distance', () => {
    expect(formatRequest('https://base-url', testLocation, 20)).toEqual(`${result}20`);
  });
});

describe('reverseGeocoderService', () => {
  const testLocation = {
    lat: 42,
    lng: 4,
  };

  const mockResponse = {
    response: {
      numFound: 1,
      start: 0,
      maxScore: 15.822564,
      docs: [
        {
          woonplaatsnaam: 'Amsterdam',
          huis_nlt: '189A-2',
          weergavenaam: 'Bloemgracht 189A-2, 1016KP Amsterdam',
          straatnaam: 'Bloemgracht',
          id: 'adr-a03ce477aaa2e95e9246139b631484ad',
          postcode: '1016KP',
          centroide_ll: 'POINT(4.87745608 52.37377195)',
        },
      ],
    },
  };

  const testResult = {
    id: 'adr-a03ce477aaa2e95e9246139b631484ad',
    value: 'Bloemgracht 189A-2, 1016KP Amsterdam',
    data: {
      location: { lat: 52.37377195, lng: 4.87745608 },
      address: {
        openbare_ruimte: 'Bloemgracht',
        huisnummer: '189A-2',
        huisletter: '',
        huisnummertoevoeging: '',
        postcode: '1016KP',
        woonplaats: 'Amsterdam',
      },
    },
  };

  beforeEach(() => {
    fetch.mockResponseOnce(JSON.stringify(mockResponse));
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should return the correct location', async () => {
    const result = await reverseGeocoderService(testLocation);
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(result).toEqual(testResult);
  });
});
