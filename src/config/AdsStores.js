// services/AdsStores.js
import AsyncStorage from "@react-native-async-storage/async-storage";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../config/firebaseConfig"; // Adjust path to your Firebase config

// Mock data for development with ad details
const mockAdsData = {
  stores: [
    {
      id: "1",
      name: "Iya Eba Buka",
      category: "Restaurants",
      address: "12 Akindeko Street, Alekuwodo, Osogbo, Osun State",
      image: "https://ipfs.phonetor.com/ipfs/QmajGVR3amqnNyxWRnJys1v1oJNYU1gTxcA9umADTVFD4r",
      rating: 4.8,
      hours: {
        Monday: "08:00-18:00",
        Tuesday: "08:00-18:00",
        Wednesday: "08:00-18:00",
        Thursday: "08:00-18:00",
        Friday: "08:00-18:00",
        Saturday: "08:00-18:00",
        Sunday: "08:00-18:00",
      },
      products: [
        {
          id: "p1",
          name: "Amala with Custom Soup & Meat",
          image: "https://ipfs.phonetor.com/ipfs/QmXo9ojeQWYEnFEPt3rR4gpxA4YKhwifWniXJLtTovmpZq",
          description: "Choose your preferred soup, protein, sides, and drinks to build your perfect meal.",
          available: true,
          discount: 10,
          main: [{ name: "Amala", price: 500 }],
          soups: [
            { name: "Ewedu", price: 500 },
            { name: "Gbegiri", price: 600 },
            { name: "Efo Riro", price: 700 },
            { name: "Ogbono", price: 800 },
          ],
          protein: [
            { name: "Shaki", price: 800 },
            { name: "Ponmo", price: 500 },
            { name: "Goat Meat", price: 1200 },
            { name: "Beef", price: 1000 },
          ],
          drinks: [
            { name: "Zobo", price: 500 },
            { name: "Palm Wine", price: 700 },
            { name: "Coke", price: 400 },
            { name: "Water", price: 200 },
          ],
        },
      ],
      adDetails: {
        amountPaid: 100, // ₦100,000
        startDate: "2025-04-01",
        endDate: "2025-04-15",
        status: "active",
        priority: 10, // Will be recalculated dynamically
      },
    },
    {
      id: "2",
      name: "Pizza House",
      category: "Restaurants",
      address: "45 Adeniran Ogunsanya Street, Surulere, Lagos, Lagos State",
      image: "https://ipfs.phonetor.com/ipfs/QmVr1M5SCh1QZVRBuH7FSbNQzkn8jDA8siASPgTRMjenzt",
      rating: 4.5,
      hours: {
        Monday: "08:00-24:50",
        Tuesday: "08:00-24:50",
        Wednesday: "08:00-24:50",
        Thursday: "08:00-24:50",
        Friday: "08:00-24:50",
        Saturday: "08:00-24:50",
        Sunday: "08:00-24:50",
      },
      products: [
        {
          id: "p2",
          name: "Pizza Hunt",
          image: "https://ipfs.phonetor.com/ipfs/QmVr1M5SCh1QZVRBuH7FSbNQzkn8jDA8siASPgTRMjenzt",
          description: "Customize your pizza with different toppings and extra cheese.",
          available: true,
          discount: 10,
          base_options: [
            { name: "Small Crust", price: 1500 },
            { name: "Medium Crust", price: 2000 },
            { name: "Large Crust", price: 2500 },
          ],
          toppings: [
            { name: "Pepperoni", price: 600 },
            { name: "Extra Cheese", price: 500 },
            { name: "Mushrooms", price: 400 },
            { name: "Olives", price: 400 },
          ],
          drinks: [
            { name: "Fanta", price: 500 },
            { name: "Sprite", price: 500 },
            { name: "Water", price: 200 },
          ],
        },
      ],
      adDetails: {
        amountPaid: 30000, // ₦30,000
        startDate: "2025-04-01",
        endDate: "2025-04-10",
        status: "active",
        priority: 3, // Will be recalculated dynamically
      },
    },
  ],
};

const CACHE_KEY = "ADS_STORES_CACHE";
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

