import {
  View,
  TouchableOpacity,
  TextInput,
  FlatList,
  Image,
  Text,
  ScrollView,
} from "react-native";
import React, { useState } from "react";
import styles from "./search.style";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather, Ionicons } from "@expo/vector-icons";
import { COLORS, SIZES } from "../constants/index";
import axios from "axios";
import { Camera } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import SearchTile from "../components/products/SearchTile.jsx";
import { backendUrl } from "@/constants";
import * as FileSystem from "expo-file-system";

const Search = () => {
  const [searchKey, setSearchKey] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [hasPermission, setHasPermission] = useState(null);
  const [imageUri, setImageUri] = useState(null);
  const [loading, setLoading] = useState(false);

  const convertToBase64 = async (uri) => {
    try {
      const base64Data = await FileSystem.readAsStringAsync(uri, {
        encoding: "base64",
      });
      return "data:image/jpeg;base64," + base64Data;
    } catch (error) {
      console.error("Error converting image to base64: ", error);
    }
  };

  const requestPermission = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    setHasPermission(status === "granted");
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.cancelled) {
      setImageUri(result.uri);
      processImage(result.uri);
    }
  };

  const takePicture = async () => {
    const result = await ImagePicker.launchCameraAsync({
      quality: 1,
      allowsEditing: true,
      base64: false,
    });

    if (result.assets?.length > 0) {
      const imageResult = result.assets[0];
      setImageUri(imageResult.uri);
      const base64Image = await convertToBase64(imageResult.uri);
      processImage(base64Image);
    }
  };

  const processImage = async (base64Image) => {
    if (!base64Image) {
      console.log("No base64 image provided, skipping processing.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `${backendUrl}/api/search/imageSearch`,
        {
          base64Image,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      // console.log("resposne", response.data.label)
      // setSearchKey(response.data.label);
      handleImageSearch(response.data.label);
    } catch (error) {
      console.error("Error processing image:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageSearch = async (imageLabel) => {
    // console.log("In image search")
    if (imageLabel === "") return;

    try {
      const response = await axios.get(
        `${backendUrl}/api/products/search/${imageLabel}`
      );
      setSearchResult(response.data);
    } catch (error) {
      console.error("Failed to get product", error);
    }
  };

  const handleSearch = async () => {
    if (searchKey.trim() === "") return;

    try {
      const response = await axios.get(
        `${backendUrl}/api/products/search/${searchKey}`
      );
      setSearchResult(response.data);
    } catch (error) {
      console.error("Failed to get product", error);
    }
  };

  React.useEffect(() => {
    requestPermission();
  }, []);

  return (
    <SafeAreaView>
      <ScrollView>
        <View style={styles.searchContainer}>
          <TouchableOpacity onPress={takePicture}>
            <Ionicons
              name="camera-outline"
              size={SIZES.xLarge}
              style={styles.searchIcon}
            />
          </TouchableOpacity>
          <View style={styles.searchWrapper}>
            <TextInput
              style={styles.searchInput}
              value={searchKey}
              onChangeText={setSearchKey}
              placeholder="What are you looking for"
            />
          </View>
          <View>
            <TouchableOpacity style={styles.searchBtn} onPress={handleSearch}>
              <Feather name="search" size={24} color={COLORS.offwhite} />
            </TouchableOpacity>
          </View>
        </View>

        {imageUri && !loading && (
          <Image source={{ uri: imageUri }} style={styles.imagePreview} />
        )}

        <View style={styles.container}>
          {loading && (
            <Text style={styles.processTxt}>Processing Image...</Text>
          )}
        </View>

        {searchResult.length === 0 ? (
          <View style={{ flex: 1 }}>
            <Image
              source={require("../assets/images/Pose23.png")}
              style={styles.searchImage}
            />
          </View>
        ) : (
          <FlatList
            data={searchResult}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => <SearchTile item={item} />}
            style={{ marginHorizontal: 12 }}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Search;
