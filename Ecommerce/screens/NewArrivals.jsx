import { TouchableOpacity, View, Text} from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import styles from "./newArrivals.style";
import { COLORS } from "@/constants";
import { ProductList } from "../components/index";

const NewArrivals = ({navigation}) => {
  return (
    <SafeAreaView style={styles.backContainer}>
      <View style={styles.wrapper}>
        <View style={styles.upperRow}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back-circle" size={30} color={COLORS.lightWhite}/>
          </TouchableOpacity>
          <Text style = {styles.heading}>Products</Text>
        </View>
        <ProductList />
      </View>
    </SafeAreaView>
  );
};

export default NewArrivals;