// Enhanced priority calculation
const calculatePriority = (adDetails) => {
  const amountFactor = adDetails.amountPaid / 10000;
  const daysLeft = (new Date(adDetails.endDate) - new Date()) / (1000 * 60 * 60 * 24);
  const freshnessFactor = Math.max(1, 7 - daysLeft); // Boost newer ads
  return amountFactor * freshnessFactor;
};

export const fetchAdsStores = async (userProfile = {}) => {
  try {
    const isDevelopment = process.env.NODE_ENV === "development";

    // Priority recalculation helper
    const recalculatePriorities = (stores) => {
      return stores.map((store) => ({
        ...store,
        adDetails: {
          ...store.adDetails,
          priority: calculatePriority(store.adDetails),
        },
      }));
    };

    if (isDevelopment) {
      console.log("#development: Using mock data for ads stores");
      const now = new Date();
      let filteredStores = mockAdsData.stores
        .filter((store) => {
          const { adDetails } = store;
          const startDate = new Date(adDetails.startDate);
          const endDate = new Date(adDetails.endDate);
          return adDetails.status === "active" && now >= startDate && now <= endDate;
        });

      // Apply personalization
      if (userProfile.location) {
        filteredStores = filteredStores.filter((store) =>
          calculateDistance(userProfile.location, store.address) < 10
        );
      }
      if (userProfile.preferences?.categories) {
        filteredStores = filteredStores.filter((store) =>
          userProfile.preferences.categories.includes(store.category)
        );
      }

      filteredStores = recalculatePriorities(filteredStores);
      return filteredStores.sort((a, b) => b.adDetails.priority - a.adDetails.priority);
    }

    // Check cache
    const cachedData = await AsyncStorage.getItem(CACHE_KEY);
    if (cachedData) {
      const { data, timestamp } = JSON.parse(cachedData);
      const now = Date.now();
      if (now - timestamp < CACHE_DURATION) {
        let filteredStores = data.filter((store) => {
          const { adDetails } = store;
          const startDate = new Date(adDetails.startDate);
          const endDate = new Date(adDetails.endDate);
          return adDetails.status === "active" && now >= startDate && now <= endDate;
        });

        // Apply personalization
        if (userProfile.location) {
          filteredStores = filteredStores.filter((store) =>
            calculateDistance(userProfile.location, store.address) < 10
          );
        }
        if (userProfile.preferences?.categories) {
          filteredStores = filteredStores.filter((store) =>
            userProfile.preferences.categories.includes(store.category)
          );
        }

        filteredStores = recalculatePriorities(filteredStores);
        return filteredStores.sort((a, b) => b.adDetails.priority - a.adDetails.priority);
      }
    }

    // Fetch from Firebase
    const q = query(collection(db, "stores"), where("adDetails.status", "==", "active"));
    const querySnapshot = await getDocs(q);
    let stores = [];
    querySnapshot.forEach((doc) => {
      const storeData = { id: doc.id, ...doc.data() };
      stores.push(storeData);
    });

    // Filter and personalize
    const now = new Date();
    let filteredStores = stores.filter((store) => {
      const { adDetails } = store;
      const startDate = new Date(adDetails.startDate);
      const endDate = new Date(adDetails.endDate);
      return now >= startDate && now <= endDate;
    });

    if (userProfile.location) {
      filteredStores = filteredStores.filter((store) =>
        calculateDistance(userProfile.location, store.address) < 10
      );
    }
    if (userProfile.preferences?.categories) {
      filteredStores = filteredStores.filter((store) =>
        userProfile.preferences.categories.includes(store.category)
      );
    }

    filteredStores = recalculatePriorities(filteredStores);
    filteredStores.sort((a, b) => b.adDetails.priority - a.adDetails.priority);

    // Cache the data
    const cacheData = {
      data: filteredStores,
      timestamp: Date.now(),
    };
    await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));

    return filteredStores;
  } catch (error) {
    console.error("Error fetching ads stores:", error);
    throw error;
  }
};

// Placeholder distance calculation (replace with real logic)
const calculateDistance = (userLocation, storeAddress) => {
  // Implement using a geolocation library (e.g., geolib) or API
  return 5; // Mock distance in km
};