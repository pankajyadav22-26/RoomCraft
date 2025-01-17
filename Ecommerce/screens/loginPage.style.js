import { COLORS, SIZES } from '@/constants'
import { StyleSheet } from 'react-native'
const styles = StyleSheet.create({
    loginCover: {
        height: SIZES.height/2.1,
        width: SIZES.width-60,
        resizeMode: "contain",
        marginBottom: SIZES.large,
    },
    title: {
        fontFamily: "bold",
        fontSize: SIZES.large,
        color: COLORS.primary,
        alignItems: "center",
        marginBottom: SIZES.large,
    },
    wrapper: {
        marginBottom: 20,
        // marginHorizontal: 20,
    },
    label: {
        fontFamily: "regular",
        fontSize: SIZES.xSmall,
        marginBottom: 5,
        marginEnd: 5,
        textAlign: "right",
    },
    inputWrapper: (borderColor) => ({
        borderColor: borderColor,
        backgroundColor: COLORS.lightWhite,
        borderWidth: 1,
        height: 50,
        borderRadius: 12,
        flexDirection: "row",
        paddingHorizontal: 15,
        alignItems: "center"
    }),
    iconStyle: {
        marginRight: 10
    },
    errorMessage: {
       color: COLORS.red,
       fontSize: SIZES.xSmall,
       fontFamily: "regular",
       marginTop: 5,
       marginLeft: 5,
    },
    registration: {
        marginTop: 20,
        textAlign: "center" 
    },
    registration2: {
        textAlign: "center",
        marginTop: 5,
        textDecorationLine: 'underline'  ,
        color: COLORS.tertiary
    }
})

export default styles