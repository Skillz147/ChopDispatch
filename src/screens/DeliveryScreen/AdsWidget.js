import React, { useState, useEffect, useMemo } from "react";
import { View, Text, FlatList, TouchableOpacity, Image, Alert } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { analytics, logEvent } from "../../config/firebaseConfig";
import styles from "../../styles/AdsWidgetStyles";
import colors from "../../styles/colors";

const AdsWidget = ({ stores, onStorePress, onProductPress, userProfile = {}, onSaveItem }) => {
  const getTimeLeft = (endDate) => {
    const now = new Date();
    const end = new Date(endDate);
    const diff = end - now;

    if (diff <= 0) return "Expired";

    const totalHours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(totalHours / 24);
    const hours = totalHours % 24;

    if (days > 0) {
      return hours > 0
        ? `${days} day${days > 1 ? "s" : ""} ${hours} hr${hours > 1 ? "s" : ""}`
        : `${days} day${days > 1 ? "s" : ""}`;
    } else if (totalHours > 0) {
      return `${totalHours} hr${totalHours > 1 ? "s" : ""}`;
    } else {
      return "Expiring soon!";
    }
  };

  const logAdInteraction = async (type, item) => {
    try {
      if (analytics && logEvent) {
        await logEvent(analytics, `ad_${type}`, {
          storeId: item.store ? item.store.id : item.id,
          productId: item.id || null,
          amountPaid: item.productAdDetails?.amountPaid || item.storeAdDetails?.amountPaid || 0,
          timestamp: new Date().toISOString(),
        });
      }
    } catch (error) {
      console.error("Analytics error:", error);
    }
  };

  const handleVerificationPress = (store) => {
    if (store.isVerified) {
      Alert.alert("Verified Store", "This Store is fully verified by Chop Dispatch.", [
        { text: "OK" },
      ]);
    }
  };

  const hotPicks = stores
    .flatMap((store) =>
      store.products
        .filter((product) => {
          const adDetails = product.productAdDetails || product.adDetails;
          return adDetails && adDetails.status === "active";
        })
        .map((product) => ({
          ...product,
          store,
          amountPaid: (product.productAdDetails || product.adDetails).amountPaid,
        }))
    )
    .sort((a, b) => b.amountPaid - a.amountPaid);

  const recommendedStores = stores
    .filter((store) => {
      const adDetails = store.storeAdDetails || store.adDetails;
      return adDetails && adDetails.status === "active";
    })
    .filter((store) => {
      if (userProfile.location && store.address) {
        const distance = calculateDistance(userProfile.location, store.address);
        return distance < 10;
      }
      return true;
    })
    .sort((a, b) => b.amountPaid - a.amountPaid);

  const discountedProducts = useMemo(
    () =>
      stores.flatMap((store) =>
        store.products
          .filter((product) => product.discount > 0)
          .map((product) => ({ ...product, store }))
      ),
    [stores]
  );

  const [featuredDeal, setFeaturedDeal] = useState(null);

  useEffect(() => {
    if (discountedProducts.length > 0) {
      const rotateDeal = () => {
        const randomIndex = Math.floor(Math.random() * discountedProducts.length);
        setFeaturedDeal(discountedProducts[randomIndex]);
      };
      rotateDeal();
      const interval = setInterval(rotateDeal, 5 * 60 * 1000); // Every 5 minutes
      return () => clearInterval(interval);
    }
  }, [discountedProducts]);

  const calculateDistance = () => 5; // Mock distance

  const renderHotPickItem = ({ item }) => {
    const productAdDetails = item.productAdDetails || item.adDetails;
    return (
      <TouchableOpacity
        style={styles.hotPickCard}
        onPress={() => {
          logAdInteraction("click", item);
          onProductPress(item.store, item);
        }}
        accessibilityLabel={`Hot Pick: ${item.name} from ${item.store.name}`}
        accessibilityHint="Tap to view product details"
      >
        <Image source={{ uri: item.image }} style={styles.hotPickImage} resizeMode="cover" />
        <View style={styles.hotPickInfo}>
          <View style={styles.storeNameContainer}>
            <Text style={styles.hotPickName} numberOfLines={2}>
              {item.name}
            </Text>
            {item.store.isVerified && (
              <TouchableOpacity
                onPress={() => handleVerificationPress(item.store)}
                accessibilityLabel="Verified Store"
                accessibilityHint="Tap to see verification details"
              >
                <Icon name="check-circle" size={16} color={colors.blue} style={styles.verifiedIcon} />
              </TouchableOpacity>
            )}
          </View>
          <Text style={styles.hotPickStore} numberOfLines={1}>
            {item.store.name}
          </Text>
          <Text style={styles.timerText}>
            {productAdDetails ? getTimeLeft(productAdDetails.endDate) : "No expiration"}
          </Text>
          {onSaveItem && (
            <TouchableOpacity
              style={styles.saveButton}
              onPress={() => onSaveItem(item)}
              accessibilityLabel="Save this item"
            >
              <Icon name="bookmark-outline" size={20} color={colors.primary} />
            </TouchableOpacity>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const renderRecommendedStoreItem = ({ item }) => {
    const storeAdDetails = item.storeAdDetails || item.adDetails;
    return (
      <TouchableOpacity
        style={styles.recommendedCard}
        onPress={() => {
          logAdInteraction("click", item);
          onStorePress(item);
        }}
        accessibilityLabel={`Recommended Store: ${item.name}`}
        accessibilityHint="Tap to view store details"
      >
        <Image source={{ uri: item.image }} style={styles.recommendedImage} resizeMode="cover" />
        <View style={styles.recommendedInfo}>
          <View style={styles.storeNameContainer}>
            <Text style={styles.recommendedName} numberOfLines={2}>
              {item.name}
            </Text>
            {item.isVerified && (
              <TouchableOpacity
                onPress={() => handleVerificationPress(item)}
                accessibilityLabel="Verified Store"
                accessibilityHint="Tap to see verification details"
              >
                <Icon name="check-circle" size={16} color={colors.blue} style={styles.verifiedIcon} />
              </TouchableOpacity>
            )}
          </View>
          <Text style={styles.recommendedCategory} numberOfLines={1}>
            {item.category}
          </Text>
          <View style={styles.ratingContainer}>
            <Icon name="star" size={16} color={colors.gold} />
            <Text style={styles.ratingText}>{item.rating}</Text>
          </View>
          <Text style={styles.timerText}>
            {storeAdDetails ? getTimeLeft(storeAdDetails.endDate) : "No expiration"}
          </Text>
          {onSaveItem && (
            <TouchableOpacity
              style={styles.saveButton}
              onPress={() => onSaveItem(item)}
              accessibilityLabel="Save this store"
            >
              <Icon name="bookmark-outline" size={20} color={colors.primary} />
            </TouchableOpacity>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {featuredDeal && (
        <TouchableOpacity
          style={styles.featuredDeal}
          onPress={() => onProductPress(featuredDeal.store, featuredDeal)}
        >
          <View style={styles.featuredDealContent}>
            <Text style={styles.dealText}>
              {featuredDeal.discount}% OFF {featuredDeal.name}
            </Text>
            <Text style={styles.dealSubText}>
              {featuredDeal.productAdDetails
                ? `Ends ${getTimeLeft(featuredDeal.productAdDetails.endDate)}`
                : "Limited Offer"}
            </Text>
          </View>
          <View style={styles.dealCTAContainer}>
            <Text style={styles.dealCTA}>Shop Now</Text>
            <Icon name="chevron-right" size={22} color={colors.background} />
          </View>
        </TouchableOpacity>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Hot Picks For You 🔥</Text>
        {hotPicks.length > 0 ? (
          <FlatList
            data={hotPicks}
            renderItem={renderHotPickItem}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.hotPicksList}
          />
        ) : (
          <Text style={styles.noItemsText}>No Hot Picks Available</Text>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recommended Stores</Text>
        {recommendedStores.length > 0 ? (
          <FlatList
            data={recommendedStores}
            renderItem={renderRecommendedStoreItem}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.recommendedList}
          />
        ) : (
          <Text style={styles.noItemsText}>No Recommended Stores Available</Text>
        )}
      </View>
    </View>
  );
};

export default AdsWidget;