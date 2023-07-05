// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam
import { useCallback, useEffect, useMemo, useState } from "react";

import { Column, Row } from "@amsterdam/asc-ui";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import * as yup from "yup";

import BackLink from "components/BackLink";
import Button from "components/Button";
import Checkbox from "components/Checkbox";
import GlobalError from "components/GlobalError";
import Input from "components/Input";
import Label from "components/Label";
import LoadingIndicator from "components/LoadingIndicator";
import RadioButtonList from "components/RadioButtonList";
import { showGlobalNotification } from "containers/App/actions";
import { TYPE_LOCAL, VARIANT_ERROR } from "containers/Notification/constants";
import useFetch from "hooks/useFetch";
import { getErrorMessage } from "shared/services/api/api";
import configuration from "shared/services/configuration/configuration";
import { changeStatusOptionList } from "signals/incident-management/definitions/statusList";

import { Form, Grid, LeftSection, RightSection, StyledFormFooter, StyledLabel, StyledTextArea } from "./styled";
import type { StandardTextDetailData, StandardTextForm } from "./types";
import { createPatch } from "./utils";
import { PageHeader } from "../PageHeader";
import { SelectedSubcategories } from "../SelectedSubcategories";

interface Option {
  key: string;
  value: string;
}

const schema = yup.object({
  categories: yup
    .array()
    .min(1, "Vul de subcategorie(ën) in")
    .required("Vul de subcategorie(ën) in."),
  title: yup.string().required("Vul een titel in"),
  text: yup.string().required("Vul een omschrijving in")
});

export const Detail = () => {
  const navigate = useNavigate();
  const [waitForTimeout, setWaitForTimeout] = useState(false);
  const dispatch = useDispatch();
  const { id } = useParams();

  const { get, data, isLoading, patch, del, isSuccess, error } =
    useFetch<StandardTextDetailData>();

  const title = "Standaardtekst wijzigen";
  const redirectURL = "..";

  const defaultValues: StandardTextForm | null = useMemo(() => {
    if (id && data) {
      console.log("defaultvalues if", id, data);
      return {
        categories: data.categories,
        state: data.state,
        title: data.title,
        text: data.text,
        active: Boolean(data.active)
      };
    } else {
      console.log("defaultvalues else");
      return {
        categories: [4], // fake data when Selecteer subcategorieënpage has been made, this needs to be an empty array
        state: "",
        title: "",
        text: "",
        active: true
      };
    }
  }, [data, id]);

  const options = changeStatusOptionList.map((option) => ({
    key: option.key,
    value: option.value
  }));

  const formMethods = useForm<StandardTextForm>({
    reValidateMode: "onChange",
    resolver: yupResolver(schema),
    defaultValues: { ...defaultValues }
  });

  const { handleSubmit, formState, reset, getValues } = formMethods;

  const onSubmit = useCallback(() => {
    const hasDirtyFields = Object.keys(formState.dirtyFields).length > 0;

    if (!hasDirtyFields) {
      navigate(redirectURL);
      return;
    }
    patch(
      `${configuration.STANDARD_TEXTS_ENDPOINT}${id}`,
      createPatch(getValues(), formState.dirtyFields)
    );
  }, [formState.dirtyFields, getValues, id, navigate, patch]);

  const handleOnCancel = () => {
    navigate(redirectURL);
  };

  const handleOnDelete = () => {
    del(`${configuration.STANDARD_TEXTS_ENDPOINT}${id}`);
  };

  useEffect(() => {
    if (id &&
      !data &&
      !isLoading)
      {
        console.log("id is ", id)
        console.log("data is ", data)
        console.log("isLoading is ", isLoading)
        get(`${configuration.STANDARD_TEXTS_ENDPOINT}${id}`);
  }
  }, [data, get, id, isLoading];
)

  useEffect(() => {
    console.log("defaultvalues for real ", defaultValues);
    // Prefill form with data from query
    defaultValues && reset(defaultValues);
  }, [defaultValues, reset]);

  useEffect(() => {
    if (isSuccess) {
      setWaitForTimeout(true);

      // Set delay to wait for search endpoint to be updated
      const timer = setTimeout(() => {
        navigate(redirectURL);
      }, 750);

      return () => clearTimeout(timer);
    }
  }, [isSuccess, navigate, waitForTimeout]);

  useEffect(() => {
    if (error) {
      dispatch(
        showGlobalNotification({
          title: getErrorMessage(error),
          message: "De standaardtekst kon niet worden opgehaald",
          variant: VARIANT_ERROR,
          type: TYPE_LOCAL
        })
      );
    }
  }, [dispatch, error]);

  return (
    <Row>
      <FormProvider {...formMethods}>
        <Column span={12}>
          <GlobalError
            meta={{ label: "De standaardtekst kan niet worden opgeslagen" }}
          />
          <PageHeader
            title={title}
            backLink={
              <BackLink to={redirectURL}>Terug naar overzicht</BackLink>
            }
          />
        </Column>

        {(isLoading || waitForTimeout) && <LoadingIndicator />}

        <Form onSubmit={handleSubmit(onSubmit)}>
          <Grid>
            <LeftSection>
              <Controller
                name="categories"
                render={({
                           field: { name, onChange, value },
                           fieldState: { error }
                         }) => (
                  <SelectedSubcategories
                    name={name}
                    error={error}
                    onChange={onChange}
                    value={value}
                  />
                )}
              />
              <Controller
                name="state"
                render={({ field: { value, onChange } }) => {
                  const handleOnchange = (
                    _groupName: string,
                    option: Option
                  ) => {
                    onChange(option.key);
                  };
                  return (
                    <>
                      <Label as="span">Status</Label>
                      <RadioButtonList
                        groupName="Status"
                        hasEmptySelectionButton={false}
                        defaultValue={value}
                        options={options}
                        onChange={handleOnchange}
                      />
                    </>
                  );
                }}
              />
            </LeftSection>

            <RightSection>
              <Controller
                name="title"
                render={({
                           field: { name, value = "", onChange },
                           fieldState: { error }
                         }) => (
                  <Input
                    id={name}
                    name={name}
                    value={value}
                    onChange={onChange}
                    placeholder={"Titel"}
                    error={error?.message}
                  />
                )}
              />
              <Controller
                name="text"
                render={({
                           field: { name, value, onChange },
                           fieldState: { error }
                         }) => (
                  <StyledTextArea
                    showError={Boolean(error)}
                    id={name}
                    name={name}
                    value={value}
                    onChange={onChange}
                    placeholder="Tekst"
                    errorMessage={error?.message}
                  />
                )}
              />
              <Controller
                name="active"
                render={({ field: { name, value, onChange } }) => (
                  <div>
                    <StyledLabel htmlFor={name} label="Actief">
                      <Checkbox
                        name={name}
                        checked={value}
                        id={name}
                        onChange={onChange}
                      />
                    </StyledLabel>
                  </div>
                )}
              />

              <Button
                variant="secondary"
                onClick={handleOnDelete}
                type="button"
              >
                Verwijderen
              </Button>
            </RightSection>
          </Grid>

          <StyledFormFooter
            cancelBtnLabel="Annuleer"
            onCancel={handleOnCancel}
            submitBtnLabel="Opslaan"
          />
        </Form>
      </FormProvider>
    </Row>
  );
};
