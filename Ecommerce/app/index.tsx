import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useCallback } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import BottomTabNavigation from "../navigation/BottomTabNavigation";
import {
  Cart,
  NewArrivals,
  ProductDetails,
  LoginPage,
  Orders,
  Favourites,
  SignUp,
  MapScreen,
} from "../screens/index";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/constants";
import { StripeProvider } from "@stripe/stripe-react-native";

const Stack = createNativeStackNavigator();

export default function Page() {
  const [fontsLoaded] = useFonts({
    regular: require("../assets/fonts/Poppins-Regular.ttf"),
    light: require("../assets/fonts/Poppins-Light.ttf"),
    bold: require("../assets/fonts/Poppins-Bold.ttf"),
    medium: require("../assets/fonts/Poppins-Medium.ttf"),
    extrabold: require("../assets/fonts/Poppins-ExtraBold.ttf"),
    semibold: require("../assets/fonts/Poppins-SemiBold.ttf"),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <StripeProvider publishableKey="pk_test_51Pk7TjDNxCaue7GcjYIcYlFNXHCFMsuZ5pgdNaTmt22EDVRSA6JRCjkx4n9IZvGnYHJVNdy9TcqykyxxQlfNdAlW00F7jRNbta">
      <Stack.Navigator>
        <Stack.Screen
          name="Bottom Navigation"
          component={BottomTabNavigation}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Cart"
          component={Cart}
          options={({ navigation }) => ({
            headerTitle: "My Cart",
            headerStyle: {
              backgroundColor: "#f8f8f8",
            },
            headerTitleStyle: {
              fontWeight: "bold",
              fontSize: 20,
              color: "#333",
            },
            headerLeft: () => (
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={styles.headerButton}
              >
                <Ionicons
                  name="chevron-back-circle"
                  size={25}
                  color={COLORS.green}
                />
              </TouchableOpacity>
            ),
          })}
        />
        <Stack.Screen
          name="ProductDetails"
          component={ProductDetails}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ProductList"
          component={NewArrivals}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Login"
          component={LoginPage}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Orders"
          component={Orders}
          options={({ navigation }) => ({
            headerTitle: "My Orders",
            headerStyle: {
              backgroundColor: "#f8f8f8",
            },
            headerTitleStyle: {
              fontWeight: "bold",
              fontSize: 20,
              color: "#333",
            },
            headerLeft: () => (
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={styles.headerButton}
              >
                <Ionicons
                  name="chevron-back-circle"
                  size={25}
                  color={COLORS.green}
                />
              </TouchableOpacity>
            ),
          })}
        />
        <Stack.Screen
          name="Favourites"
          component={Favourites}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="SignUp"
          component={SignUp}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </StripeProvider>
  );
}

const styles = StyleSheet.create({
  headerButton: {
    marginRight: 10,
  },
});
