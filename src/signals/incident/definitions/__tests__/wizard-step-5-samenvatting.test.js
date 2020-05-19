import { Validators } from 'react-reactive-form';
import FormComponents from '../../components/form';
import PreviewComponents from '../../components/IncidentPreview/components';
import {
  renderPreview,
  summary,
  Label,
  ObjectLabel,
  SCSVLabel,
  Null,
} from '../wizard-step-5-samenvatting';

describe('signals/incident/definitions/wizard-step-5-samenvatting', () => {
  describe('renderPreview', () => {
    it('should return the correct component', () => {
      expect(renderPreview({ render: { name: 'RadioInputGroup' } })).toEqual(ObjectLabel);
      expect(renderPreview({ render: { name: 'TextInput' } })).toEqual(Label);
      expect(renderPreview({ render: { name: 'TextareaInput' } })).toEqual(Label);
      expect(renderPreview({ render: { name: 'MultiTextInput' } })).toEqual(SCSVLabel);
      expect(renderPreview({ render: { name: 'CheckboxInput' } })).toEqual(PreviewComponents.ListObjectValue);
      expect(renderPreview({ render: { name: 'SomethingElse' } })).toEqual(Null);
    });
  });

  describe('summary', () => {
    const controls = {
      extra_bedrijven_horeca_wat: {
        meta: {
          label: 'Uw melding gaat over:',
          shortLabel: 'Soort bedrijf',
        },
        options: { validators: [Validators.required] },
        render: FormComponents.RadioInputGroup,
      },
      extra_bedrijven_horeca_naam: {
        meta: {
          label: 'Wie of wat zorgt voor deze overlast, denkt u?',
          shortLabel: 'Mogelijke veroorzaker',
        },
        render: FormComponents.TextInput,
      },
    };

    it('should return mapped values', () => {
      expect(summary(controls)).toEqual({
        extra_bedrijven_horeca_wat: {
          label: 'Soort bedrijf',
          optional: true,
          render: ObjectLabel,
        },
        extra_bedrijven_horeca_naam: {
          label: 'Mogelijke veroorzaker',
          optional: true,
          render: Label,
        },
      });
    });
  });
});
