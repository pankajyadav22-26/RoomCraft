import { StyleSheet } from "react-native";
import { COLORS, SIZES } from "../constants/index";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.lightGray,
    },
    appBarWrapper: {
        marginHorizontal: 20,
        marginTop: SIZES.small,
        marginBottom: 8,
    },
    appBar: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    location: {
        fontFamily: "semi-bold",
        fontSize: 16,
        color: COLORS.darkGray,
        marginLeft: 10,
    },
    cartContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-end",
    },
    cartCount: {
        position: "absolute",
        top: -6,
        right: -6,
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: COLORS.primary,
        justifyContent: "center",
        alignItems: "center",
        zIndex: 999,
    },
    cartNumber: {
        fontSize: 12,
        fontWeight: "bold",
        color: COLORS.white,
    },
    iconColor: {
        color: COLORS.primary,
    },
    footerSpace: {
        height: 75,
    },
    modalOverlay: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContent: {
        width: 300,
        padding: 20,
        backgroundColor: "white",
        borderRadius: 10,
        alignItems: "center",
        elevation: 10,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 20,
        color: COLORS.darkGray,
    },
});

export default styles;