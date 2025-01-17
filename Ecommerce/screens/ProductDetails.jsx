import React, { useState, useEffect } from "react";
import { Text, TouchableOpacity, View, Image, ScrollView } from "react-native";
import {
  Fontisto,
  Ionicons,
  MaterialCommunityIcons,
  SimpleLineIcons,
} from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import styles from "./productDetail.style";
import { COLORS, SIZES } from "@/constants";
import { useRoute } from "@react-navigation/native";
import axios from "axios";
import { backendUrl } from "@/constants";

const ProductDetails = ({ navigation }) => {
  const route = useRoute();
  const { item } = route.params;
  const [count, setCount] = useState(1);
  const [userData, setUserData] = useState(null);

  const increment = () => setCount(count + 1);

  const decrement = () => {
    if (count > 1) {
      setCount(count - 1);
    }
  };

  const checkExistingUser = async () => {
    const id = await AsyncStorage.getItem("id");
    const userId = `user${JSON.parse(id)}`;
    try {
      const currentUser = await AsyncStorage.getItem(userId);
      if (currentUser !== null) {
        const parsedData = JSON.parse(currentUser);
        setUserData(parsedData);
      } else {
        navigation.navigate("Login");
      }
    } catch (error) {
      console.log("Error retrieving the data:", error);
    }
  };

  const addToCart = async () => {
    if (!userData) {
      console.log("User not logged in");
      return;
    }

    try {
      const response = await axios.post(`${backendUrl}/api/cart/addToCart`, {
        userId: userData._id,
        cartItem: item._id,
        quantity: count,
      });

      if (response.status === 200) {
        alert("Product added to cart");
      } else {
        alert("Failed to add product to cart");
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("Something went wrong. Please try again later.");
    }
  };

  const toggleFavorite = async () => {
    if (!userData) {
      console.log("User not logged in");
      return;
    }
  
    try {
      const response = await axios.post(`${backendUrl}/api/favorites/add`, {
        userId: userData._id,
        productId: item._id,
      });
  
      if (response.status === 200) {
        alert("Product added to favorites");
      }
    } catch (error) {
      // Check for the specific 400 error (Product already in favorites)
      if (error.response && error.response.status === 400) {
        alert("Product is already in your favorites");
      } else {
        console.error("Error updating favorites:", error);
        alert("Something went wrong. Please try again later.");
      }
    }
  };

  useEffect(() => {
    // Only call checkExistingUser once when the component mounts
    checkExistingUser();
  }, []);
  
  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.upperRow}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back-circle" size={30} />
          </TouchableOpacity>

          <TouchableOpacity onPress={toggleFavorite}>
            <Ionicons
              name="heart"
              size={30}
              color={COLORS.gray} // No color change on click
            />
          </TouchableOpacity>
        </View>
        <Image
          source={{
            uri: item.imageUrl,
          }}
          style={styles.image}
        />
        <View style={styles.details}>
          <View style={styles.titleRow}>
            <Text style={styles.title}>{item.title}</Text>
            <View style={styles.priceWrapper}>
              <Text style={styles.price}>{"\u20B9"} {item.price}</Text>
            </View>
          </View>
          <View style={styles.ratingRow}>
            <View style={styles.rating}>
              {[1, 2, 3, 4, 5].map((index) => (
                <Ionicons key={index} name="star" size={24} color="gold" />
              ))}
              <Text style={styles.ratingText}> (4.9)</Text>
            </View>
            <View style={styles.rating}>
              <TouchableOpacity onPress={() => increment()}>
                <SimpleLineIcons name="plus" size={20} />
              </TouchableOpacity>
              <Text style={styles.ratingText}> {count}</Text>
              <TouchableOpacity onPress={() => decrement()}>
                <SimpleLineIcons name="minus" size={20} />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.descriptionWrapper}>
            <Text style={styles.description}>Description</Text>
            <Text style={styles.descriptionText}>
              {item.description}
            </Text>
          </View>
          <View style={{ marginBottom: SIZES.small }}>
            <View style={styles.location}>
              <View style={{ flexDirection: "row" }}>
                <Ionicons name="location-outline" size={20} />
                <Text>{item.product_location}</Text>
              </View>
              <View style={{ flexDirection: "row" }}>
                <MaterialCommunityIcons
                  name="truck-delivery-outline"
                  size={20}
                />
                <Text> Free Delivery</Text>
              </View>
            </View>
          </View>
          <View style={styles.cartRow}>
            <TouchableOpacity onPress={() => {}} style={styles.cartBtn}>
              <Text style={styles.cartTitle}>Buy Now</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={addToCart} style={styles.addToCart}>
              <Fontisto
                name="shopping-bag"
                size={22}
                color={COLORS.lightWhite}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default ProductDetails;