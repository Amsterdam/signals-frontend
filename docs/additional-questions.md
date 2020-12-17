# Additional questions

## Question properties

| Property | Description
| - | -
| **Key** | This doesn't do anything, just give it a name.
| **Field type** | The type of form field for the visitor to anser the question with. Detailed below.
| **Meta** | This gives extra control over more specified properties. Detailed below.
| **Required** | The visitor is required to answer the question when this is checked. Otherwise the question is optional.

## Field type

Possible field types.

| Field type | Description
| - | -
| **PlainText** | This is not really a question to answer. It simply shows some information to the visitor.
| **TextInput** | A text field for one line of text.
| **CheckboxInput** | Could be either of the following. A *single* checkbox to allow the visitor to check or uncheck a specific option. A *list* of checkboxes to allow the visitor to choose multiple values from a fixed set of options.
| **MapSelect** | Shows assets on a map and allows the visitor to select some assets.
| **RadioInput** | Radio boxes to allow the visitor to choose one value from a fixed set of options.
| **SelectInput** | Dropdown box to allow the visitor to choose one value from a fixed set of options.
| **TextareaInput** | A bigger text field for multiple lines of text.

## Meta

This defines a set of properties written in [JSON](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Objects/JSON).

Possible properties are listed below. The 'Field types' column lists the possible field types the property can be used for, in case the property is not possible for all field types.

| Property | Description | Field types
| - | - | -
| **label** | The label acompanying the input field, proposing the question.
| **subtitle** | Extra information needed to explain the question (e.g. possible values, or how to find what is being asked for). | All except PlainText
| **shortLabel** | A short label to indicate the meaning of the answer. This is shown next to the answer in the back-office. | All except PlainText
| **placeholder** | An example answer to help the visitor determine how to answer the question and how to write down that answer. | TextInput, TextareaInput
| **type** | Allows to specify more specifically the type of message or form field. Detailed below. | PlainText, TextInput
| **autoRemove** | Automatically removes the specified value from the answer. | TextInput, TextareaInput
| **value** | The text to display to the visitor. | PlainText, CheckboxInput (single)
| **values** | The possible options in key-value pairs. | CheckboxInput (list), RadioInput, SelectInput
| **maxLength** | Displays, underneath the text area, the amount of characters typed into the text area versus the total amount of characters allowed (as specified with this property). | TextareaInput
| **idField** | The name of the property field of an asset that shows the ID/number. | MapSelect
| **endpoint** | The URL from which the assets can be retrieved to show on the map. Use `{{srsName}}` and `{{bboxLatLng}}` or `{{bboxLngLat}}` to get these values inserted in the URL. (e.g.: `https://geoserver.test/?service=WFS&version=1.1.0&request=GetFeature&srsName={{srsName}}&bbox={{bboxLatLng}},{{srsName}}`) | MapSelect
| **selectionLabel** | Label specifying the specific assets selected, shown below the map. | MapSelect
| **ifOneOf** | Conditionally shows this field if one of the specified conditions is met. Specify an object with key-value pairs for field names and values respectively. You can specify one value, or an array of values for a field. When one of the specified fields has one of it's values set, this field will be displayed. E.g.: `{"animal": ["cow", "chicken"], "severity": "high"}`. In this example, the field will be shown if *either* for the field 'animal' the value 'cow', or 'chicken' has been selected, *or* if for the field 'severity' the value 'high' has been selected.
| **requiredErrorMessage** | Custom error message for the 'required' input validator.

### Type

The type attribute on the meta value is possible on a few input types, specifying more specifically how to display the form field, or how it should behave. Possibilities are listed below.

| Field type | Description
| - | -
| **PlainText** | Possible values: `citation`, `caution`, `alert`.
| **TextInput** | [MDN](https://developer.mozilla.org) lists [all possible input types](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input) in the table under '\<input\> types'.
