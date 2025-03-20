// src/screens/OrdersScreen.js
import React, { useContext, useState, useEffect, useMemo, useCallback } from "react";
import { View, Text, TouchableOpacity, ScrollView, TextInput, Modal, Alert, TouchableWithoutFeedback } from "react-native";
import { AuthContext } from "../context/AuthContext";
import { db } from "../config/firebaseConfig";
import { collection, query, where, getDocs, updateDoc, doc, addDoc } from "firebase/firestore";
import { Ionicons } from "@expo/vector-icons";
import LottieView from "lottie-react-native";
import loadingAnimation from "../../assets/lottie/dunno.json"; // Adjust path as needed
import styles from "../styles/OrdersScreenStyles";
import colors from "../styles/colors";

const OrdersScreen = () => {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [shipments, setShipments] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [riderInstructions, setRiderInstructions] = useState("");
  const [showInstructionsInput, setShowInstructionsInput] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrdersAndShipments = useCallback(async () => {
    if (!user?.uid) {
      setLoading(false);
      setError("User not authenticated. Please log in or sign up.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const ordersQuery = query(collection(db, "orders"), where("userId", "==", user.uid));
      const ordersSnapshot = await getDocs(ordersQuery);
      const ordersList = ordersSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const shipmentsQuery = query(collection(db, "shipments"), where("userId", "==", user.uid));
      const shipmentsSnapshot = await getDocs(shipmentsQuery);
      const shipmentsList = shipmentsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const updatedOrders = await Promise.all(
        ordersList.map(async (order) => {
          const shipment = shipmentsList.find(
            (s) => s.trackingNumber === order.paymentDetails?.riderTrackingNumber
          );
          if (shipment && !shipment.orderId) {
            const shipmentRef = doc(db, "shipments", shipment.id);
            await updateDoc(shipmentRef, {
              orderId: order.paymentDetails.trackingCode,
              riderInstructions: shipment.riderInstructions || "",
            });
            shipment.orderId = order.paymentDetails.trackingCode;
          }
          return { ...order, shipment };
        })
      );

      const sortedOrders = updatedOrders.sort((a, b) => {
        const dateA = a.createdAt?.toDate ? new Date(a.createdAt.toDate()) : new Date(0);
        const dateB = b.createdAt?.toDate ? new Date(b.createdAt.toDate()) : new Date(0);
        return dateB - dateA;
      });

      setOrders(sortedOrders);
      setShipments(shipmentsList);
    } catch (err) {
      console.error("Error fetching orders and shipments:", err);
      setError(`Failed to load orders: ${err.message}. Please retry or contact support.`);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchOrdersAndShipments();
  }, [fetchOrdersAndShipments]);

  const handleAddInstructions = async (shipmentId) => {
    if (!riderInstructions.trim()) {
      Alert.alert("Error", "Instructions cannot be empty.");
      return;
    }
    try {
      const shipmentRef = doc(db, "shipments", shipmentId);
      await updateDoc(shipmentRef, { riderInstructions });
      setShipments((prev) =>
        prev.map((s) => (s.id === shipmentId ? { ...s, riderInstructions } : s))
      );
      setOrders((prev) =>
        prev.map((o) =>
          o.shipment?.id === shipmentId ? { ...o, shipment: { ...o.shipment, riderInstructions } } : o
        )
      );
      setRiderInstructions("");
      setShowInstructionsInput(false);
    } catch (err) {
      console.error("Error adding instructions:", err);
      Alert.alert("Error", "Failed to save instructions. Please try again.");
    }
  };

  const handleEditInstructions = (shipment) => {
    setRiderInstructions(shipment.riderInstructions || "");
    setShowInstructionsInput(true);
  };

  const handleRateFood = async (orderId) => {
    if (rating === 0) {
      Alert.alert("Error", "Please select a rating.");
      return;
    }
    try {
      const ratingData = {
        userId: user.uid,
        orderId,
        rating,
        comment: comment.trim() || null,
        createdAt: new Date().toISOString(),
      };
      await addDoc(collection(db, "orders", orderId, "ratings"), ratingData);
      setRating(0);
      setComment("");
      setShowDetails(false);
      Alert.alert("Success", "Rating submitted successfully!");
    } catch (err) {
      console.error("Error submitting rating:", err);
      Alert.alert("Error", "Failed to submit rating. Please try again.");
    }
  };

  const closeModal = () => {
    setShowDetails(false);
    setShowInstructionsInput(false);
    setRiderInstructions("");
    setRating(0);
    setComment("");
  };

  const sortedOrders = useMemo(() => orders, [orders]);

  const renderOrderDetails = () => {
    if (!selectedOrder) return null;
    const shipment = selectedOrder.shipment;
    const status = shipment ? shipment.status : "Pending";
    const isDelivered = shipment?.proofOfDelivery && shipment?.status === "Delivered";
    const formatPrice = (price) => `₦${(price || 0).toLocaleString("en-NG")}`;

    return (
      <Modal
        visible={showDetails}
        animationType="slide"
        transparent
        onRequestClose={closeModal} // Handle hardware back button (Android)
      >
        <TouchableWithoutFeedback onPress={closeModal}>
          <View style={styles.modalContainer}>
            <TouchableWithoutFeedback>
              <View style={styles.detailsContainer}>
                <View style={styles.headerContainer}>
                  <TouchableOpacity
                    style={styles.closeButton}
                    onPress={closeModal}
                    accessible={true}
                    accessibilityLabel="Close Details"
                  >
                    <Ionicons name="close" size={24} color={colors.textDark} />
                  </TouchableOpacity>
                  <Text style={styles.detailTitle}>Order Details</Text>
                  <View style={styles.headerInfo}>
                    <Text style={styles.headerText}>Order ID: {selectedOrder.id}</Text>
                    <Text style={styles.headerText}>Total: {formatPrice(selectedOrder.totalAmount)}</Text>
                    <Text style={styles.headerText}>Status: {status}</Text>
                    {shipment && (
                      <Text style={styles.headerText}>Tracking: {shipment.trackingNumber}</Text>
                    )}
                  </View>
                </View>
                <ScrollView style={styles.scrollableContent}>
                  <Text style={styles.detailText}>
                    Date: {new Date(selectedOrder.createdAt.toDate()).toLocaleString()}
                  </Text>
                  <Text style={styles.detailText}>
                    Address: {selectedOrder.deliveryAddress}
                  </Text>
                  {selectedOrder.riderFee && (
                    <Text style={styles.detailText}>
                      Delivery Cost: {formatPrice(selectedOrder.riderFee)}
                      {selectedOrder.urgentFee && ` + ${formatPrice(selectedOrder.urgentFee)} (Urgent)`}
                    </Text>
                  )}
                  <Text style={styles.subTitle}>
                    <Ionicons name="fast-food-outline" size={16} color={colors.primary} /> Items
                  </Text>
                  {selectedOrder.cartItems.map((item, index) => (
                    <View key={index} style={styles.itemContainer}>
                      <Text style={styles.itemText}>{item.name} - {formatPrice(item.totalPrice)}</Text>
                      {item.selectedItems &&
                        Object.entries(item.selectedItems).map(([category, items]) =>
                          items.map((subItem, subIndex) => (
                            <Text key={subIndex} style={styles.subItemText}>
                              - {subItem.name} (₦{subItem.price} x {subItem.quantity})
                            </Text>
                          ))
                        )}
                    </View>
                  ))}
                  {shipment && (
                    <>
                      <Text style={styles.subTitle}>
                        <Ionicons name="bicycle-outline" size={16} color={colors.primary} /> Shipment Details
                      </Text>
                      <Text style={styles.detailText}>Tracking Number: {shipment.trackingNumber}</Text>
                      <Text style={styles.detailText}>Instructions:</Text>
                      {shipment.riderInstructions ? (
                        <View style={styles.instructionContainer}>
                          <Text style={styles.instructionText}>{shipment.riderInstructions}</Text>
                          <TouchableOpacity
                            onPress={() => handleEditInstructions(shipment)}
                            style={styles.editButton}
                            accessible={true}
                            accessibilityLabel="Edit Rider Instructions"
                          >
                            <Text style={styles.editButtonText}>Edit</Text>
                          </TouchableOpacity>
                        </View>
                      ) : (
                        <TouchableOpacity
                          onPress={() => setShowInstructionsInput(true)}
                          style={styles.addInstructionPrompt}
                          accessible={true}
                          accessibilityLabel="Add Rider Instructions"
                        >
                          <Text style={styles.instructionPromptText}>
                            Add Instruction For Delivery
                          </Text>
                        </TouchableOpacity>
                      )}
                      {showInstructionsInput && (
                        <View style={styles.instructionsContainer}>
                          <TextInput
                            style={styles.instructionsInput}
                            placeholder="Enter instructions for the rider"
                            value={riderInstructions}
                            onChangeText={setRiderInstructions}
                            multiline
                            accessible={true}
                            accessibilityLabel="Rider Instructions Input"
                          />
                          <TouchableOpacity
                            style={styles.addInstructionsButton}
                            onPress={() => handleAddInstructions(shipment.id)}
                            accessible={true}
                            accessibilityLabel="Save Instructions"
                          >
                            <Text style={styles.addInstructionsText}>Save</Text>
                          </TouchableOpacity>
                        </View>
                      )}
                    </>
                  )}
                  {isDelivered && (
                    <>
                      <Text style={styles.subTitle}>
                        <Ionicons name="star-outline" size={16} color={colors.primary} /> Rate the Food
                      </Text>
                      <View style={styles.ratingContainer}>
                        {[1, 2, 3, 4, 5].map((star) => (
                          <TouchableOpacity
                            key={star}
                            onPress={() => setRating(star)}
                            onPressIn={() => setRating(star)}
                            accessible={true}
                            accessibilityLabel={`Rate ${star} stars`}
                          >
                            <Ionicons
                              name={star <= rating ? "star" : "star-outline"}
                              size={30}
                              color={star <= rating ? colors.gold : colors.textLight}
                            />
                          </TouchableOpacity>
                        ))}
                      </View>
                      <TextInput
                        style={styles.commentInput}
                        placeholder="Leave a comment (optional)"
                        value={comment}
                        onChangeText={setComment}
                        multiline
                        accessible={true}
                        accessibilityLabel="Rating Comment Input"
                      />
                      <TouchableOpacity
                        style={[styles.rateButton, rating === 0 && styles.rateButtonDisabled]}
                        onPress={() => handleRateFood(selectedOrder.id)}
                        disabled={rating === 0}
                        accessible={true}
                        accessibilityLabel="Submit Rating"
                      >
                        <Text style={styles.rateButtonText}>Submit Rating</Text>
                      </TouchableOpacity>
                    </>
                  )}
                </ScrollView>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    );
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <LottieView
            source={loadingAnimation}
            autoPlay
            loop
            style={styles.lottie}
          />
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={fetchOrdersAndShipments}
            accessible={true}
            accessibilityLabel="Retry Loading Orders"
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : orders.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No orders found.</Text>
          <TouchableOpacity
            style={styles.refreshButton}
            onPress={fetchOrdersAndShipments}
            accessible={true}
            accessibilityLabel="Refresh Orders"
          >
            <Text style={styles.refreshButtonText}>Refresh</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView>
          <Text style={styles.title}>Your Orders</Text>
          {sortedOrders.map((order) => (
            <TouchableOpacity
              key={order.id}
              style={styles.orderContainer}
              onPress={() => {
                setSelectedOrder(order);
                setShowDetails(true);
              }}
              accessible={true}
              accessibilityLabel={`View Order ${order.id}`}
            >
              <Text style={styles.orderText}>Order ID: {order.id}</Text>
              <Text style={styles.orderText}>Total: ₦{order.totalAmount?.toLocaleString("en-NG")}</Text>
              <Text style={styles.orderText}>
                Status: {order.shipment ? order.shipment.status : "Pending"}
              </Text>
              <Text style={styles.orderText}>
                Date: {new Date(order.createdAt?.toDate()).toLocaleDateString()}
              </Text>
            </TouchableOpacity>
          ))}
          {renderOrderDetails()}
        </ScrollView>
      )}
    </View>
  );
};

export default OrdersScreen;