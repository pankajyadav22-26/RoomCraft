import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Button,
  FlatList,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from './home.style';
import { Fontisto, Ionicons } from '@expo/vector-icons';
import { Welcome, Heading, CarouselSlide, ProductRow, TopProducts } from '../components';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import * as Location from 'expo-location';
import { backendUrl } from '@/constants';

const Home = () => {
  const [userData, setUserData] = useState(null);
  const [userLogin, setUserLogin] = useState(false);
  const [cartLength, setCartLength] = useState(0);
  const [loading, setLoading] = useState(false);
  const [currLocation, setCurrLocation] = useState('Dwarka, New Delhi');
  const [locationModalVisible, setLocationModalVisible] = useState(false);

  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      checkExistingUser();
    }, [])
  );

  const checkExistingUser = async () => {
    try {
      const id = await AsyncStorage.getItem('id');
      const useId = `user${JSON.parse(id)}`;

      const currentUser = await AsyncStorage.getItem(useId);
      if (currentUser !== null) {
        const parsedData = JSON.parse(currentUser);
        setUserData(parsedData);
        setCurrLocation(parsedData.location);
        setUserLogin(true);
        await fetchCart(JSON.parse(id));
      } else {
        setUserData(null);
        setUserLogin(false);
        setCartLength(0);
      }
    } catch (error) {
      console.log('Error retrieving the data:', error);
      setUserData(null);
      setUserLogin(false);
      setCartLength(0);
    }
  };

  const fetchCart = async (userId) => {
    try {
      setLoading(true);

      const response = await axios.get(`${backendUrl}/api/cart/findCart/${userId}`);
      if (response.data.length > 0) {
        const cartData = response.data[0];
        const products = cartData.products || [];
        setCartLength(products.length);
      } else {
        setCartLength(0);
      }
    } catch (err) {
      console.error('Error fetching cart:', err);
      setCartLength(0);
    } finally {
      setLoading(false);
    }
  };

  const requestLocationPermission = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      alert('Permission to access location was denied');
      return false;
    }
    return true;
  };

  const fetchCurrentLocation = async () => {
    const hasPermission = await requestLocationPermission();
    if (!hasPermission) return;

    try {
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const { latitude, longitude } = location.coords;

      const reverseGeocode = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      if (reverseGeocode.length > 0) {
        const { city, region } = reverseGeocode[0];
        const formattedLocation = `${city}, ${region}`;
        setCurrLocation(formattedLocation);
      } else {
        setCurrLocation('Location not found');
      }
    } catch (error) {
      console.error('Error fetching location:', error);
      alert('Could not fetch location. Please try again.');
    } finally {
      setLocationModalVisible(false);
    }
  };

  const handleLocationClick = () => {
    setLocationModalVisible(true);
  };

  // Use FlatList to handle the parent container scrolling
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.appBarWrapper}>
        <View style={styles.appBar}>
          <TouchableOpacity onPress={handleLocationClick}>
            <Ionicons name="location-outline" size={28} color={styles.iconColor.color} />
          </TouchableOpacity>
          <Text style={styles.location}>{currLocation}</Text>
          <View style={styles.cartContainer}>
            <View style={styles.cartCount}>
              <Text style={styles.cartNumber}>{cartLength}</Text>
            </View>
            <TouchableOpacity onPress={() => navigation.navigate('Cart')}>
              <Fontisto name="shopping-bag" size={28} color={styles.iconColor.color} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <FlatList
        data={[1]}  // Dummy data to allow FlatList to scroll
        keyExtractor={(item, index) => String(index)}
        renderItem={() => (
          <>
            <Welcome />
            <CarouselSlide />
            <Heading />
            <ProductRow />
            <TopProducts />
          </>
        )}
        ListFooterComponent={<View style={styles.footerSpace} />}
      />

      <Modal
        animationType="slide"
        transparent={true}
        visible={locationModalVisible}
        onRequestClose={() => setLocationModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Location</Text>
            <Button style = {styles.liveTitle} title="Use Live Location" onPress={fetchCurrentLocation} />
            <Button
              title="Cancel"
              onPress={() => setLocationModalVisible(false)}
              color="red"
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default Home;