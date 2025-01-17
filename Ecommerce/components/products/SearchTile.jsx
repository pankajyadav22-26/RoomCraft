import { Text, TouchableOpacity, View, Image} from 'react-native'
import React from 'react'
import styles from './searchTile.style'
import { useNavigation } from 'expo-router'

const SearchTile = ({item}) => {
    const navigation = useNavigation();
  return (
    <View>
      <TouchableOpacity style = {styles.container} onPress={() => navigation.navigate('ProductDetails', {item})}>
        <View style={styles.image}>
            <Image source={{uri: item.imageUrl}}
            style = {styles.productImg}/>
        </View>
        <View style = {styles.textContainer}>
            <Text style = {styles.productTitle}>
                {item.title}
            </Text>
            <Text style = {styles.supplier}>
                {item.supplier}
            </Text>
            <Text style = {styles.supplier}>
               {"\u20B9"} {item.price}
            </Text>
        </View>
      </TouchableOpacity>
    </View>
  )
}

export default SearchTile