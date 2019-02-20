import formatUpdateIncident from './index';

describe('formatUpdateIncident service', () => {
  it('should return empty object by default', () => {
    expect(formatUpdateIncident()).toEqual({});
  });

  it('should return optial subcategory from new incident', () => {
    const subcategory = 'subcategory';
    expect(formatUpdateIncident({
      subcategory
    })).toEqual({
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
      notes: [{
        text: note
      }]
    });
  });
});
