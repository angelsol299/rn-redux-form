import React, { useState, FC, useEffect } from "react";
import { View, Text, Button, TextInput, StyleSheet } from "react-native";
import RNPickerSelect from "react-native-picker-select";
import { useDispatch } from "react-redux";
import axios from "axios";
import AsyncStorage from "@react-native-community/async-storage";

interface FormProps {
  socialSecurityNumber: number;
  phoneNumber: number;
  email: string;
  country: string;
}

export const Form: FC<FormProps> = () => {
  const dispatch = useDispatch();
  const [formState, setFormState] = useState({
    socialSecurityNumber: "",
    phoneNumber: "",
    email: "",
    country: "",
  });
  const [warning, setWarning] = useState({
    phoneNumber: "",
    socialSecurityNumber: "",
    email: "",
    country: "",
  });
  const [fetchCountries, setFetchCountries] = useState();

  const saveToLocalStorage = async () => {
    try {
      await AsyncStorage.setItem("formState", JSON.stringify(formState));
    } catch (e) {
      console.log(e);
    }
  };

  const readLocalStorageData = async () => {
    try {
      const localStorage = await AsyncStorage.getItem("formState");
      const getLocalStorage = JSON.parse(localStorage);
      if (localStorage !== null) {
        setFormState({
          ...formState,
          socialSecurityNumber: getLocalStorage.socialSecurityNumber,
          phoneNumber: getLocalStorage.phoneNumber,
          email: getLocalStorage.email,
          country: getLocalStorage.country,
        });
      }
    } catch (e) {
      console.log(e);
    }
  };

  const clearLocalStorage = async () => {
    try {
      await AsyncStorage.setItem("formState", "");
    } catch (e) {
      console.log(e);
    }
  };

  const socialSecurityNumberRegex = /^(\d{8})[-|(\s)]{0,1}\d{4}$/;
  const isSocialSecurityNumberValidLength = socialSecurityNumberRegex.test(
    formState.socialSecurityNumber.trim()
  );
  const emailRegex = /^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/;
  const isEmailValid = emailRegex.test(formState.email.trim());
  const personalNumber: string = formState.socialSecurityNumber.substring(
    2,
    12
  );

  const isValidSocialSecurityNumber = (pnr: string) => {
    var number;
    var checksum = 0;
    for (var i = pnr.length - 1; i >= 0; i--) {
      number = parseInt(pnr.charAt(i));
      if (i % 2 === 1) {
        checksum += number;
      } else {
        checksum += number * 2 > 9 ? number * 2 - 9 : number * 2;
      }
    }
    return checksum % 10 == 0;
  };

  const checkFormValidation = () => {
    if (!isEmailValid) {
      setWarning({ ...warning, email: "Please enter a correct email address" });
    }
    if (!isSocialSecurityNumberValidLength) {
      setWarning({
        ...warning,
        socialSecurityNumber: "Please enter a correct social security number",
      });
    }
    if (formState.phoneNumber.length !== 10) {
      setWarning({
        ...warning,
        phoneNumber: "Please enter a 10 digits phone number",
      });
    }
    if (formState.country.length === 0) {
      setWarning({
        ...warning,
        country: "Please select a country",
      });
    }
  };

  const sendForm = () => {
    checkFormValidation();
    if (
      isSocialSecurityNumberValidLength &&
      isEmailValid &&
      formState.phoneNumber.length === 10 &&
      formState.country.length !== 0
    ) {
      dispatch({
        type: "SEND_FORM",
        payload: {
          socialSecurityNumber: formState.socialSecurityNumber,
          phoneNumber: formState.phoneNumber,
          email: formState.email,
          country: formState.country,
        },
      });
      clearLocalStorage();
      console.log("SUCCESS: now you are Rocker");
    } else {
      console.log("FAILED");
    }
  };

  const fetchCountryList = async () => {
    const { data } = await axios.get("https://restcountries.eu/rest/v2/all");
    setFetchCountries(data);
  };

  useEffect(() => {
    fetchCountryList();
    readLocalStorageData();
  }, []);

  const countryList = fetchCountries
    ? fetchCountries.map((country: any) => {
        return { id: country.name, label: country.name, value: country.name };
      })
    : [];

  useEffect(() => {
    saveToLocalStorage();
  }, [formState.country]);

  const CountrySelect = () => {
    const onCountryChangeHandler = (value: string) => {
      setFormState({ ...formState, country: value });
    };
    return (
      <View style={styles.selectStyled}>
        <RNPickerSelect
          onValueChange={(value) => onCountryChangeHandler(value)}
          items={countryList}
          value={formState.country}
          placeholder={{
            label: "Select a country",
            value: null,
          }}
        />
      </View>
    );
  };

  console.log({ formState });

  const handleInput = (event: any, name: string) => {
    event.persist();
    saveToLocalStorage();
    if (name === "socialSecurityNumber") {
      setFormState({
        ...formState,
        socialSecurityNumber: event.nativeEvent.text.replace(/[^0-9]/g, ""),
      });
      if (
        !isSocialSecurityNumberValidLength &&
        isValidSocialSecurityNumber(personalNumber)
      ) {
        setWarning({
          ...warning,
          socialSecurityNumber: "Please enter a valid social security number",
        });
      }
    }
    if (name === "phoneNumber") {
      setFormState({
        ...formState,
        phoneNumber: event.nativeEvent.text.replace(/[^0-9]/g, ""),
      });
      if (formState.phoneNumber.length !== 10) {
        setWarning({
          ...warning,
          phoneNumber: "Please enter a 10 digits phone number",
        });
      }
    }

    if (name === "email") {
      setFormState({
        ...formState,
        email: event.nativeEvent.text.toLowerCase(),
      });
      if (!isEmailValid) {
        setWarning({
          ...warning,
          email: "Please enter a valid email",
        });
      }
    }
  };

  console.log(isValidSocialSecurityNumber(personalNumber));

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Rocker Form</Text>
      <TextInput
        style={styles.textStyled}
        placeholder="YYYYMMDDNNNN"
        keyboardType="numeric"
        onChange={(event) => handleInput(event, "socialSecurityNumber")}
        value={formState.socialSecurityNumber}
        maxLength={12}
      />
      {!isValidSocialSecurityNumber(personalNumber) && (
        <Text style={styles.warning}>{warning.socialSecurityNumber}</Text>
      )}
      <TextInput
        style={styles.textStyled}
        placeholder="10 digit number"
        keyboardType="numeric"
        onChange={(event) => handleInput(event, "phoneNumber")}
        value={formState.phoneNumber}
        maxLength={10}
      />
      {formState.phoneNumber.length !== 10 && (
        <Text style={styles.warning}>{warning.phoneNumber}</Text>
      )}
      <TextInput
        style={styles.textStyled}
        placeholder="Enter your email address"
        onChange={(event) => handleInput(event, "email")}
        value={formState.email}
      />
      {!isEmailValid && formState.email.length > 0 && (
        <Text style={styles.warning}>{warning.email}</Text>
      )}
      <CountrySelect />
      {formState.country.length === 0 && (
        <Text style={styles.warning}>{warning.country}</Text>
      )}
      <Button title="Send" onPress={() => sendForm()} />
    </View>
  );
};

const styles = StyleSheet.create({
  textStyled: {
    height: 50,
    width: 200,
    borderColor: "gray",
    borderWidth: 1,
    marginTop: 10,
    padding: 5,
  },
  selectStyled: {
    width: 200,
    borderColor: "gray",
    borderWidth: 1,
    marginTop: 10,
    padding: 5,
  },
  warning: {
    color: "#ff0000",
  },
});
