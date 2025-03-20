import React, { useState, useEffect } from "react";
import { View, Text, SafeAreaView, Alert, FlatList, TouchableOpacity, Animated, ActivityIndicator } from "react-native";
import * as Location from "expo-location";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import LottieView from "lottie-react-native"; // Import Lottie
import styles from "../styles/DeliveryScreenStyles";
import Categories from "./DeliveryScreen/Categories";
import Search from "./DeliveryScreen/Search";
import Stores from "./DeliveryScreen/Stores";
import mockStores from "../config/mockStores.json";
import colors from "../styles/colors";
import noStoreAnimation from "../../assets/lottie/noStore.json"; // Your Lottie file

const Locations = ({ locations, onSelectLocation, selectedLocation }) => {
    const [animatedValues, setAnimatedValues] = useState({});

    useEffect(() => {
        const newAnimatedValues = locations.reduce((acc, item) => {
            if (!acc[item.id]) {
                acc[item.id] = new Animated.Value(selectedLocation === item.name ? 1 : 0);
            }
            return acc;
        }, { ...animatedValues });
        setAnimatedValues(newAnimatedValues);
    }, [locations, selectedLocation]);

    const handleLocationPress = (location) => {
        onSelectLocation(location.name);
        Animated.parallel(
            locations.map((item) =>
                Animated.spring(animatedValues[item.id], {
                    toValue: item.name === location.name ? 1 : 0,
                    friction: 7,
                    tension: 50,
                    useNativeDriver: true,
                })
            )
        ).start();
    };

    const renderItem = ({ item }) => {
        const isActive = selectedLocation === item.name;
        const scale = animatedValues[item.id]?.interpolate({
            inputRange: [0, 1],
            outputRange: [1, 1.03],
        }) || 1;
        const elevation = animatedValues[item.id]?.interpolate({
            inputRange: [0, 1],
            outputRange: [4, 6],
        }) || 4;

        return (
            <TouchableOpacity
                style={styles.locationCardWrapper}
                onPress={() => handleLocationPress(item)}
                activeOpacity={0.85}
            >
                <Animated.View
                    style={[
                        styles.locationCard,
                        {
                            transform: [{ scale }],
                            elevation,
                            backgroundColor: isActive ? `${colors.primary}10` : colors.surface,
                            borderColor: isActive ? colors.primary : `${colors.textLight}30`,
                        },
                    ]}
                >
                    <View style={styles.locationRow}>
                        <Icon
                            name={item.icon}
                            size={20}
                            color={isActive ? colors.primary : colors.textDark}
                            style={styles.locationIcon}
                        />
                        <Text
                            style={[
                                styles.locationText,
                                isActive && styles.locationTextActive,
                            ]}
                            numberOfLines={1}
                        >
                            {item.name}
                        </Text>
                    </View>
                </Animated.View>
            </TouchableOpacity>
        );
    };

    return (
        <FlatList
            data={locations}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.locationsContainer}
            renderItem={renderItem}
        />
    );
};

