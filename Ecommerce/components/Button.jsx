import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { COLORS, SIZES } from "../constants/index";

const Button = ({ title, onPress, isValid, loader}) => {
  return (
    <TouchableOpacity
      style={styles.btnStyle(isValid === false ? COLORS.gray : COLORS.primary)}
      onPress={() => onPress()}
    >
      {loader === false ? ( <Text style={styles.btnTxt}>{title}</Text>) : (<ActivityIndicator/>)}
     
    </TouchableOpacity>
  );
};

export default Button;

const styles = StyleSheet.create({
  btnTxt: {
    fontFamily: "bold",
    color: COLORS.white,
    fontSize: 18,
  },
  btnStyle: (backgroundColor) => ({
    height: 50,
    width: "100%",
    marginVertical: 20,
    backgroundColor: backgroundColor,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
  }),
});
