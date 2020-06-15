import configuration from 'shared/services/configuration/configuration';
import vulaan from '../wizard-step-2-vulaan';

describe('wizard-step-2-vullaan', () => {
  it('should return controls when showVulaanControls is true', () => {
    configuration.showVulaanControls = true;
    expect(vulaan.formFactory({ category: 'afval' }).controls).not.toEqual({});
  });

  it('should return empty controls when showVulaanControls is false', () => {
    configuration.showVulaanControls = false;
    expect(vulaan.formFactory({ category: 'afval' }).controls).toEqual({});
  });

  it('should return empty controls when showVulaanControls is true but no category is found', () => {
    configuration.showVulaanControls = false;
    expect(vulaan.formFactory({ category: 'not-existing-category' }).controls).toEqual({});
  });
});
