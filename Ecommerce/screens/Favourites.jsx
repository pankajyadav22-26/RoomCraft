import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";
import { useNavigation } from "@react-navigation/native"; // Import useNavigation for navigation
import { BackBtn } from "@/components";
import { backendUrl } from "@/constants";

const Favourites = () => {
  const navigation = useNavigation(); // Hook to access navigation prop
  const [favourites, setFavourites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchFavorites = async () => {
    try {
      const id = await AsyncStorage.getItem("id");
      let userId;
      try {
        userId = JSON.parse(id);
      } catch (e) {
        throw new Error("Invalid user ID format. Please log in again.");
      }

      if (!userId) {
        throw new Error("User ID not found. Please log in again.");
      }

      const response = await axios.get(
        `${backendUrl}/api/favorites/get/${userId}`
      );
      const favoritesData = response.data;

      // Safeguard to avoid setting invalid or empty data
      if (favoritesData && favoritesData.favorites) {
        setFavourites(favoritesData.favorites.map((fav) => fav.product || {}));
      } else {
        setFavourites([]);
      }
    } catch (err) {
      console.error("Error fetching favorites:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Delete a favorite item
  const deleteFavoriteItem = async (favoriteId, productId) => {
    try {
      setLoading(true);

      // Get the user ID from AsyncStorage
      const id = await AsyncStorage.getItem("id");
      let userId;
      try {
        userId = JSON.parse(id);
      } catch (e) {
        throw new Error("Invalid user ID format. Please log in again.");
      }

      if (!userId) {
        throw new Error("User ID not found. Please log in again.");
      }

      // Send request to remove the favorite
      const response = await axios.post(`${backendUrl}/api/favorites/remove`, {
        userId,
        productId,
      });

      // Check if the deletion was successful
      if (response.status === 200) {
        // Update the favorites list by removing the deleted product
        setFavourites((prevItems) =>
          prevItems.filter((item) => item._id !== favoriteId)
        );
      }
    } catch (err) {
      console.error("Error deleting favorite item:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </SafeAreaView>
    );
  }

  if (!favourites || favourites.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <View style={styles.backButtonWrapper}>
            <BackBtn onPress={() => navigation.goBack()} />
          </View>
          <Text style={styles.title}>Favourites</Text>
        </View>
        <Text style={styles.emptyText}>Your favourites list is empty.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.backButtonWrapper}>
          <BackBtn onPress={() => navigation.goBack()} />
        </View>
        <Text style={styles.title}>Favourites</Text>
      </View>
      <FlatList
        data={favourites}
        keyExtractor={(item) => item._id ? item._id : Math.random().toString()} // Ensure unique key
        renderItem={({ item }) => {
          if (!item || !item._id) {
            return null; // Skip rendering invalid items
          }
          return (
            <View style={styles.favoriteItem}>
              <Image source={{ uri: item.imageUrl }} style={styles.image} />
              <View style={styles.details}>
                <Text style={styles.title} numberOfLines={1}>
                  {item.title}
                </Text>
                <Text style={styles.price}>
                  {"\u20B9"} {item.price}
                </Text>
                <Text style={styles.supplier}>Supplier: {item.supplier}</Text>
              </View>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => deleteFavoriteItem(item._id, item._id)}
              >
                <Text style={styles.deleteButtonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          );
        }}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

export default Favourites;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: "#f9f9f9",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
    backgroundColor: "#ffffff", // Add a background to the header box
    borderRadius: 8, // Border radius to make the box rounded
    paddingVertical: 10, // Vertical padding inside the box
    paddingHorizontal: 15, // Horizontal padding for the box
    elevation: 3, // Add shadow effect for better visibility
    borderWidth: 1, // Border width for the box outline
    borderColor: "#e0e0e0", // Border color of the box
  },
  backButtonWrapper: {
    top: -29,
    left: -10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333333",
    textAlign: "center",
    flex: 1, // Ensures the title takes up available space and stays centered
  },
  favoriteItem: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
    padding: 15,
    backgroundColor: "#ffffff",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 15,
    borderWidth: 1,
    borderColor: "#dddddd",
  },
  details: {
    flex: 1,
    justifyContent: "center",
  },
  deleteButton: {
    backgroundColor: "#ffebee",
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ffcdd2",
  },
  deleteButtonText: {
    color: "#b71c1c",
    fontWeight: "bold",
    fontSize: 14,
    textAlign: "center",
  },
  emptyText: {
    fontSize: 18,
    textAlign: "center",
    marginTop: 30,
    color: "#999999",
  },
  errorText: {
    fontSize: 18,
    textAlign: "center",
    marginTop: 20,
    color: "#d32f2f",
  },
});