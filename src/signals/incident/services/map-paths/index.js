import forEach from 'lodash.foreach';
import set from 'lodash.set';

import configuration from 'shared/services/configuration/configuration';
import getStepControls from '../get-step-controls';
import convertValue from '../convert-value';

const mapPaths = (params, incident, wizard) => {
  const category_url = incident
    ? new URL(`${configuration.CATEGORIES_ENDPOINT}${incident.category}/sub_categories/${incident.subcategory}`).pathname
    : '';

  forEach(wizard, step => {
    const controls = getStepControls(step, incident);
    let mapMerge = {};

    forEach(controls, (control, name) => {
      const value = incident[name];
      const meta = control.meta;

      if (meta && meta.isVisible && meta.pathMerge) {
        const answer = convertValue(value, meta.postPropertyNames);
        if (answer || answer === 0) {
          mapMerge = {
            ...mapMerge,
            [meta.pathMerge]: [
              ...(mapMerge[meta.pathMerge] || []),
              {
                id: name,
                label: meta.shortLabel || meta.label || '',
                category_url,
                answer,
              },
            ],
          };
        }
      }
    });

    forEach(mapMerge, (value, key) => {
      set(params, key, value);
    });
  });

  return params || {};
};

export default mapPaths;