const DeliveryScreen = () => {
    const [selectedCategory, setSelectedCategory] = useState("Restaurants");
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredStores, setFilteredStores] = useState([]);
    const [userCity, setUserCity] = useState(null);
    const [userState, setUserState] = useState(null);
    const [locationPermission, setLocationPermission] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [locations, setLocations] = useState([{ id: "0", name: "All Stores", icon: "earth" }]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        (async () => {
            setIsLoading(true);
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== "granted") {
                Alert.alert(
                    "Permission Denied",
                    "We need location permission to show stores near you.",
                    [{ text: "OK" }]
                );
                setLocationPermission(false);
                setFilteredStores(mockStores.stores);
                setSelectedLocation("All Stores");
                setIsLoading(false);
                return;
            }

            setLocationPermission(true);
            let location = await Location.getCurrentPositionAsync({});
            let reverseGeocode = await Location.reverseGeocodeAsync({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
            });

            if (reverseGeocode.length > 0) {
                const city = reverseGeocode[0].city;
                const rawState = reverseGeocode[0].region;
                const state = rawState === "FCT" ? "FCT" : `${rawState} State`;
                setUserCity(city);
                setUserState(state);
                setSelectedLocation(state); // Default to user's state
            }
            setIsLoading(false);
        })();
    }, []);

    useEffect(() => {
        let newLocations = [{ id: "0", name: "All Stores", icon: "earth" }];

        if (locationPermission && userCity && userState) {
            if (selectedLocation === "All Stores") {
                newLocations = [
                    ...newLocations,
                    ...mockStores.stores
                        .map((store) => {
                            const [_, __, city, state] = store.address.split(", ");
                            return [
                                { id: `city-${city}`, name: city, icon: "city" },
                                { id: `state-${state}`, name: state, icon: "map" },
                            ];
                        })
                        .flat()
                        .filter((loc, index, self) => self.findIndex(l => l.name === loc.name) === index),
                ];
            } else {
                newLocations = [
                    ...newLocations,
                    { id: "1", name: userCity, icon: "city" },
                    { id: "2", name: userState, icon: "map" },
                ];
            }
        }

        setLocations(newLocations);
    }, [locationPermission, userCity, userState, selectedLocation]);

    const matchesSearchQuery = (store, query) => {
        const queryLower = query.toLowerCase();
        if (
            store.name.toLowerCase().includes(queryLower) ||
            store.category.toLowerCase().includes(queryLower) ||
            store.address.toLowerCase().includes(queryLower)
        ) {
            return true;
        }
        return store.products.some((product) => {
            return (
                product.name.toLowerCase().includes(queryLower) ||
                product.description.toLowerCase().includes(queryLower) ||
                (product.soups && product.soups.some((soup) => soup.name.toLowerCase().includes(queryLower))) ||
                (product.protein && product.protein.some((prot) => prot.name.toLowerCase().includes(queryLower))) ||
                (product.sides && product.sides.some((side) => side.name.toLowerCase().includes(queryLower))) ||
                (product.drinks && product.drinks.some((drink) => drink.name.toLowerCase().includes(queryLower))) ||
                (product.toppings && product.toppings.some((topping) => topping.name.toLowerCase().includes(queryLower))) ||
                (product.snacks && product.snacks.some((snack) => snack.name.toLowerCase().includes(queryLower))) ||
                (product.extras && product.extras.some((extra) => extra.name.toLowerCase().includes(queryLower))) ||
                (product.medications && product.medications.some((med) => med.name.toLowerCase().includes(queryLower))) ||
                (product.supplements && product.supplements.some((supp) => supp.name.toLowerCase().includes(queryLower))) ||
                (product.fabric && product.fabric.some((fab) => fab.name.toLowerCase().includes(queryLower))) ||
                (product.accessories && product.accessories.some((acc) => acc.name.toLowerCase().includes(queryLower)))
            );
        });
    };

    useEffect(() => {
        setIsLoading(true);
        let filtered = mockStores.stores;

        if (selectedLocation && selectedLocation !== "All Stores") {
            filtered = filtered.filter((store) => {
                const [_, __, city, state] = store.address.split(", ");
                if (mockStores.stores.some(s => s.address.split(", ")[3] === selectedLocation)) {
                    return state === selectedLocation;
                }
                return city === selectedLocation;
            });
        }

        filtered = filtered.filter((store) => {
            const matchesCategory = store.category === selectedCategory;
            const matchesQuery = searchQuery ? matchesSearchQuery(store, searchQuery) : true;
            return matchesCategory && matchesQuery;
        });

        setFilteredStores(filtered);
        setTimeout(() => setIsLoading(false), 500); // Simulate delay
    }, [selectedCategory, searchQuery, selectedLocation]);

    return (
        <SafeAreaView style={styles.container}>
            {/* Search Section */}
            <View style={styles.searchSection}>
                <Search onSearch={setSearchQuery} />
            </View>

            {/* Categories Section */}
            <View style={styles.categoriesSection}>
                <Categories onSelectCategory={setSelectedCategory} />
            </View>

            {/* Locations Section */}
            <View style={styles.locationsSection}>
                <Locations
                    locations={locations}
                    onSelectLocation={setSelectedLocation}
                    selectedLocation={selectedLocation}
                />
            </View>

            {/* Header Section */}
            <View style={styles.headerSection}>
                <Text style={styles.headerText}>Order From Your Favorite Stores</Text>
                <Text style={styles.subHeaderText}>
                    Showing: {selectedCategory} in{" "}
                    {selectedLocation === "All Stores" ? "All Locations" : selectedLocation || "All Locations"}
                </Text>
            </View>

            {/* Stores Section with Loader or No Stores Animation */}
            <View style={styles.storesSection}>
                {isLoading ? (
                    <View style={styles.loaderContainer}>
                        <ActivityIndicator size="large" color={colors.primary} />
                        <Text style={styles.loaderText}>Loading stores...</Text>
                    </View>
                ) : filteredStores.length === 0 ? (
                    <View style={styles.noStoresContainer}>
                        <LottieView
                            source={noStoreAnimation}
                            autoPlay
                            loop
                            style={styles.noStoresAnimation}
                        />
                        <Text style={styles.noStoresText}>
                            No stores offer {selectedCategory} in {selectedLocation || "your location"}.
                        </Text>
                    </View>
                ) : (
                    <Stores stores={filteredStores} />
                )}
            </View>
        </SafeAreaView>
    );
};

export default DeliveryScreen;