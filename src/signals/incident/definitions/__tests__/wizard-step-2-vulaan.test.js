import configuration from 'shared/services/configuration/configuration';
import vullaan from '../wizard-step-2-vulaan';

describe('wizard-step-2-vullaan', () => {
  it('should return controls when hasExtraProps is true', () => {
    configuration.hasExtraProps = true;
    expect(vullaan.formFactory({ category: "afval" }).controls).not.toEqual({ });
  });

  it('should return empty controls when hasExtraProps is false', () => {
    configuration.hasExtraProps = false;
    expect(vullaan.formFactory({ category: "afval" }).controls).toEqual({ });
  });

  it('should return empty controls when hasExtraProps is true but no category is found', () => {
    configuration.hasExtraProps = false;
    expect(vullaan.formFactory({ category: "not-existing-category" }).controls).toEqual({ });
  });
});
