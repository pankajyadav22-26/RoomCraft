import {
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import styles from "./profile.style";
import { StatusBar } from "expo-status-bar";
import { backendUrl, COLORS } from "@/constants";
import {
  AntDesign,
  MaterialCommunityIcons,
  SimpleLineIcons,
} from "@expo/vector-icons";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Profile = ({ navigation }) => {
  const [userData, setUserData] = useState(null);
  const [userLogin, setUserLogin] = useState(false);

  useEffect(() => {
    checkExistingUser();
  }, []);

  const checkExistingUser = async () => {
    const id = await AsyncStorage.getItem("id");
    if (!id) {
      navigation.navigate("Login");
      return;
    }

    const useId = `user${JSON.parse(id)}`;

    try {
      const currentUser = await AsyncStorage.getItem(useId);

      if (currentUser !== null) {
        const parsedData = JSON.parse(currentUser);
        setUserData(parsedData);
        setUserLogin(true);
      } else {
        navigation.navigate("Login");
      }
    } catch (error) {
      console.log("Error retrieving the data:", error);
    }
  };

  const userLogout = async () => {
    const id = await AsyncStorage.getItem("id");
    const useId = `user${JSON.parse(id)}`;

    try {
      await AsyncStorage.multiRemove([useId, "id"]);
      navigation.replace("Bottom Navigation");
    } catch (error) {
      console.log("Error logging Out the user:", error);
    }
  };

  const logout = () => {
    Alert.alert("Logout", "Are you sure you want to logout", [
      {
        text: "Cancel",
        onPress: () => console.log("cancel pressed"),
      },
      {
        text: "Continue",
        onPress: () => userLogout(),
      },
    ]);
  };

  const clearCache = () => {
    Alert.alert("Clear Cache", "Are you sure you want to clear the cache", [
      {
        text: "Cancel",
        onPress: () => console.log("cancel pressed -- cache"),
      },
      {
        text: "Continue",
        onPress: () => console.log("Continue Pressed -- cache"),
      },
      { defaultIndex: 1 },
    ]);
  };

  const deleteAccount = async () => {
    Alert.alert(
      "Delete Account",
      "Are you sure you want to delete your account?",
      [
        {
          text: "Cancel",
        },
        {
          text: "Continue",
          onPress: async () => {
            try {
              const id = await AsyncStorage.getItem("id");
              const userId = JSON.parse(id);
              const response = await axios.delete(
                `${backendUrl}/api/useroperations/delete/${userId}`
              );

              if (response.status === 200) {
                await AsyncStorage.removeItem("id");
                await AsyncStorage.removeItem("userData");

                checkExistingUser();
              }
            } catch (error) {
              console.error("Error deleting account:", error);
              Alert.alert(
                "Error",
                "There was an issue deleting your account. Please try again later."
              );
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        <View style={{ width: "100%" }}>
          <Image
            source={require("../assets/images/space.jpg")}
            style={styles.cover}
          />
        </View>
        <View style={styles.profileContainer}>
          <Image
            source={require("../assets/images/profile.jpeg")}
            style={styles.profile}
          />
          <Text style={styles.name}>
            {userLogin
              ? `${userData.username}`
              : "Please login into your account"}
          </Text>
          {userLogin ? (
            <View style={styles.loginBtn}>
              <Text style={styles.menuTxt}>{userData.email}</Text>
            </View>
          ) : (
            <TouchableOpacity
              onPress={() => navigation.navigate("Login")}
            >
              <View style={styles.loginBtn}>
                <Text style={styles.menuTxt}>Log In</Text>
              </View>
            </TouchableOpacity>
          )}
          <ScrollView>
            {userLogin ? (
              <View style={styles.menuWrapper}>
                <TouchableOpacity
                  onPress={() => navigation.navigate("Favourites")}
                >
                  <View style={styles.menuItem(0.2)}>
                    <MaterialCommunityIcons
                      name="heart-outline"
                      size={24}
                      color={COLORS.primary}
                    />
                    <Text style={styles.menuTxt}>Favourites</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate("Orders")}>
                  <View style={styles.menuItem(0.2)}>
                    <MaterialCommunityIcons
                      name="truck-flatbed"
                      size={24}
                      color={COLORS.primary}
                    />
                    <Text style={styles.menuTxt}>Orders</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate("Cart")}>
                  <View style={styles.menuItem(0.2)}>
                    <SimpleLineIcons
                      name="bag"
                      size={24}
                      color={COLORS.primary}
                    />
                    <Text style={styles.menuTxt}>Cart</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => clearCache()}>
                  <View style={styles.menuItem(0.2)}>
                    <MaterialCommunityIcons
                      name="cached"
                      size={24}
                      color={COLORS.primary}
                    />
                    <Text style={styles.menuTxt}>Clear cache</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => deleteAccount()}>
                  <View style={styles.menuItem(0.2)}>
                    <AntDesign
                      name="deleteuser"
                      size={24}
                      color={COLORS.primary}
                    />
                    <Text style={styles.menuTxt}>Delete Account</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => logout()}>
                  <View style={styles.menuItem(0.2)}>
                    <AntDesign name="logout" size={24} color={COLORS.primary} />
                    <Text style={styles.menuTxt}>LogOut</Text>
                  </View>
                </TouchableOpacity>
              </View>
            ) : null}
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Profile;