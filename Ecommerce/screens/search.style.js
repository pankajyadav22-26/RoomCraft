import { StyleSheet } from "react-native";
import { COLORS, SIZES } from "../constants/index";

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: SIZES.small,
    backgroundColor: COLORS.secondary,
    borderRadius: SIZES.medium,
    marginVertical: SIZES.medium,
    height: 50,
  },
  searchIcon: {
    marginHorizontal: 10,
    color: COLORS.gray,
  },
  searchWrapper: {
    flex: 1,
    backgroundColor: COLORS.secondary,
    marginRight: SIZES.small,
    borderRadius: SIZES.small,
    paddingLeft: 10, // Adding padding for the input text
  },
  searchInput: {
    fontFamily: "regular",
    fontSize: 16,
    width: "100%",
    height: "100%",
    color: COLORS.gray,
    paddingVertical: 0, // To make the input feel more compact
  },
  searchBtn: {
    width: 50,
    height: "100%",
    borderRadius: SIZES.medium,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.primary,
  },
  searchImage: {
    resizeMode: "contain",
    width: SIZES.width - 50, // Adjust width based on the screen size
    height: SIZES.height - 240, // Adjust height dynamically
    opacity: 0.9,
    marginTop: 20, // To give space above the image
  },
  imagePreview: {
    width: SIZES.width - 30, // Give some margin for the preview
    height: 300, // Fixed height for image preview
    borderRadius: 10,
    marginBottom: 8, // Add space above the preview
    alignSelf: "center", // Center the preview image
  },
  captureBtn: {
    width: 200,
    height: 50,
    backgroundColor: COLORS.primary,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20, // Space between button and preview
    alignSelf: "center", // Center the button
  },
  processTxt: {
    fontSize: 20,
    color: 'blue',
    fontWeight: 'bold',
    marginTop: 20,
    textAlign: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default styles;