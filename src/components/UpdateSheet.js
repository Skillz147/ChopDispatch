import React, { useState, useEffect } from "react";
import { View, Text, Modal, TouchableOpacity, Alert } from "react-native";
import * as Updates from "expo-updates";
import LottieView from "lottie-react-native";
import * as Progress from "react-native-progress";
import loadingAnimation from "../../assets/lottie/loading.json";
import AsyncStorage from "@react-native-async-storage/async-storage";
import styles from "../styles/UpdateSheetStyles";
import colors from "../styles/colors";

const UPDATE_CHECK_KEY = "@lastUpdateCheck";
const UPDATE_COUNT_KEY = "@updateCount";
const THREE_DAYS_MS = 3 * 24 * 60 * 60 * 1000;

const UpdateSheet = ({ visible, onClose, forceUpdate = false, isExpoGo }) => {
  const [updateStatus, setUpdateStatus] = useState("checking");
  const [updateMessage, setUpdateMessage] = useState("Checking for updates...");
  const [updateCount, setUpdateCount] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const simulateProgress = async (stageDuration, nextStatus, nextMessage) => {
      let progressValue = 0;
      const interval = setInterval(() => {
        progressValue += 0.1;
        if (progressValue >= 1) {
          progressValue = 1;
          clearInterval(interval);
        }
        setProgress(progressValue);
      }, stageDuration / 10);

      await new Promise((resolve) => setTimeout(resolve, stageDuration));
      setUpdateStatus(nextStatus);
      setUpdateMessage(nextMessage);
      setProgress(0);
    };

    const simulateUpdateProcess = async () => {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setUpdateStatus("found");
      setUpdateMessage("Found an update!");

      setUpdateStatus("downloading");
      setUpdateMessage("Downloading update...");
      await simulateProgress(2000, "installing", "Installing update...");

      await simulateProgress(1500, "applied", "Update simulation complete. Restart in a release build to apply.");
    };

    const checkForUpdates = async () => {
      try {
        const lastCheck = await AsyncStorage.getItem(UPDATE_CHECK_KEY);
        const storedCount = await AsyncStorage.getItem(UPDATE_COUNT_KEY);
        const count = storedCount ? parseInt(storedCount, 10) : 0;
        setUpdateCount(count);

        const now = new Date().getTime();
        if (lastCheck && now - parseInt(lastCheck, 10) > THREE_DAYS_MS && count > 0 && !visible) {
          setUpdateCount(count);
          onClose();
          return;
        }

        // Check if running in development or Expo Go
        const isDevelopment = isExpoGo || __DEV__;
        if (isDevelopment) {
          await simulateUpdateProcess();
          await AsyncStorage.setItem(UPDATE_CHECK_KEY, now.toString());
          const newCount = count + 1;
          setUpdateCount(newCount);
          await AsyncStorage.setItem(UPDATE_COUNT_KEY, newCount.toString());
          return;
        }

        // Real update process for production builds
        const updateCheck = await Updates.checkForUpdateAsync();
        if (updateCheck.isAvailable) {
          setUpdateStatus("available");
          setUpdateMessage("A new update is available! Downloading...");

          await simulateProgress(2000, "downloading", "Installing update...");

          const updateFetch = await Updates.fetchUpdateAsync();
          if (updateFetch.isNew) {
            await simulateProgress(1500, "applied",
              forceUpdate
                ? "Update required! The app won’t work correctly until updated. Restart now."
                : "Update downloaded! Restart the app to apply the update."
            );

            await AsyncStorage.setItem(UPDATE_CHECK_KEY, now.toString());
            await AsyncStorage.setItem(UPDATE_COUNT_KEY, "0");
            setUpdateCount(0);

            if (forceUpdate) {
              Alert.alert("Update Required", "The app won’t work correctly until updated. Restart now?", [
                { text: "Restart", onPress: async () => await Updates.reloadAsync() },
              ], { cancelable: false });
            } else {
              Alert.alert("Update Ready", "The app needs to restart to apply the update. Restart now?", [
                { text: "Later", style: "cancel" },
                { text: "Restart", onPress: async () => await Updates.reloadAsync() },
              ]);
            }
          }
        } else {
          setUpdateStatus("applied");
          setUpdateMessage("No updates available. You're running the latest version!");
          await AsyncStorage.setItem(UPDATE_CHECK_KEY, now.toString());
          if (count > 0) {
            await AsyncStorage.setItem(UPDATE_COUNT_KEY, "0");
            setUpdateCount(0);
          }
        }
      } catch (error) {
        console.error("Error checking for updates:", error);
        setUpdateStatus("error");
        setUpdateMessage("Failed to check for updates. Please try again later.");
      }
    };

    if (visible || forceUpdate) {
      checkForUpdates();
    }
  }, [visible, forceUpdate, isExpoGo]);

  const renderContent = () => {
    if (["checking", "found"].includes(updateStatus)) {
      return (
        <View style={styles.animationContainer}>
          <LottieView source={loadingAnimation} autoPlay loop style={styles.lottie} />
          <Text style={styles.message}>{updateMessage}</Text>
        </View>
      );
    }

    if (["downloading", "installing"].includes(updateStatus)) {
      return (
        <View style={styles.animationContainer}>
          <Text style={styles.message}>{updateMessage}</Text>
          <Progress.Bar
            progress={progress}
            width={200}
            color={colors.primary}
            unfilledColor={colors.textLight}
            borderWidth={0}
            style={styles.progressBar}
          />
          <Text style={styles.progressText}>{Math.round(progress * 100)}%</Text>
        </View>
      );
    }

    return (
      <View style={styles.contentContainer}>
        <Text style={styles.message}>{updateMessage}</Text>
        {(updateStatus === "applied" || updateStatus === "error") && (
          <Text style={styles.note}>
            Note: This is a simulation. Build a release version to enable true push updates.
          </Text>
        )}
        {(updateStatus === "applied" || updateStatus === "error") && (
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.sheetContainer}>{renderContent()}</View>
      </View>
    </Modal>
  );
};

export default UpdateSheet;