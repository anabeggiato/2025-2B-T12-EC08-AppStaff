import { useState } from 'react';
import { View, Pressable, Text, StyleSheet, LayoutAnimation } from 'react-native';
import { Feather, Octicons } from '@expo/vector-icons';


type PageName = "tours" | "mapa" | "menu";

export function Navbar() {
    const [page, setPage] = useState<PageName>("tours");


    const handlePress = (name: PageName) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setPage(name);
    };

    return (
        <View style={styles.navbar}>
            <Pressable onPress={() => handlePress("tours")}>
                <View style={[styles.item, page === "tours" && styles.itemActive]}>
                    <Octicons name="workflow" size={24} color="#FFF" />
                    {page === "tours" && <Text style={styles.text}>Tours</Text>}
                </View>
            </Pressable>

            <Pressable onPress={() => handlePress("mapa")}>
                <View style={[styles.item, page === "mapa" && styles.itemActive]}>
                    <Feather name="map" size={20} color="#FFF" />
                    {page === "mapa" && <Text style={styles.text}>Mapa</Text>}
                </View>
            </Pressable>

            <Pressable onPress={() => handlePress("menu")}>
                <View style={[styles.item, page === "menu" && styles.itemActive]}>
                    <Octicons name="three-bars" size={24} color="#FFF" />
                    {page === "menu" && <Text style={styles.text}>Menu</Text>}
                </View>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    navbar: {
        flexDirection: "row",
        justifyContent: "space-between",
        backgroundColor: "rgba(92, 61, 169, 0.6)",
        borderRadius: 50,
        width: "95%",
        position: "absolute",
        bottom: 20,
        alignSelf: "center",
        padding: 12,
    },
    item: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        paddingVertical: 10,
        paddingHorizontal: 32,
        borderRadius: 24,
    },
    itemActive: {
        backgroundColor: "#5C3DA9",
        borderRadius: 50,
    },
    text: {
        color: "#FFF",
        fontWeight: "600",
    },
});
