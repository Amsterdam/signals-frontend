import formatUpdateIncident from './index';

describe('formatUpdateIncident service', () => {
  const defaultValue = {
    status: {
      state: 'm'
    }
  };

  it('should return empty object by default', () => {
    expect(formatUpdateIncident()).toEqual(defaultValue);
  });

  it('should return optial text from new incident', () => {
    const text = 'er ligt hier alweer poep';
    expect(formatUpdateIncident({
      text
    })).toEqual({
      ...defaultValue,
      text
    });
  });

  it('should return optial location from original incident', () => {
    const location = {
      stadsdeel: 'A',
      buurt_code: 'A06e',
      address: {
        postcode: '1015ZL',
        huisletter: '',
        huisnummer: '109',
        woonplaats: 'Amsterdam',
        openbare_ruimte: 'Marnixkade',
        huisnummer_toevoeging: '2'
      },
      address_text: 'Marnixkade 109-2 1015ZL Amsterdam',
      geometrie: {
        type: 'Point',
        coordinates: [
          4.876877926290035,
          52.37551730449667
        ]
      },
      extra_properties: null,
      bag_validated: false
    };
    expect(formatUpdateIncident(undefined, {
      location
    })).toEqual({
      ...defaultValue,
      location
    });
  });

  it('should return optial subc from new incident', () => {
    const subcategory = 'subcategory';
    expect(formatUpdateIncident({
      subcategory
    })).toEqual({
      ...defaultValue,
      category: {
        sub_category: subcategory
      }
    });
  });

  it('should return optial priority from new incident', () => {
    const priority = 'normal';
    expect(formatUpdateIncident({
      priority
    })).toEqual({
      ...defaultValue,
      priority: {
        priority
      }
    });
  });

  it('should return optial note from new incident', () => {
    const note = 'notitie';
    expect(formatUpdateIncident({
      note
    })).toEqual({
      ...defaultValue,
      notes: [{
        text: note
      }]
    });
  });
});
