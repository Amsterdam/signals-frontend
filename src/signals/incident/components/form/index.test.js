import CheckboxInput from './CheckboxInput';
import DescriptionWithClassificationInput from './DescriptionWithClassificationInput';
import DateTimeInput from './DateTimeInput';
import FileInput from './FileInput';
import HandlingMessage from './HandlingMessage';
import HiddenInput from './HiddenInput';
import MultiTextInput from './MultiTextInput';
import PlainText from './PlainText';
import RadioInputGroup from './RadioInputGroup';
import SelectInput from './SelectInput';
import TextInput from './TextInput';
import TextareaInput from './TextareaInput';
import MapInput from './MapInput';
import MapSelect from './MapSelect';

import components from './index';

describe('Form components', () => {
  it('should load all components', () => {
    expect(components).toEqual({
      CheckboxInput,
      DateTimeInput,
      DescriptionWithClassificationInput,
      FileInput,
      HandlingMessage,
      HiddenInput,
      MapInput,
      MapSelect,
      MultiTextInput,
      PlainText,
      RadioInputGroup,
      SelectInput,
      TextInput,
      TextareaInput,
    });
  });
});
