import React, { useState } from "react";
import { View, Text, TouchableOpacity, Modal, FlatList } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import styles from "../styles/CountryFlagStyles";

const countries = [
    { name: "Nigeria", code: "+234", flag: "🇳🇬" },
    { name: "USA", code: "+1", flag: "🇺🇸" },
    { name: "UK", code: "+44", flag: "🇬🇧" },
    { name: "Canada", code: "+1", flag: "🇨🇦" },
    { name: "India", code: "+91", flag: "🇮🇳" },
];

const CountryFlagSelector = ({ onSelectCountry }) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedCountry, setSelectedCountry] = useState(countries[0]);

    const handleSelect = (country) => {
        setSelectedCountry(country);
        onSelectCountry(country.code, country.flag);
        setModalVisible(false);
    };

    return (
        <View>
            {/* ✅ Flag Selector */}
            <TouchableOpacity style={styles.flagContainer} onPress={() => setModalVisible(true)}>
                <Text style={styles.flagText}>{selectedCountry.flag} {selectedCountry.code}</Text>
                <FontAwesome name="chevron-down" size={18} color="#333" />
            </TouchableOpacity>

            {/* ✅ Country Selection Modal */}
            <Modal visible={modalVisible} transparent animationType="slide">
                <View style={styles.modalContainer}>
                    <FlatList
                        data={countries}
                        keyExtractor={(item) => `${item.flag}-${item.code}`} // ✅ Unique key
                        renderItem={({ item }) => (
                            <TouchableOpacity onPress={() => handleSelect(item)} style={styles.countryItem}>
                                <Text style={styles.flagText}>{item.flag} {item.name} ({item.code})</Text>
                            </TouchableOpacity>
                        )}
                    />
                </View>
            </Modal>
        </View>
    );
};

export default CountryFlagSelector;
