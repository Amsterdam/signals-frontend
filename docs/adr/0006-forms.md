# Forms

Date: 2020-09-16

## Status

2020-09-16 Proposed
2020-09-22 Accepted

## Context

Currently the form library [`react-reactive-forms`](https://github.com/bietkul/react-reactive-form) is being used. This poses the following problems:

- It is difficult and time consuming to customize the form to specific needs and requirements, because the form logic consists of many layers and you have indirect control over the end result.
  - Many forms are defined through a configuration.
  - Forms are created with a form builder.
  - Form elements are defined through components
  - Rendering is defined throught a prop on a field component.
- There is no easy interaction through hooks.
- Not actively maintained anymore (latest release from 2018-08-19).

It does provide us with the following benefits:

- Additional questions in the incident form can come from the backend in a json definition and easily be inserted into the form.
- Has built-in validation.
- Small footprint, no dependencies.

## Considerations

We would like to update how we develop forms. The following requirements are
important to us:

- _Should have_ low footprint, few dependencies.
- _Should be_ easy to customize, or use custom components, validation, localization.
- _Should have_ no re-rendering on changes to form fields
- _Must have_ integration with React hooks.
- _Must have_ validation.

| Package                                                               | No run-time deps. | < 10 kB | Hooks | Custom comps | Validation | Custom val. | i18n | No re-render | Stargazers | Updated       |
| --------------------------------------------------------------------- | ----------------- | ------- | ----- | ------------ | ---------- | ----------- | ---- | ------------ | ---------- | ------------- |
| [formik](https://github.com/jaredpalmer/formik)                       | ❌                | ❌      | ❌    | ❌           | ✅\*       | ✅          | ✅   | ❌           | 24.5k      | 2 months ago  |
| [react-hook-form](https://github.com/react-hook-form/react-hook-form) | ✅                | ✅      | ✅    | ✅           | ✅\*\*     | ✅          | ✅   | ✅           | 14.1k      | recently      |
| plain HTML                                                            | ✅                | ✅      | ❌    | ✅           | ✅         | ✅          | ✅   | ✅           | –          | –             |
| [react-reactive-form](https://github.com/bietkul/react-reactive-form) | ✅                | ✅      | ❌    | ✅           | ✅         | ✅          | ❌   | ❌           | 250        | 25 months ago |

\* Only support for 3rd party validation, integrated support for [Yup](https://github.com/jquense/yup).\
\*\* Integrated validation follows the [HTML standard for form validation](https://developer.mozilla.org/en-US/docs/Learn/HTML/Forms/Form_validation). Support for 3rd party validation, integrated support for [Yup](https://github.com/jquense/yup) [Joi](https://github.com/hapijs/joi) and [Superstruct](https://github.com/ianstormtaylor/superstruct).

## Decision

Only [react-hook-form](https://github.com/react-hook-form/react-hook-form) has integration with React hooks and doesn't rerender on input changes to form fields. Furthermore, it has a small footprint, built in validation, requires very little code to use and follows HTML standards closely.

Generating a form based on a definition coming from the back end can easily be done with this library using native JavaScript/React logic.

## Consequences

These libraries can exist side by side in the code base. New forms can be built using the new [react-hook-form](https://github.com/react-hook-form/react-hook-form) while existing forms still use [react-reactive-form](https://github.com/bietkul/react-reactive-form). Existing forms can be re-written when we decide it would be worth the effort.

### Incident form

- [IncidentForm/index.tsx](../../src/signals/incident/components/IncidentForm/index.tsx)

A form components specifically using the dependency, which can easily be updated when using the new lib.

- [form/Header/index.tsx](../../src/signals/incident/components/form/Header/index.js)

The definitions for all steps in the wizard can be turned into components, defining the form directly.

- [wizard-step-1-beschrijf.js](../../src/signals/incident/definitions/wizard-step-1-beschrijf.js)
- [wizard-step-3-contact.js](../../src/signals/incident/definitions/wizard-step-3-contact.js)
- [wizard-step-4-summary.js](../../src/signals/incident/definitions/wizard-step-4-summary.js)
- [wizard-step-5-bedankt.js](../../src/signals/incident/definitions/wizard-step-5-bedankt.js)
- [wizard-step-6-fout.js](../../src/signals/incident/definitions/wizard-step-6-fout.js)

The definition for step 2 should be turned into a component and define logic for rendering definitions for additional questions.

- [wizard-step-2-vulaan.js](../../src/signals/incident/definitions/wizard-step-2-vulaan.js)

### Incident management

#### Steps

Rewrite the forms by rewriting:

- the form initialization;
- the submit function;
- validation;
- any specific logic as watching for changes;
- the specific components within that form.

#### Forms

The default texts admin page with the texts form and select form.

- [DefaultTextsAdmin/components/DefaultTextsForm/index.tsx](../../src/signals/incident-management/containers/DefaultTextsAdmin/components/DefaultTextsForm.tsx)
- [DefaultTextsAdmin/components/SelectForm/index.tsx](../../src/signals/incident-management/containers/DefaultTextsAdmin/components/SelectForm/index.js)

The incident detail location form with the location input component.

- [IncidentDetail/components/LocationForm/index.tsx](../../src/signals/incident-management/containers/IncidentDetail/components/LocationForm/index.js)
- [IncidentDetail/components/LocationForm/components/LocationInput/index.tsx](../../src/signals/incident-management/containers/IncidentDetail/components/LocationForm/components/LocationInput/index.js)

The incident detail meta list form with the change value component.

- [IncidentDetail/components/MetaList/components/ChangeValue/index.tsx](../../src/signals/incident-management/containers/IncidentDetail/components/MetaList/components/ChangeValue/index.js)

The incident split form and incident part.

- [LegacyIncidentSplitContainer/components/SplitForm/index.tsx](../../src/signals/incident-management/containers/LegacyIncidentSplitContainer/components/SplitForm/index.js)
- [LegacyIncidentSplitContainer/components/IncidentPart/index.tsx](../../src/signals/incident-management/containers/LegacyIncidentSplitContainer/components/IncidentPart/index.js)
