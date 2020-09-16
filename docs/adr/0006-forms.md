# Forms

Date: 2020-09-16

## Status

2020-09-16 Proposed

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

- *Should have* low footprint, few dependencies.
- *Should be* easy to customize, or define custom components, validation, localization.
- *Should have* no re-rendering on changes to form fields
- *Must have* integration with React hooks.
- *Must have* validation.


| Package                                                               | No run-time deps. | < 10 kB | Hooks | Validation | Customizable | No re-render | Stargazers | Updated        |
| --------------------------------------------------------------------- | ---------------- | -------- | ----- | ---------- | ------------ | ------------ | ---------- | -------------- |
| [formik](https://github.com/jaredpalmer/formik)                       | ❌                | ❌        | ❌     | ✅*         | ✅            | ❌            | 24.5k      | 2 months ago   |
| [react-hook-form](https://github.com/react-hook-form/react-hook-form) | ✅                | ✅        | ✅     | ✅**        | ✅            | ✅            | 14.1k      | recently       |
| plain HTML                                                            | ✅                | ✅        | ❌     | ✅          | ✅            | ✅            | –          | –              |
| [react-reactive-form](https://github.com/bietkul/react-reactive-form) | ✅                | ✅        | ❌     | ✅          | ✅            | ❌            | 250        | 25 months ago  |

\* Only support for 3rd party validation, integrated support for [Yup](https://github.com/jquense/yup).
** Integrated validation follows the [HTML standard for form validation](https://developer.mozilla.org/en-US/docs/Learn/HTML/Forms/Form_validation). Support for 3rd party validation, integrated support for [Yup](https://github.com/jquense/yup) [Joi](https://github.com/hapijs/joi) and [Superstruct](https://github.com/ianstormtaylor/superstruct).

## Decision

Only [react-hook-form](https://github.com/react-hook-form/react-hook-form) has integration with React hooks and doesn't rerender on input changes to form fields. Furthermore, it has a small footprint, built in validation, requires very little code to use and follows HTML standards closely.

Generating a form based on a definition coming from the back end can easily be done with this library using native JavaScript/React logic.

## Consequences

These libraries can exist side by side in the code base. New forms can be built using the new [react-hook-form](https://github.com/react-hook-form/react-hook-form) while existing forms still use [react-reactive-form](https://github.com/bietkul/react-reactive-form). Existing forms can be re-written when decide it would be worth the effort.
