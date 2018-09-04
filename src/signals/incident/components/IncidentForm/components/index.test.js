import CheckboxInput from './CheckboxInput';
import DescriptionWithClassificationInput from './DescriptionWithClassificationInput/';
import DateTimeInput from './DateTimeInput/';
import FileInput from './FileInput/';
import HiddenInput from './HiddenInput/';
import PlainText from './PlainText/';
import RadioInput from './RadioInput/';
import SelectInput from './SelectInput/';
import TextInput from './TextInput/';
import TextareaInput from './TextareaInput/';
import MapInput from './MapInput';

import components from './index';

describe('Form components', () => {
  it('should load all components', () => {
    expect(components).toEqual({
      CheckboxInput,
      DateTimeInput,
      DescriptionWithClassificationInput,
      FileInput,
      HiddenInput,
      MapInput,
      PlainText,
      RadioInput,
      SelectInput,
      TextInput,
      TextareaInput
    });
  });
});
