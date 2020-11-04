import { Validators } from 'react-reactive-form';
import memoize from 'lodash/memoize';

import configuration from 'shared/services/configuration/configuration';

import step2 from '../wizard-step-2-vulaan';
import afval from '../wizard-step-2-vulaan/afval';
import FormComponents from '../../components/form';
import IncidentNavigation from '../../components/IncidentNavigation';

const { formFactory } = step2;

jest.mock('shared/services/configuration/configuration');
jest.mock('react-reactive-form');
jest.mock('lodash/memoize', () => ({
  __esModule: true,
  default: jest.fn(fn => fn),
}));

describe('Wizard step 2 vulaan, formFactory', () => {
  afterEach(() => {
    configuration.__reset();
  });

  describe('Hard coded questions', () => {
    it('should return questions based on category', () => {
      const actual = formFactory({
        category: 'afval',
        subcategory: 'subcategory',
      });
      const expected = afval;

      expect(actual).toEqual(expected);
    });

    it('should return no questions with non existing category', () => {
      const actual = formFactory({
        category: 'category',
        subcategory: 'subcategory',
      });
      const expected = { controls: {} };

      expect(actual).toEqual(expected);
    });

    it('should return empty controls when showVulaanControls is false', () => {
      configuration.featureFlags.showVulaanControls = false;
      expect(step2.formFactory({ category: 'afval' }).controls).toEqual({});
    });
  });

  describe('Fetch questions from backend', () => {
    beforeEach(() => {
      configuration.featureFlags.fetchQuestionsFromBackend = true;
    });

    it('should return empty controls without questions', () => {
      const actual = formFactory({
        category: 'category',
        subcategory: 'subcategory',
      });
      const expected = {
        controls: {},
      };

      expect(actual).toEqual(expected);
    });

    it('should expand render prop to component', () => {
      const actual = formFactory({
        category: 'category',
        subcategory: 'subcategory',
        questions: {
          key1: {
            render: 'TextInput',
          },
        },
      });
      const expected = {
        controls: {
          key1: {
            options: { validators: [] },
            render: FormComponents.TextInput,
          },
        },
      };

      expect(actual).toEqual(expected);
    });

    it('should expand render prop to component for IncidentNavigation as well', () => {
      const actual = formFactory({
        category: 'category',
        subcategory: 'subcategory',
        questions: {
          key1: {
            render: 'IncidentNavigation',
          },
        },
      });
      const expected = {
        controls: {
          key1: {
            options: { validators: [] },
            render: IncidentNavigation,
          },
        },
      };

      expect(actual).toEqual(expected);
    });

    it('should expand validators', () => {
      const actual = formFactory({
        category: 'category',
        subcategory: 'subcategory',
        questions: {
          key1: {
            options: {
              validators: ['required'],
            },
            render: 'TextInput',
          },
        },
      });
      const expected = {
        controls: {
          key1: {
            options: { validators: [Validators.required] },
            render: FormComponents.TextInput,
          },
        },
      };

      expect(actual).toEqual(expected);
    });

    it('should expand multiple validators', () => {
      const actual = formFactory({
        category: 'category',
        subcategory: 'subcategory',
        questions: {
          key1: {
            options: {
              validators: ['required', 'email'],
            },
            render: 'TextInput',
          },
        },
      });
      const expected = {
        controls: {
          key1: {
            options: { validators: [Validators.required, Validators.email] },
            render: FormComponents.TextInput,
          },
        },
      };

      expect(actual).toEqual(expected);
    });

    it('should expand validators with arguments', () => {
      const maxLengthFn = () => null;
      const maxLengthSpy = jest.spyOn(Validators, 'maxLength').mockReturnValue(maxLengthFn);
      const actual = formFactory({
        category: 'category',
        subcategory: 'subcategory',
        questions: {
          key1: {
            options: {
              validators: [['maxLength', 16]],
            },
            render: 'TextInput',
          },
        },
      });
      const expected = {
        controls: {
          key1: {
            options: { validators: [maxLengthFn] },
            render: FormComponents.TextInput,
          },
        },
      };

      expect(maxLengthSpy).toHaveBeenCalledWith(16);
      expect(actual).toEqual(expected);
    });

    it('should memoize with cache key on category and subcategory', () => {
      formFactory({});
      expect(memoize).toHaveBeenCalled();

      const actual = memoize.mock.calls[0][1]('questions', 'category', 'subcategory');
      const expected = 'categorysubcategory';
      expect(actual).toBe(expected);
    });
  });
});
