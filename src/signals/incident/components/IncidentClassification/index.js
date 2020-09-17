import React, { useEffect } from 'react';
import { useFetch } from 'hooks';
import configuration from 'shared/services/configuration/configuration';

import { useHistory, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setClassification } from 'signals/incident/containers/IncidentContainer/actions';
import LoadingIndicator from 'components/LoadingIndicator';

const IncidentClassification = () => {
  const history = useHistory();
  const { category, subcategory } = useParams();
  const { get, data, error } = useFetch();
  const dispatch = useDispatch();

  useEffect(() => {
    get(`${configuration.CATEGORIES_ENDPOINT}${category}/sub_categories/${subcategory}`);
  }, [category, subcategory, get]);

  useEffect(() => {
    if (data) dispatch(setClassification({ category, subcategory }));
    if (data || error) history.push('/');
  }, [data, error, history, dispatch, category, subcategory]);

  // This shows a loading indicator, it is used to build the logic
  // for setting the category and subcategory from the url
  // before redirecting to the incident page
  return <LoadingIndicator />;
};

export default IncidentClassification;
