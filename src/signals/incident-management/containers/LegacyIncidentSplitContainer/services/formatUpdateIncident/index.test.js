import formatUpdateIncident from '.';

describe('formatUpdateIncident service', () => {
  it('should return empty object by default', () => {
    expect(formatUpdateIncident()).toEqual({});
  });

  it('should return optial priority from new incident', () => {
    const priority = 'normal';
    expect(formatUpdateIncident({
      priority,
    })).toEqual({
      priority: {
        priority,
      },
    });
  });

  it('should return optial note from new incident', () => {
    const note = 'notitie';
    expect(formatUpdateIncident({
      note,
    })).toEqual({
      notes: [{
        text: note,
      }],
    });
  });
});
