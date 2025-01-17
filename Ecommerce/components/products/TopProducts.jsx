import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity } from "react-native";
import axios from "axios";
import { backendUrl, COLORS } from "@/constants";
import { useNavigation } from "@react-navigation/native"; // Import navigation hook
import ProductCardView from "../products/ProductCardView";

const TopProducts = () => {
    const [topProducts, setTopProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigation = useNavigation(); // Initialize navigation

    useEffect(() => {
        const fetchTopProducts = async () => {
            try {
                const response = await axios.get(`${backendUrl}/api/products/topProducts`);
                setTopProducts(response.data);
            } catch (error) {
                console.error("Error fetching top products:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTopProducts();
    }, []);

    if (loading) {
        return (
            <View style={styles.centered}>
                <Text>Loading...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Top Products</Text>
            <FlatList
                data={topProducts}
                keyExtractor={(item) => item.productId}
                renderItem={({ item }) => (
                    <TouchableOpacity
                    onPress={() => navigation.navigate("ProductDetails", {item})}
                    >
                        <View style={styles.productCard}>
                            <Image source={{ uri: item.imageUrl }} style={styles.productImage} />
                            <Text style={styles.productTitle}>{item.title}</Text>
                            <Text>Ordered: {item.totalOrders} times</Text>
                            <Text>Price:{"\u20B9"} {item.price}</Text>
                            <Text>Supplier: {item.supplier}</Text>
                        </View>
                    </TouchableOpacity>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 12,
        paddingVertical: 24,
        backgroundColor: "#f0f0f0",
    },
    header: {
        fontSize: 24,
        fontWeight: "700",
        color: "black",
        marginBottom: 14,
        textAlign: "left",
    },
    productCard: {
        backgroundColor: COLORS.offwhite,
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
    },
    productImage: {
        width: "100%",
        height: 180,
        borderRadius: 8,
        marginBottom: 12,
        resizeMode: "cover",
    },
    productTitle: {
        fontSize: 20,
        fontWeight: "600",
        color: "#222",
        marginBottom: 8,
    },
    centered: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f0f0f0",
    },
    loadingText: {
        fontSize: 16,
        fontWeight: "500",
        color: "#555",
    },
});

export default TopProducts;