import { Validators } from 'react-reactive-form';
import memoize from 'lodash/memoize';

import step2 from '../wizard-step-2-vulaan';
import FormComponents from '../../components/form';

const { formFactory } = step2;

jest.mock('react-reactive-form');
jest.mock('lodash/memoize', () => ({
  __esModule: true,
  default: jest.fn(fn => fn),
}));

describe('Wizard step 2 vulaan, formFactory', () => {
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
          render: 'TEXT',
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

  it('should expand validators', () => {
    const actual = formFactory({
      category: 'category',
      subcategory: 'subcategory',
      questions: {
        key1: {
          options: {
            validators: ['REQUIRED'],
          },
          render: 'TEXT',
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
            validators: ['REQUIRED', 'EMAIL'],
          },
          render: 'TEXT',
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
            validators: [['MAX_LENGTH', 16]],
          },
          render: 'TEXT',
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
