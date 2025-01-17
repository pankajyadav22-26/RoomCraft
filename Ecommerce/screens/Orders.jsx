import React, { useEffect, useState } from 'react';
import { Text, View, ActivityIndicator, FlatList, StyleSheet, Image, TouchableOpacity } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { backendUrl } from "@/constants"; // Update this to your actual backend URL
import { Ionicons } from '@expo/vector-icons'; // Add icons
import styles from './orders.style';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchProductDetails = async (productId) => {
    try {
      const response = await axios.get(`${backendUrl}/api/products/${productId}`);
      return response.data; // Returns product data including name and image
    } catch (err) {
      console.error('Error fetching product details:', err);
      setError('Error fetching product details');
    }
  };

  const fetchOrders = async () => {
    try {
      const id = await AsyncStorage.getItem('id');
      const userId = JSON.parse(id);

      if (!userId) {
        throw new Error('User ID not found. Please log in again.');
      }

      const response = await axios.get(`${backendUrl}/api/orders/getorders/${userId}`);
      const ordersData = response.data;

      const ordersWithProductDetails = await Promise.all(
        ordersData.map(async (order) => {
          const productDetails = await fetchProductDetails(order.productId._id);
          return {
            ...order,
            productDetails,
          };
        })
      );

      setOrders(ordersWithProductDetails);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    setError('');
    setLoading(true);
    fetchOrders();
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#6e7bff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
          <Ionicons name="refresh" size={24} color="red" />
          <Text style={styles.retryText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={orders}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.orderItem}>
            {item.productDetails?.imageUrl && (
              <Image
                source={{ uri: item.productDetails?.imageUrl}}
                style={styles.productImage}
              />
            )}
            <View style={styles.orderDetails}>
              <Text style={styles.productName}>{item.productDetails?.title}</Text>
              <Text style={styles.orderText}>Order ID: {item._id}</Text>
              <Text style={styles.orderText}>Quantity: {item.quantity}</Text>
              <Text style={styles.totalPrice}>Total Price: {"\u20B9"} {item.subtotal}</Text>
              <Text style={styles.orderText}>Delivery Status: {item.delivery_status}</Text>
              <Text style={styles.orderText}>Payment Status: {item.payment_status}</Text>
            </View>
          </View>
        )}
      />
    </View>
  );
};

export default Orders;