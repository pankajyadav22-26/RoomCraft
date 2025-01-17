import { StyleSheet } from "react-native";
import { COLORS, SIZES } from "../../constants/index"

const styles = StyleSheet.create({
    container: {
        width: "100%"
    },
    welcomeTxt: (color, top, size) => ({
        fontFamily: "bold",
        fontSize: size,
        marginTop: top,
        color: color,
        marginHorizontal: 12
    }),
    searchContainer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginHorizontal: SIZES.small,
        backgroundColor: COLORS.secondary,
        borderRadius: SIZES.medium,
        marginTop: 4,
        marginBottom: 19,
        height: 45,
    },
    searchIcon: {
        marginTop: -1,
        marginHorizontal: 10,
        color: COLORS.gray,
    },
    searchWrapper: {
        flex: 1,
        backgroundColor: COLORS.secondary,
        marginRight: SIZES.small,
        borderRadius: SIZES.small
    },
    searchInput: {
        fontFamily: "regular",
        width: "100%",
        height: "100%",
    },
    searchBtn: {
        width: 50,
        height: "100%",
        borderRadius: SIZES.medium,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: COLORS.primary,
    }
})

export default styles