import React, { useState } from 'react';
import { View, Text, StyleSheet, Button, Alert } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';

const MapScreen = ({ navigation }) => {
  const [selectedLocation, setSelectedLocation] = useState(null);

  // Request location permission
  const requestLocationPermission = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'You need to grant location permission to proceed.');
      return false;
    }
    return true;
  };

  const handleSelectLocation = async (event) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    setSelectedLocation({ latitude, longitude });

    // Perform reverse geocoding to get city and state
    try {
      const hasPermission = await requestLocationPermission();
      if (!hasPermission) return;

      const reverseGeocode = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      if (reverseGeocode.length > 0) {
        const { city, region } = reverseGeocode[0];
        const formattedLocation = `${city}, ${region}`;
        Alert.alert('Selected Location', `City: ${city}, State: ${region}`);
      } else {
        Alert.alert('Error', 'Could not find city and state for this location.');
      }
    } catch (error) {
      console.error('Error reverse geocoding location:', error);
      Alert.alert('Error', 'Failed to fetch location details.');
    }
  };

  const handleConfirmLocation = () => {
    if (selectedLocation) {
      console.log("In handle Confirmation", selectedLocation);
      navigation.navigate('Bottom Navigation', {
        selectedLocation: selectedLocation, // Pass the location data (latitude, longitude)
      });
    } else {
      alert('Please select a location first.');
    }
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 20.5937, // Approximate center of India
          longitude: 78.9629,
          latitudeDelta: 15, // Adjust zoom level
          longitudeDelta: 15,
        }}
        onPress={handleSelectLocation} // Handle taps to select location
      >
        {selectedLocation && (
          <Marker coordinate={selectedLocation} title="Selected Location" />
        )}
      </MapView>
      <View style={styles.buttonContainer}>
        <Button title="Confirm Location" onPress={handleConfirmLocation} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
});

export default MapScreen;