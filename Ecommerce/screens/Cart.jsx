import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, FlatList, Image, ActivityIndicator, Button, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";
import { backendUrl } from "@/constants";
import { useStripe } from '@stripe/stripe-react-native';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [loadingPay, setLoadingPay] = useState(false);

  const handleOrderCreation = async (customerId) => {
    try {
      const userId = await AsyncStorage.getItem("id");
      const parsedUserId = JSON.parse(userId);
  
      if (!parsedUserId) {
        alert("Please log in first");
        return;
      }
  
      if (!customerId) {
        alert("Customer ID is missing. Please complete payment setup and try again.");
        return;
      }
  
      const payload = {
        cartItems: cartItems.map((item) => ({
          cartItem: {
            _id: item.cartItem._id,
            price: item.cartItem.price,
          },
          quantity: item.quantity,
        })),
        userId: parsedUserId,
        customerId,
        totalAmount: calculateTotal(),
        paymentStatus: "Paid",
      };
  
      await axios.post(`${backendUrl}/api/orders/createOrder`, payload);
  
      await axios.post(`${backendUrl}/api/cart/clearCart/${parsedUserId}`);

      setCartItems([]);
      alert("Order successfully created, and cart has been cleared!");
    } catch (err) {
      console.error("Error in handleOrderCreation:", err);
      alert("An error occurred while creating your order.");
    }
  };
  
  const fetchPaymentSheetParams = async () => {
    try {
      const response = await axios.post(`${backendUrl}/api/payment/payment-sheet`, {
        amount: calculateTotal() * 100,
      });
      const { paymentIntent, ephemeralKey, customer } = response.data;

      return {
        paymentIntent,
        ephemeralKey,
        customer,
      };
    } catch (error) {
      console.error("Error fetching payment sheet parameters:", error);
      throw new Error("Failed to fetch payment sheet parameters");
    }
  };
  
  const initializePaymentSheet = async () => {
    try {
      const { paymentIntent, ephemeralKey, customer } = await fetchPaymentSheetParams();
  
      const { error } = await initPaymentSheet({
        merchantDisplayName: "Example, Inc.",
        customerId: customer,
        customerEphemeralKeySecret: ephemeralKey,
        paymentIntentClientSecret: paymentIntent,
        allowsDelayedPaymentMethods: true,
        defaultBillingDetails: {
          name: 'Jane Doe',
        },
      });
  
      if (error) {
        console.error("Error initializing payment sheet:", error);
        alert("Failed to initialize payment sheet. Please try again.");
        return;
      }
      setLoadingPay(true);
    } catch (err) {
      console.error("Error in initializePaymentSheet:", err.message || err);
      alert("An error occurred while setting up payment. Please try again.");
    }
  };
  
  const openPaymentSheet = async () => {
    const { error } = await presentPaymentSheet();
  
    if (error) {
      Alert.alert(`Error code: ${error.code}`, error.message);
    } else {
      const { customer } = await fetchPaymentSheetParams();
      handleOrderCreation(customer);
    }
  };

  const fetchCart = async () => {
    try {
      const id = await AsyncStorage.getItem("id");
      const userId = JSON.parse(id);

      if (!userId) {
        throw new Error("User ID not found. Please log in again.");
      }

      const response = await axios.get(`${backendUrl}/api/cart/findCart/${userId}`);
      const cartData = response.data;

      const products = cartData.length > 0 ? cartData[0].products : [];
      setCartItems(products);
    } catch (err) {
      console.error("Error fetching cart:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteCartItem = async (cartItemId) => {
    try {
      setLoading(true);
      await axios.delete(`${backendUrl}/api/cart/deleteItem/${cartItemId}`);
      setCartItems((prevItems) => prevItems.filter(item => item._id !== cartItemId));
    } catch (err) {
      console.error("Error deleting cart item:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const decrementCartItem = async (cartItemId) => {
    try {
      setLoading(true);
  
      const id = await AsyncStorage.getItem("id");
      const userId = `user${JSON.parse(id)}`;
      const currentUser = await AsyncStorage.getItem(userId);
      if (currentUser === null) {
        navigation.navigate("Login");
        return;
      }
  
      const parsedData = JSON.parse(currentUser);
  
      await axios.post(`${backendUrl}/api/cart/decItem`, {
        userId: parsedData._id,
        cartItem: cartItemId._id,
      });
  
      setCartItems((prevItems) =>
        prevItems
          .map((item) => {
            if (item._id === cartItemId) {
              return {
                ...item,
                quantity: item.quantity - 1,
              };
            }
            return item;
          })
          .filter((item) => item.quantity > 0)
      );
    } catch (err) {
      console.error("Error decrementing cart item:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const incrementCartItem = async (cartItemId) => {
    try {
      setLoading(true);
  
      const id = await AsyncStorage.getItem("id");
      const userId = `user${JSON.parse(id)}`;
      const currentUser = await AsyncStorage.getItem(userId);
      if (currentUser === null) {
        navigation.navigate("Login");
        return;
      }
  
      const parsedData = JSON.parse(currentUser);
  
      await axios.post(`${backendUrl}/api/cart/incItem`, {
        userId: parsedData._id,
        cartItem: cartItemId._id,
      });
  
      setCartItems((prevItems) =>
        prevItems
          .map((item) => {
            if (item._id === cartItemId) {
              return {
                ...item,
                quantity: item.quantity + 1,
              };
            }
            return item;
          })
      );
    } catch (err) {
      console.error("Error incrementing cart item:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      const price = parseFloat(item.cartItem.price);
      return total + price * item.quantity;
    }, 0).toFixed(2);
  };

  useEffect(() => {
    fetchCart();
  }, [deleteCartItem, decrementCartItem, incrementCartItem]);

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

  if (!cartItems.length) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.emptyText}>Your cart is empty.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={cartItems}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => {
          const { cartItem, quantity } = item;
          return (
            <View style={styles.cartItem}>
              <Image source={{ uri: cartItem.imageUrl }} style={styles.image} />
              <View style={styles.details}>
                <Text style={styles.title} numberOfLines={1}>{cartItem.title}</Text>
                <Text style={styles.price}>{"\u20B9"} {cartItem.price}</Text>
                <Text style={styles.quantity}>Quantity: {quantity}</Text>
                <Text style={styles.supplier}>Supplier: {cartItem.supplier}</Text>
              </View>
              <View style={styles.actions}>
                <TouchableOpacity
                  style={styles.decrementButton}
                  onPress={() => decrementCartItem(cartItem)}
                >
                  <Text style={styles.decrementButtonText}>-</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.incrementButton}
                  onPress={() => incrementCartItem(cartItem)}
                >
                  <Text style={styles.incrementButtonText}>+</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => deleteCartItem(item._id)}
                >
                  <Text style={styles.deleteButtonText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        }}
        showsVerticalScrollIndicator={false} // Hides vertical scroll bar
        showsHorizontalScrollIndicator={false} // Hides horizontal scroll bar
      />
      <View style={styles.footer}>
        <Text style={styles.totalText}>Total: {"\u20B9"} {calculateTotal()}</Text>
        <Button title="Buy Now" onPress={ async () => {
          await initializePaymentSheet().then(async()=> {
            await openPaymentSheet()
          })
        }} />
      </View>
    </SafeAreaView>
  );
};

export default Cart;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: "#f9f9f9",
  },
  cartItem: {
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
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333333",
    marginBottom: 5,
  },
  price: {
    fontSize: 16,
    color: "#4caf50",
    marginBottom: 5,
  },
  quantity: {
    fontSize: 14,
    color: "#666666",
  },
  supplier: {
    fontSize: 12,
    color: "#888888",
    marginTop: 5,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
  },
  decrementButton: {
    backgroundColor: "#f7c6c6",
    padding: 8,
    borderRadius: 8,
    marginRight: 5,
    borderWidth: 1,
    borderColor: "#f2a7a7",
  },
  decrementButtonText: {
    color: "#d32f2f",
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
  },
  incrementButton: {
    backgroundColor: "#d4f8d4",
    padding: 8,
    borderRadius: 8,
    marginRight: 5,
    borderWidth: 1,
    borderColor: "#a5d6a7",
  },
  incrementButtonText: {
    color: "#388e3c",
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
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
  footer: {
    marginTop: 20,
    padding: 16,
    backgroundColor: "#ffffff",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  totalText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333333",
    textAlign: "center",
    marginBottom: 10,
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