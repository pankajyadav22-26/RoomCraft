import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { SliderBox } from "react-native-image-slider-box";
import { COLORS } from "../../constants";

const CarouselSlide = () => {
  const slides = [
    "https://m.media-amazon.com/images/S/al-eu-726f4d26-7fdb/217ae159-9772-4972-8dd7-4c08c7969b76._CR0,0,1200,628_SX860_QL70_.jpg",
    "https://m.media-amazon.com/images/I/619uqfCV8uL._AC_UL640_FMwebp_QL65_.jpg",
    "https://m.media-amazon.com/images/I/71upF2JoOLL._AC_UL640_FMwebp_QL65_.jpg",
    "https://m.media-amazon.com/images/I/61VeyMP3gwL._AC_UL640_FMwebp_QL65_.jpg"
  ];
  return (
    <View style={styles.carouselSlideContainer}>
      <SliderBox
        images={slides}
        dotColor={COLORS.primary}
        inactiveDotColor={COLORS.secondary}
        ImageComponentStyle={{ borderRadius: 15, width: "90%"}}
        autoplay
        circleLoop
      />
    </View>
  );
};

export default CarouselSlide;

const styles = StyleSheet.create({
  carouselSlideContainer: {
    flex: 1,
    alignItems: "center",
  },
});
