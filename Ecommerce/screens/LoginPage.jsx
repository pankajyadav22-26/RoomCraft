import {
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { BackBtn, Button } from "../components/index";
import styles from "./loginPage.style";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { COLORS } from "@/constants";
import axios from "axios";
import { backendUrl } from "@/constants";

const validationSchema = Yup.object().shape({
  password: Yup.string()
    .min(8, "Must be atleast 8 characters")
    .required("Required"),
  email: Yup.string().email("Invalid email address").required("Required"),
});

const LoginPage = ({ navigation }) => {
  const [loader, setLoader] = useState(false);
  const [responseData, setResponseData] = useState(null);
  const [obsecureText, setObsecureText] = useState(false);

  const invalidForm = () => {
    Alert.alert("Invalid Form", "Please provide all required fields", [
      {
        text: "Cancel",
        onPress: () => {},
      },
      {
        text: "Continue",
        onPress: () => {},
      },
      { defaultIndex: 1 },
    ]);
  };

  const login = async (values) => {
    setLoader(true);
    try {
      const response = await axios.post(
        `${backendUrl}/api/user/login/`,
        values
      );
  
      if (response && response.data) {
        const responseData = response.data;
        setLoader(false);
        setResponseData(responseData);
  
        await AsyncStorage.setItem(
          `user${responseData._id}`,
          JSON.stringify(responseData)
        );
        await AsyncStorage.setItem("id", JSON.stringify(responseData._id));
        navigation.replace("Bottom Navigation");
      }
    } catch (error) {
      if (error.response) {
        const errorMessage = error.response.data.message || "An error occurred";
        if (error.response.status === 401) {
          Alert.alert("Invalid Credentials", errorMessage, [
            { text: "Try Again" },
          ]);
        } else {
          Alert.alert("Error", errorMessage);
        }
      } else {
        console.error("An unexpected error occurred:", error);
        Alert.alert(
          "Error",
          "Unable to connect to the server. Please try again later."
        );
      }
    } finally {
      setLoader(false);
    }
  };

  return (
    <ScrollView>
      <SafeAreaView style={{ marginHorizontal: 20,  }}>
        <View style={{ marginBottom: 40 }}>
          <BackBtn onPress={() => navigation.goBack()} />
          <Image
            source={require("../assets/images/bk.png")}
            style={styles.loginCover}
          />
          <Text style={styles.title}>Unlimited Luxurious Furniture</Text>
          <Formik
            initialValues={{ email: "", password: "" }}
            validationSchema={validationSchema}
            onSubmit={(values, { setSubmitting }) => {
              login(values, { setSubmitting });
            }}
          >
            {({
              handleChange,
              handleBlur,
              touched,
              handleSubmit,
              values,
              errors,
              isValid,
              setFieldTouched,
            }) => (
              <View>
                <View style={styles.wrapper}>
                  <Text style={styles.label}>Email</Text>
                  <View
                    style={styles.inputWrapper(
                      touched.email ? COLORS.secondary : COLORS.offwhite
                    )}
                  >
                    <MaterialCommunityIcons
                      name="email-outline"
                      size={20}
                      color={COLORS.gray}
                      style={styles.iconStyle}
                    />
                    <TextInput
                      placeholder="Email"
                      onFocus={() => {
                        setFieldTouched("email");
                      }}
                      onBlur={() => {
                        setFieldTouched("email", "");
                      }}
                      value={values.email}
                      onChangeText={handleChange("email")}
                      autoCapitalize="none"
                      autoCorrect={false}
                      style={{ flex: 1 }}
                    />
                  </View>
                  {touched.email && errors.email && (
                    <Text style={styles.errorMessage}>{errors.email}</Text>
                  )}
                </View>
                <View style={styles.wrapper}>
                  <Text style={styles.label}>Password</Text>
                  <View
                    style={styles.inputWrapper(
                      touched.password ? COLORS.secondary : COLORS.offwhite
                    )}
                  >
                    <MaterialCommunityIcons
                      name="lock-outline"
                      size={20}
                      color={COLORS.gray}
                      style={styles.iconStyle}
                    />
                    <TextInput
                      secureTextEntry={!obsecureText}
                      placeholder="Password"
                      onFocus={() => {
                        setFieldTouched("password");
                      }}
                      onBlur={() => {
                        setFieldTouched("password", "");
                      }}
                      value={values.password}
                      onChangeText={handleChange("password")}
                      autoCapitalize="none"
                      autoCorrect={false}
                      style={{ flex: 1 }}
                    />
                    <TouchableOpacity
                      onPress={() => {
                        setObsecureText(!obsecureText);
                      }}
                    >
                      <MaterialCommunityIcons
                        name={obsecureText ? "eye-outline" : "eye-off-outline"}
                        size={18}
                      />
                    </TouchableOpacity>
                  </View>
                  {touched.password && errors.password && (
                    <Text style={styles.errorMessage}>{errors.password}</Text>
                  )}
                </View>

                <Button
                  loader={loader}
                  title={"LogIn"}
                  onPress={isValid ? handleSubmit : invalidForm}
                  isValid={isValid}
                />
                <Text style={styles.registration}>Do not have an account?</Text>
                <Text
                  style={styles.registration2}
                  onPress={() => {
                    navigation.navigate("SignUp");
                  }}
                >
                  Create an Account
                </Text>
              </View>
            )}
          </Formik>
        </View>
      </SafeAreaView>
    </ScrollView>
  );
};

export default LoginPage;
