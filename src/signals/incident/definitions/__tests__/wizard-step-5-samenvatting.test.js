// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Gemeente Amsterdam
import { Validators } from 'react-reactive-form';

import configuration from 'shared/services/configuration/configuration';

import step5, { renderPreview, summary, Label, ObjectLabel, SCSVLabel, Null } from '../wizard-step-5-samenvatting';
import FormComponents from '../../components/form';
import PreviewComponents from '../../components/IncidentPreview/components';

const { previewFactory } = step5;

jest.mock('shared/services/configuration/configuration');
jest.mock('react-reactive-form');
jest.mock('lodash/memoize', () => ({
  __esModule: true,
  default: jest.fn(fn => fn),
}));

describe('signals/incident/definitions/wizard-step-5-samenvatting', () => {
  afterEach(() => {
    configuration.__reset();
  });

  describe('renderPreview', () => {
    it('should return the correct component', () => {
      expect(renderPreview({ render: 'RadioInputGroup' })).toEqual(ObjectLabel);
      expect(renderPreview({ render: 'TextInput' })).toEqual(Label);
      expect(renderPreview({ render: 'TextareaInput' })).toEqual(Label);
      expect(renderPreview({ render: 'MultiTextInput' })).toEqual(SCSVLabel);
      expect(renderPreview({ render: 'CheckboxInput', meta: { values: {} } })).toEqual(
        PreviewComponents.ListObjectValue
      );
      expect(renderPreview({ render: 'CheckboxInput', meta: { value: '' } })).toEqual(expect.any(Function));
      expect(renderPreview({ render: 'SomethingElse' })).toEqual(Null);
    });
  });

  describe('summary', () => {
    const controls = {
      extra_bedrijven_horeca_wat: {
        meta: {
          label: 'Uw melding gaat over:',
        },
        options: { validators: [Validators.required] },
        render: 'RadioInputGroup',
      },
      extra_bedrijven_horeca_naam: {
        meta: {
          label: 'Wie of wat zorgt voor deze overlast, denkt u?',
        },
        render: 'TextInput',
      },
    };

    it('should return mapped values', () => {
      expect(summary(controls)).toEqual({
        extra_bedrijven_horeca_wat: {
          label: 'Uw melding gaat over:',
          optional: true,
          render: ObjectLabel,
        },
        extra_bedrijven_horeca_naam: {
          label: 'Wie of wat zorgt voor deze overlast, denkt u?',
          optional: true,
          render: Label,
        },
      });
    });
  });

  describe('Hard coded questions', () => {
    it('should return questions based on category', () => {
      configuration.featureFlags.showVulaanControls = true;
      const actual = previewFactory({
        category: 'afval',
        subcategory: 'subcategory',
      });

      const expected = expect.objectContaining({
        vulaan: {
          extra_afval: {
            label: 'Waar komt het afval vandaan, denkt u?',
            optional: true,
            render: Label,
          },
          extra_container: {
            label: 'Kies de container waar het om gaat',
            optional: true,
            render: expect.any(Function),
          },
        },
      });

      expect(actual).toEqual(expected);
    });

    it('should return no questions with non existing category', () => {
      configuration.featureFlags.showVulaanControls = true;
      const actual = previewFactory({
        category: 'category',
        subcategory: 'subcategory',
      });
      const expected = expect.objectContaining({
        vulaan: {},
      });

      expect(actual).toEqual(expected);
    });

    it('should return empty controls when showVulaanControls is false', () => {
      expect(previewFactory({ category: 'afval' }).vulaan).toEqual({});
    });

    it('should fall back to short label', () => {
      configuration.featureFlags.showVulaanControls = true;
      const actual = previewFactory({
        category: 'wegen-verkeer-straatmeubilair',
      });
      const expected = expect.objectContaining({
        vulaan: expect.objectContaining({
          extra_straatverlichting_niet_op_kaart: expect.objectContaining({
            label: 'Staat niet op kaart',
          }),
        }),
      });

      expect(actual).toEqual(expected);
    });
  });

  describe('Fetch questions from backend', () => {
    beforeEach(() => {
      configuration.featureFlags.showVulaanControls = true;
      configuration.featureFlags.fetchQuestionsFromBackend = true;
    });

    it('should return empty controls without questions', () => {
      const actual = previewFactory({
        category: 'category',
        subcategory: 'subcategory',
      });
      const expected = expect.objectContaining({
        vulaan: {},
      });

      expect(actual).toEqual(expected);
    });

    it('should expand render prop to component', () => {
      const actual = previewFactory({
        category: 'category',
        subcategory: 'subcategory',
        questions: {
          key1: {
            meta: { label: 'Label' },
            render: 'TextInput',
          },
        },
      });
      const expected = expect.objectContaining({
        vulaan: {
          key1: {
            label: 'Label',
            optional: true,
            render: Label,
          },
        },
      });

      expect(actual).toEqual(expected);
    });

    it('should fall back to short label', () => {
      const actual = previewFactory({
        category: 'category',
        subcategory: 'subcategory',
        questions: {
          key1: {
            meta: { shortLabel: 'Label' },
            render: 'TextInput',
            required: true,
          },
        },
      });
      const expected = expect.objectContaining({
        vulaan: {
          key1: {
            label: 'Label',
            optional: false,
            render: Label,
          },
        },
      });

      expect(actual).toEqual(expected);
    });
  });
});
