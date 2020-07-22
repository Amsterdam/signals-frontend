# Translation handling

Date: 2020-07-22


## Status

Proposed


## Context

The SIA application configuration keeps expanding and also contains strings that contain variables or are in need of transformations like interpolation, formatting or nesting. Instead of implementing a custom solution, it would be better to include a package that can accomplish the mentioned transformations. The package would merely assist in maintaining string and would not be responsible for language detection, currency, number and date formatting, since we don't need to serve multilingual content, yet.

_Note: originally, [react-intl](https://www.npmjs.com/package/react-intl) was part of the application's dependencies and was removed in https://github.com/Amsterdam/signals-frontend/pull/777._

 The package:
- SHOULD HAVE a small footprint
- SHOULD HAVE string interpolation
- SHOULD HAVE string nesting (referencing translation string from translation string)
- SHOULD HAVE the ability to parse HTML elements in translations
- SHOULD HAVE recent updates and a 'reasonable' amount of stargazers
- SHOULDN'T HAVE language detection features
- MUST HAVE hooks instead of HOCs

## Considerations

A couple of packages would be suitable for this task after doing a search for 'react translation package':

- [i18n-react](https://www.npmjs.com/package/i18n-react)
- [react-i18next](https://www.npmjs.com/package/react-i18next)
- [react-intl](https://www.npmjs.com/package/react-intl)
- [react-intl-universal](https://www.npmjs.com/package/react-intl-universal)
- [react-translate](https://www.npmjs.com/package/react-translate)

| Package                                                                    	| Hooks 	| Interpolation 	| Nesting 	| Lang detect 	| HTML support 	| Stargazers 	| Updated       	|
|----------------------------------------------------------------------------	|-------	|---------------	|---------	|-------------	|--------------	|------------	|---------------	|
| [i18n-react](https://www.npmjs.com/package/i18n-react)                     	| ❌     	| ✅             	| ✅       	| ✅           	| ✅            	| 129        	| 14 months ago 	|
| [react-i18next](https://www.npmjs.com/package/react-i18next)               	| ✅     	| ✅             	| ✅       	| ✅           	| ✅            	| 5300       	| recently      	|
| [react-intl](https://www.npmjs.com/package/react-intl)                     	| ❌     	| ✅             	| ❌       	| ❌           	| ❌            	| 11900      	| recently      	|
| [react-intl-universal](https://www.npmjs.com/package/react-intl-universal) 	| ❌     	| ✅             	| ❌       	| ❌           	| ❌            	| 1013       	| recently      	|
| [react-translate](https://www.npmjs.com/package/react-translate)           	| ✅     	| ✅             	| ❌       	| ❌           	| ❌            	| 100        	| 7 months ago  	|

The packages without hooks do not follow the MUST HAVE requirement, which leaves [react-i18next](https://www.npmjs.com/package/react-i18next) and [react-translate](https://www.npmjs.com/package/react-translate). The latter offers very little functionality and doesn't seem to be actively maintained.

Considering the above, [react-i18next](https://www.npmjs.com/package/react-i18next) seems to best match our current needs and would offer the easiest transition to multi-lingual content in the future.

## Challenges

- Splitting up the current configuration into environment configuration properties and language properties
- Exposing the translations to the global scope like is done for the configuration props
- Schema validation on translation JSON
