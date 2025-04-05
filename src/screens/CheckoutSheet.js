// src/screens/CheckoutSheet.js
import React, { useState, useContext, useMemo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Modal,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from "react-native";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import CheckOutForm from "./CheckOutPayment/CheckOutForm";
import CheckOutPaymentMethod from "./CheckOutPayment/CheckOutPaymentMethod";
import CheckoutDelivery from "./CheckOutPayment/CheckoutDelivery";
import PaymentSheet from "./RiderPickUpScreen/PaymentSheet";
import CheckOutConfirmation from "./CheckOutPayment/CheckOutConfirmation";
import styles from "../styles/CheckoutStyles";
import { db } from "../config/firebaseConfig";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import LottieView from "lottie-react-native";
import loadingAnimation from "../../assets/lottie/loading.json";

const { width } = Dimensions.get("window");

const CheckoutSheet = ({ visible, onClose }) => {
  const { cartItems, setCartItems } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const [step, setStep] = useState("form");
  const [formData, setFormData] = useState({});
  const [paymentMethod, setPaymentMethod] = useState("bank_transfer");
  const [selectedBank, setSelectedBank] = useState(null);
  const [deliveryOption, setDeliveryOption] = useState(null);
  const [tempAddress, setTempAddress] = useState("");
  const [riderInstructions, setRiderInstructions] = useState("");
  const [proofOfDelivery, setProofOfDelivery] = useState(false);
  const [receiverName, setReceiverName] = useState("");
  const [receiverNumber, setReceiverNumber] = useState("");
  const [urgent, setUrgent] = useState(false);
  const [pickupTime, setPickupTime] = useState(new Date());
  const [paymentResponse, setPaymentResponse] = useState(null);
  const [nextEnabled, setNextEnabled] = useState(false);
  const [nextData, setNextData] = useState(null);
  const [showPaymentSheet, setShowPaymentSheet] = useState(false);
  const [riderTrackingNumber, setRiderTrackingNumber] = useState("");
  const [loading, setLoading] = useState(false);

  const BASE_RIDER_FEE = 2500;
  const URGENT_FEE = 1000;
  const cartSubtotal = cartItems.reduce((sum, item) => sum + (item.totalPrice || 0), 0);
  const riderFee = deliveryOption === "rider" ? BASE_RIDER_FEE : 0;
  const urgentFee = deliveryOption === "rider" && urgent ? URGENT_FEE : 0;
  const totalAmount = cartSubtotal + riderFee + urgentFee;
  const formatPrice = (price) => `₦${(price || 0).toLocaleString("en-NG")}`;

  const generateTrackingNumber = () => Math.floor(100000 + Math.random() * 900000).toString();

  const handleNext = (data) => {
    switch (step) {
      case "form":
        setFormData(data);
        setStep("paymentMethod");
        break;
      case "paymentMethod":
        setPaymentMethod(data);
        setSelectedBank(null);
        setStep("delivery");
        break;
      case "delivery":
        setDeliveryOption(data.option);
        if (data.tempAddress) setTempAddress(data.tempAddress);
        if (data.riderInstructions) setRiderInstructions(data.riderInstructions);
        if (data.proofOfDelivery !== undefined) setProofOfDelivery(data.proofOfDelivery);
        if (data.receiverName) setReceiverName(data.receiverName);
        if (data.receiverNumber) setReceiverNumber(data.receiverNumber);
        if (data.urgent !== undefined) setUrgent(data.urgent);
        if (data.pickupTime) setPickupTime(data.pickupTime);
        setStep("payment");
        setShowPaymentSheet(true);
        break;
      case "payment":
        setPaymentResponse(data);
        setStep("confirmation");
        break;
      default:
        break;
    }
    setNextEnabled(false);
    setNextData(null);
  };

  const handleBack = () => {
    switch (step) {
      case "paymentMethod":
        setStep("form");
        break;
      case "delivery":
        setStep("paymentMethod");
        break;
      case "payment":
        setStep("delivery");
        setShowPaymentSheet(false);
        break;
      case "confirmation":
        setStep("payment");
        setShowPaymentSheet(true);
        break;
      default:
        onClose();
    }
    setNextEnabled(false);
    setNextData(null);
  };

  const saveOrderToFirestore = async (paymentData, trackingNum) => {
    try {
      const orderData = {
        userId: user.uid, // Enforce authenticated user UID
        cartItems: cartItems.map((item) => ({
          id: item.id,
          name: item.name,
          totalPrice: item.totalPrice || 0,
          selectedItems: item.selectedItems || {},
          store: item.store || {},
        })),
        formData: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          landmark: formData.landmark || "",
        },
        paymentMethod: paymentMethod || "bank_transfer",
        selectedBank: selectedBank || null,
        deliveryOption,
        deliveryAddress: deliveryOption === "rider" ? formData.address : tempAddress || "N/A",
        riderInstructions: deliveryOption === "rider" ? riderInstructions : "",
        proofOfDelivery: deliveryOption === "rider" ? proofOfDelivery : false,
        receiverName: deliveryOption === "rider" ? receiverName : "",
        receiverNumber: deliveryOption === "rider" ? receiverNumber : "",
        urgent: deliveryOption === "rider" ? urgent : false,
        pickupTime: deliveryOption === "rider" ? pickupTime.toISOString() : null,
        paymentDetails: {
          status: paymentData.status,
          transactionId: paymentData.transactionId,
          amount: paymentData.amount,
          trackingCode: paymentData.trackingCode,
          riderTrackingNumber: deliveryOption === "rider" ? trackingNum : null,
        },
        cartSubtotal,
        riderFee,
        urgentFee,
        totalAmount,
        createdAt: serverTimestamp(),
      };
      const docRef = await addDoc(collection(db, "orders"), orderData);
      return docRef.id;
    } catch (error) {
      console.error("Error saving order to Firestore:", error);
      throw error;
    }
  };

  const saveShipmentData = async (trackingNum) => {
    if (deliveryOption !== "rider") return;

    const store = cartItems[0]?.store || {};
    const shipmentData = {
      userId: user.uid, // Enforce authenticated user UID
      pickupAddress: store.address || "Unknown Store Address",
      pickupLandmark: store.landmark || "",
      pickFromName: store.name || formData.name,
      pickupTime: pickupTime.toISOString(),
      urgent,
      deliveryAddress: formData.address,
      deliveryLandmark: formData.landmark || "",
      receiverName,
      receiverNumber,
      proofOfDelivery,
      riderInstructions,
      totalCost: totalAmount,
      trackingNumber: trackingNum,
      status: "Pending",
      createdAt: new Date().toISOString(),
      orderId: null,
    };

    try {
      const shipmentRef = await addDoc(collection(db, "shipments"), shipmentData);
      return shipmentRef.id;
    } catch (error) {
      console.error("Failed to save shipment:", error);
      throw error;
    }
  };

  const handlePaymentRedirect = async (data) => {
    setShowPaymentSheet(false);
    const response = {
      status: data.status === "successful" || data.status === "completed" ? "success" : "failed",
      transactionId: data.transaction_id || "N/A",
      amount: data.amount || totalAmount,
      trackingCode:
        data.status === "successful" || data.status === "completed"
          ? `TRK-${Math.random().toString(36).substr(2, 7).toUpperCase()}`
          : null,
    };

    if (response.status === "success") {
      if (!user || !user.uid) {
        alert("You must be signed in to complete this order.");
        setLoading(false); // Reset loading if auth fails
        return;
      }

      setLoading(true);
      try {
        let riderTrackingNum = null;
        if (deliveryOption === "rider") {
          riderTrackingNum = generateTrackingNumber();
          setRiderTrackingNumber(riderTrackingNum);
          await saveShipmentData(riderTrackingNum);
        }
        await saveOrderToFirestore(response, riderTrackingNum);
        setCartItems([]);
      } catch (error) {
        console.error("Failed to save order/shipment:", error);
        alert("Payment succeeded, but there was an issue saving your order. Contact support.");
      } finally {
        setLoading(false);
      }
    }

    setPaymentResponse(response);
    setStep("confirmation");
  };

  const handleClose = () => {
    setStep("form");
    setFormData({});
    setPaymentMethod(null);
    setSelectedBank(null);
    setDeliveryOption(null);
    setTempAddress("");
    setRiderInstructions("");
    setProofOfDelivery(false);
    setReceiverName("");
    setReceiverNumber("");
    setUrgent(false);
    setPickupTime(new Date());
    setPaymentResponse(null);
    setNextEnabled(false);
    setNextData(null);
    setShowPaymentSheet(false);
    setRiderTrackingNumber("");
    setLoading(false);
    onClose();
  };

  const renderOrderSummary = useMemo(() => {
    if (!cartItems.length) return null;

    return (
      <View style={styles.orderSummary}>
        <Text style={styles.summaryTitle}>Order Summary</Text>
        <View style={styles.summaryScroll}>
          {cartItems.map((item, index) => (
            <View key={item.id || `item-${index}`} style={styles.summaryItem}>
              <Text style={styles.summaryItemName}>{item.name || "Unnamed Item"}</Text>
              <Text style={styles.summarySubItem}>Store: {item.store?.name || "Unknown Store"}</Text>
              {Object.entries(item.selectedItems || {}).map(([category, selections]) =>
                selections.map((selItem, subIndex) => (
                  <Text
                    key={`${category}-${selItem.name || `sub-${subIndex}`}`}
                    style={styles.summarySubItem}
                  >
                    - {selItem.name || "Unnamed"} x{selItem.quantity || 1} ({formatPrice(selItem.price || 0)})
                  </Text>
                ))
              )}
              <Text style={styles.summaryItemTotal}>Total: {formatPrice(item.totalPrice || 0)}</Text>
            </View>
          ))}
        </View>
      </View>
    );
  }, [cartItems, formatPrice]);

  const renderStep = () => {
    switch (step) {
      case "form":
        return <CheckOutForm onNext={handleNext} setNextEnabled={setNextEnabled} setNextData={setNextData} />;
      case "paymentMethod":
        return (
          <CheckOutPaymentMethod
            onNext={handleNext}
            totalAmount={totalAmount}
            setNextEnabled={setNextEnabled}
            setNextData={setNextData}
          />
        );
      case "delivery":
        return (
          <CheckoutDelivery
            onNext={handleNext}
            formData={formData}
            setNextEnabled={setNextEnabled}
            setNextData={setNextData}
          />
        );
      case "payment":
        return null;
      default:
        return null;
    }
  };

  const listData = useMemo(() => {
    const data = [];
    if (renderOrderSummary) data.push({ key: "orderSummary", content: renderOrderSummary });
    if (renderStep()) data.push({ key: "step", content: renderStep() });
    return data;
  }, [renderOrderSummary, step]);

  const renderItem = ({ item }) => {
    return item.content;
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={handleBack}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.modalOverlay}
      >
        <View style={styles.sheetContainer}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <LottieView
                source={loadingAnimation}
                autoPlay
                loop
                style={styles.lottie}
              />
            </View>
          ) : step === "confirmation" ? (
            <Modal
              animationType="fade"
              transparent={true}
              visible={step === "confirmation"}
              onRequestClose={handleClose}
            >
              <View style={styles.confirmationOverlay}>
                <CheckOutConfirmation
                  paymentResponse={{
                    ...paymentResponse,
                    riderTrackingNumber: deliveryOption === "rider" ? riderTrackingNumber : null,
                  }}
                  onClose={handleClose}
                />
              </View>
            </Modal>
          ) : (
            <>
              <TouchableOpacity style={styles.closeButton} onPress={handleBack}>
                <Text style={styles.closeText}>Back</Text>
              </TouchableOpacity>
              <FlatList
                data={listData}
                renderItem={renderItem}
                keyExtractor={(item) => item.key}
                contentContainerStyle={styles.contentContainer}
                showsVerticalScrollIndicator={false}
              />
              {step !== "confirmation" && step !== "payment" && (
                <View style={styles.footer}>
                  <Text style={styles.summaryTotal}>
                    Grand Total: {formatPrice(totalAmount)}
                    {deliveryOption === "rider" && (
                      <Text style={styles.feeBreakdown}>
                        <Text> </Text>(Cart: {formatPrice(cartSubtotal)} + Rider: {formatPrice(riderFee)}
                        {urgent ? ` + Urgent: ${formatPrice(urgentFee)}` : ""})
                      </Text>
                    )}
                  </Text>
                  <TouchableOpacity
                    style={[styles.nextButton, !nextEnabled && styles.nextButtonDisabled]}
                    onPress={() => {
                      if (nextEnabled && nextData !== null) handleNext(nextData);
                    }}
                    disabled={!nextEnabled}
                  >
                    <Text style={styles.nextButtonText}>Next</Text>
                  </TouchableOpacity>
                </View>
              )}
              <PaymentSheet
                visible={showPaymentSheet}
                onClose={() => setShowPaymentSheet(false)}
                totalCost={totalAmount}
                userEmail={formData.email || "default@example.com"}
                receiverNumber={receiverNumber || formData.phone || "N/A"}
                receiverName={receiverName || formData.name || "Anonymous"}
                onRedirect={handlePaymentRedirect}
                formatCurrency={formatPrice}
                paymentMethod={paymentMethod}
                selectedBank={selectedBank}
              />
            </>
          )}
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default CheckoutSheet;