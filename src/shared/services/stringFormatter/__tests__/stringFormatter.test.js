import stringFormatter from '..';

describe('shared/services/stringFormatter', () => {
  it('should replace occurrences in a string', () => {
    const string = '%%hic%% %%sunt%% %%dracones%% means dangerous or unexplored territories';
    const replacements = {
      '%%hic%%': 'HIC',
      '%%sunt%%': 'SUNT',
      '%%dracones%%': 'DRACONES',
    };

    expect(stringFormatter(string, replacements)).toEqual('HIC SUNT DRACONES means dangerous or unexplored territories');
  });
});
