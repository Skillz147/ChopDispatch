import AsyncStorage from "@react-native-async-storage/async-storage";
import { collection, query, getDocs } from "firebase/firestore";
import { db } from "../config/firebaseConfig";
import mockStores from "../config/mockStores.json";

const useMockData = process.env.NODE_ENV === "development";
const STORES_CACHE_KEY = "STORES_CACHE";
const LOCATIONS_CACHE_KEY = "LOCATIONS_CACHE";
const CACHE_DURATION = 24 * 60 * 60 * 1000;

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

const fetchStores = async (forceRefresh = false) => {
  try {
    if (forceRefresh) {
      await AsyncStorage.removeItem(STORES_CACHE_KEY);
    }
    const cachedData = await AsyncStorage.getItem(STORES_CACHE_KEY);
    if (cachedData && !forceRefresh) {
      const { data, timestamp } = JSON.parse(cachedData);
      if (Date.now() - timestamp < CACHE_DURATION) {
        return data;
      }
    }

    let stores = [];
    if (useMockData) {
      stores = mockStores.stores.map((store) => ({
        ...store,
        storeAdDetails: store.storeAdDetails || null,
        products: store.products.map((product) => ({
          ...product,
          productAdDetails: product.productAdDetails || null,
        })),
      }));
    } else {
      const storesQuery = query(collection(db, "stores"));
      const storesSnapshot = await getDocs(storesQuery);
      storesSnapshot.forEach((doc) => {
        const storeData = doc.data();
        stores.push({
          id: doc.id,
          ...storeData,
          storeAdDetails: storeData.storeAdDetails || null,
          products: storeData.products.map((product) => ({
            ...product,
            productAdDetails: product.productAdDetails || null,
            discount: product.discount || 0,
          })),
        });
      });

      const vendorsQuery = query(collection(db, "vendors"));
      const vendorsSnapshot = await getDocs(vendorsQuery);
      const vendors = {};
      vendorsSnapshot.forEach((doc) => {
        vendors[doc.data().businessName] = doc.data().isVerified || false;
      });

      stores = stores.map((store) => ({
        ...store,
        isVerified: vendors[store.name] || false,
      }));
    }

    const cacheData = { data: stores, timestamp: Date.now() };
    await AsyncStorage.setItem(STORES_CACHE_KEY, JSON.stringify(cacheData));
    return stores;
  } catch (error) {
    console.error("Error fetching stores:", error);
    throw error;
  }
};

const fetchFilteredStores = async (selectedLocation, selectedCategory, searchQuery, userProfile = {}, forceRefresh = false) => {
  try {
    let filtered = await fetchStores(forceRefresh);

    if (selectedLocation && selectedLocation !== "All Stores") {
      filtered = filtered.filter((store) => {
        const [_, __, city, state] = store.address.split(", ");
        if (filtered.some((s) => s.address.split(", ")[3] === selectedLocation)) {
          return state === selectedLocation;
        }
        return city === selectedLocation;
      });
    }

    filtered = filtered.filter((store) => {
      const matchesCategory = selectedCategory ? store.category === selectedCategory : true;
      const matchesQuery = searchQuery ? matchesSearchQuery(store, searchQuery) : true;
      return matchesCategory && matchesQuery;
    });

    if (userProfile.location) {
      filtered = filtered.filter((store) => calculateDistance(userProfile.location, store.address) < 10);
    }
    if (userProfile.preferences?.categories) {
      filtered = filtered.filter((store) => userProfile.preferences.categories.includes(store.category));
    }

    const now = new Date();
    filtered = filtered.map((store) => {
      let updatedStoreAdDetails = null;
      if (store.storeAdDetails) {
        const startDate = new Date(store.storeAdDetails.startDate);
        const endDate = new Date(store.storeAdDetails.endDate);
        const isActive = store.storeAdDetails.status === "active" && now >= startDate && now <= endDate;
        updatedStoreAdDetails = isActive ? { ...store.storeAdDetails } : null;
      }

      const updatedProducts = store.products.map((product) => {
        let updatedProductAdDetails = null;
        if (product.productAdDetails) {
          const startDate = new Date(product.productAdDetails.startDate);
          const endDate = new Date(product.productAdDetails.endDate);
          const isActive = product.productAdDetails.status === "active" && now >= startDate && now <= endDate;
          updatedProductAdDetails = isActive ? { ...product.productAdDetails } : null;
        }
        return {
          ...product,
          productAdDetails: updatedProductAdDetails,
        };
      });

      return {
        ...store,
        storeAdDetails: updatedStoreAdDetails,
        products: updatedProducts,
      };
    });

    return filtered;
  } catch (error) {
    console.error("Error fetching filtered stores:", error);
    throw error;
  }
};

const getUniqueLocations = async (selectedLocation, userCity, userState) => {
  try {
    const cachedData = await AsyncStorage.getItem(LOCATIONS_CACHE_KEY);
    if (cachedData) {
      const { data, timestamp } = JSON.parse(cachedData);
      if (Date.now() - timestamp < CACHE_DURATION) {
        return data;
      }
    }

    let newLocations = [{ id: "0", name: "All Stores", icon: "earth" }];
    const stores = await fetchStores();

    if (selectedLocation === "All Stores") {
      newLocations = [
        ...newLocations,
        ...stores
          .map((store) => {
            const [_, __, city, state] = store.address.split(", ");
            return [
              { id: `city-${city}`, name: city, icon: "city" },
              { id: `state-${state}`, name: state, icon: "map" },
            ];
          })
          .flat()
          .filter((loc, index, self) => self.findIndex((l) => l.name === loc.name) === index),
      ];
    } else {
      newLocations = [
        ...newLocations,
        { id: "1", name: userCity, icon: "city" },
        { id: "2", name: userState, icon: "map" },
      ];
    }

    const cacheData = { data: newLocations, timestamp: Date.now() };
    await AsyncStorage.setItem(LOCATIONS_CACHE_KEY, JSON.stringify(cacheData));
    return newLocations;
  } catch (error) {
    console.error("Error fetching unique locations:", error);
    throw error;
  }
};

const calculateDistance = (userLocation, storeAddress) => {
  return 5; // Mock distance in km
};

export { fetchFilteredStores, getUniqueLocations, matchesSearchQuery, fetchStores };