import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  SafeAreaView,
  Alert,
  FlatList,
  TouchableOpacity,
  Animated,
  RefreshControl,
} from "react-native";
import * as Location from "expo-location";
import LottieView from "lottie-react-native";
import styles from "../styles/DeliveryScreenStyles";
import Categories from "./DeliveryScreen/Categories";
import Search from "./DeliveryScreen/Search";
import Stores from "./DeliveryScreen/Stores";
import AdsWidget from "./DeliveryScreen/AdsWidget";
import Locations from "./DeliveryScreen/Locations"; // Extracted component
import StoreProductsModal from "./DeliveryScreen/StoreProductsModal";
import colors from "../styles/colors";
import noStoreAnimation from "../../assets/lottie/noStore.json";
import loadingAnimation from "../../assets/lottie/loading.json";
import { fetchFilteredStores, getUniqueLocations } from "../services/StoreServices";
import * as Linking from "expo-linking";

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
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [adsStores, setAdsStores] = useState([]);
  const [adsLoading, setAdsLoading] = useState(true);
  const [adsError, setAdsError] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedStore, setSelectedStore] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Fetch ads stores on mount
  useEffect(() => {
    const loadAdsStores = async () => {
      setAdsLoading(true);
      setAdsError(null);
      try {
        const stores = await fetchFilteredStores("All Stores", null, "", {});
        setAdsStores(stores);
      } catch (error) {
        console.error("Error loading ads stores:", error);
        setAdsError("Failed to load featured stores and products.");
      } finally {
        setAdsLoading(false);
      }
    };
    loadAdsStores();
  }, []);

  // Initial location and stores fetch
  useEffect(() => {
    const initialize = async () => {
      setIsLoading(true);
      setError(null);
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Denied",
          "We need location permission to show stores near you.",
          [
            { text: "OK" },
            { text: "Go to Settings", onPress: () => Linking.openSettings() },
          ]
        );
        setLocationPermission(false);
        try {
          const stores = await fetchFilteredStores("All Stores", selectedCategory, searchQuery);
          setFilteredStores(stores);
          setSelectedLocation("All Stores");
        } catch (error) {
          console.error("Error fetching stores without location permission:", error);
          setError("Failed to load stores. Please try again.");
        }
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
        setSelectedLocation(state);
      }
      setIsLoading(false);
    };
    initialize();
  }, []);

  // Fetch unique locations
  useEffect(() => {
    const fetchLocations = async () => {
      if (locationPermission && userCity && userState) {
        try {
          const newLocations = await getUniqueLocations(selectedLocation, userCity, userState);
          setLocations(newLocations);
        } catch (error) {
          console.error("Error fetching locations:", error);
          setError("Failed to load locations.");
        }
      }
    };
    fetchLocations();
  }, [locationPermission, userCity, userState, selectedLocation]);

  // Fetch filtered stores
  useEffect(() => {
    const fetchStores = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const stores = await fetchFilteredStores(selectedLocation, selectedCategory, searchQuery);
        setFilteredStores(stores);
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }).start();
      } catch (error) {
        console.error("Error fetching filtered stores:", error);
        setError("Failed to load stores. Please try again.");
        setFilteredStores([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStores();
  }, [selectedCategory, searchQuery, selectedLocation, fadeAnim]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    setError(null);
    try {
      const stores = await fetchFilteredStores(selectedLocation, selectedCategory, searchQuery, {}, true); // Force cache refresh
      setFilteredStores(stores);
      const ads = await fetchFilteredStores("All Stores", null, "", {}, true); // Force cache refresh
      setAdsStores(ads);
    } catch (error) {
      console.error("Error refreshing stores:", error);
      setError("Failed to refresh stores. Please try again.");
    } finally {
      setRefreshing(false);
    }
  }, [selectedCategory, searchQuery, selectedLocation]);

  const handleRetry = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const stores = await fetchFilteredStores(selectedLocation, selectedCategory, searchQuery);
      setFilteredStores(stores);
    } catch (error) {
      console.error("Error retrying fetch stores:", error);
      setError("Failed to load stores. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleStorePress = (store) => {
    setSelectedStore(store);
    setSelectedProduct(null);
    setModalVisible(true);
  };

  const handleProductPress = (store, product) => {
    setSelectedStore(store);
    setSelectedProduct(product);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedStore(null);
    setSelectedProduct(null);
  };

  const renderContent = ({ item }) => {
    switch (item) {
      case "categories":
        return (
          <View style={styles.categoriesSection}>
            <Categories onSelectCategory={setSelectedCategory} />
          </View>
        );
      case "locations":
        return (
          <View style={styles.locationsSection}>
            <Locations
              locations={locations}
              onSelectLocation={setSelectedLocation}
              selectedLocation={selectedLocation}
            />
          </View>
        );
      case "ads":
        return (
          <View style={styles.adsSection}>
            {adsLoading ? (
              <View style={styles.loaderContainer}>
                <LottieView source={loadingAnimation} autoPlay loop style={styles.loaderAnimation} />
                <Text style={styles.loaderText}>Loading featured stores...</Text>
              </View>
            ) : adsError ? (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{adsError}</Text>
              </View>
            ) : (
              <AdsWidget
                stores={adsStores}
                onStorePress={handleStorePress}
                onProductPress={handleProductPress}
              />
            )}
          </View>
        );
      case "header":
        return (
          <View style={styles.headerSection}>
            <Text style={styles.headerText}>Order From Your Favorite Stores</Text>
            <Text style={styles.subHeaderText}>
              Showing: {selectedCategory} in{" "}
              {selectedLocation === "All Stores" ? "All Locations" : selectedLocation || "All Locations"}
            </Text>
          </View>
        );
      case "stores":
        return (
          <Animated.View style={[styles.storesSection, { opacity: fadeAnim }]}>
            {isLoading ? (
              <View style={styles.loaderContainer}>
                <LottieView source={loadingAnimation} autoPlay loop style={styles.loaderAnimation} />
                <Text style={styles.loaderText}>Loading stores...</Text>
              </View>
            ) : error ? (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
                <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
                  <Text style={styles.retryButtonText}>Retry</Text>
                </TouchableOpacity>
              </View>
            ) : filteredStores.length === 0 ? (
              <View style={styles.noStoresContainer}>
                <LottieView source={noStoreAnimation} autoPlay loop style={styles.noStoresAnimation} />
                <Text style={styles.noStoresText}>
                  No stores offer {selectedCategory} in {selectedLocation || "your location"}.
                </Text>
                <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
                  <Text style={styles.retryButtonText}>Retry</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <Stores stores={filteredStores} />
            )}
          </Animated.View>
        );
      default:
        return null;
    }
  };

  const data = ["categories", "locations", "ads", "header", "stores"];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchSection}>
        <Search onSearch={setSearchQuery} />
      </View>
      <FlatList
        data={data}
        renderItem={renderContent}
        keyExtractor={(item) => item}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
      />
      {selectedStore && (
        <StoreProductsModal
          visible={modalVisible}
          store={selectedStore}
          onClose={handleCloseModal}
          initialProduct={selectedProduct}
        />
      )}
    </SafeAreaView>
  );
};

export default DeliveryScreen;