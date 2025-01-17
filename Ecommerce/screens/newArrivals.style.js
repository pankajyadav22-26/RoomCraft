import { StyleSheet } from 'react-native'
import {COLORS, SIZES} from '../constants/index'
const styles = StyleSheet.create({
    backContainer: {
        flex: 1,
        backgroundColor: COLORS.lightWhite,
    },
    wrapper: {
        flex: 1,
        backgroundColor: COLORS.lightWhite,
    },
    upperRow: {
        marginHorizontal: SIZES.large,
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
        position: "absolute",
        backgroundColor: COLORS.primary,
        borderRadius: SIZES.large,
        top: SIZES.large -18,
        zIndex: 999,
        width: SIZES.width -50,
    },
    heading:{
        fontFamily: "semibold",
        fontSize: SIZES.medium,
        color: COLORS.lightWhite,
        marginLeft: 5,
        marginTop: 3.5,
    }
})

export default styles