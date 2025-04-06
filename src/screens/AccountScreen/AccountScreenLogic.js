// src/screens/AccountScreen/AccountScreenLogic.js
import { useContext, useState, useEffect } from "react";
import { Alert, PanResponder, Animated, Dimensions } from "react-native";
import { AuthContext } from "../../context/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";

const UPDATE_CHECK_KEY = "@lastUpdateCheck";
const UPDATE_COUNT_KEY = "@updateCount";
const THREE_DAYS_MS = 3 * 24 * 60 * 60 * 1000;

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

const useAccountScreenLogic = (navigation) => {
  const { user, logout } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdateSheetVisible, setIsUpdateSheetVisible] = useState(false);
  const [updateCount, setUpdateCount] = useState(0);
  const [forceUpdate, setForceUpdate] = useState(false);
  const [isExpoGo, setIsExpoGo] = useState(false);
  const [isVendorStatusSheetVisible, setIsVendorStatusSheetVisible] = useState(false);

  const pan = useState(new Animated.ValueXY({ x: 0, y: 0 }))[0];
  const [widgetSize, setWidgetSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const detectExpoGo = () => {
      try {
        const appOwnership = Constants.appOwnership;
        const isExpoGoDetected = appOwnership === "expo";
        setIsExpoGo(isExpoGoDetected);
      } catch (error) {
        console.error("Error detecting Expo Go:", error);
        setIsExpoGo(false);
      }
    };

    const checkLastUpdate = async () => {
      const lastCheck = await AsyncStorage.getItem(UPDATE_CHECK_KEY);
      const storedCount = await AsyncStorage.getItem(UPDATE_COUNT_KEY);
      const count = storedCount ? parseInt(storedCount, 10) : 0;
      setUpdateCount(count);

      const now = new Date().getTime();
      const lastCheckTime = lastCheck ? parseInt(lastCheck, 10) : 0;
      const shouldForceUpdate = count > 0 && now - lastCheckTime > THREE_DAYS_MS;

      setForceUpdate(shouldForceUpdate);
      if (shouldForceUpdate) {
        setIsUpdateSheetVisible(true);
      }
    };

    detectExpoGo();
    checkLastUpdate();
  }, []);

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderGrant: () => {
      pan.setOffset({ x: pan.x._value, y: pan.y._value });
    },
    onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], { useNativeDriver: false }),
    onPanResponderRelease: () => {
      const x = Math.max(0, Math.min(pan.x._value, SCREEN_WIDTH - widgetSize.width));
      const y = Math.max(0, Math.min(pan.y._value, SCREEN_HEIGHT - widgetSize.height - 50));
      pan.setValue({ x, y });
      pan.flattenOffset();
    },
  });

  const handleLogout = () => {
    Alert.alert(
      "Confirm Logout",
      "Are you sure you want to log out?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Yes",
          onPress: async () => {
            setIsLoading(true);
            try {
              await logout();
            } finally {
              setIsLoading(false);
            }
          },
          style: "destructive",
        },
      ],
      { cancelable: true }
    );
  };

  const handleCheckForUpdate = () => {
    setIsUpdateSheetVisible(true);
  };

  const handleWidgetPress = () => {
    if (user?.hasAppliedForVendor) {
      setIsVendorStatusSheetVisible(true);
    } else {
      navigation.navigate("Vendor");
    }
  };

  return {
    user,
    isLoading,
    isUpdateSheetVisible,
    updateCount,
    forceUpdate,
    isExpoGo,
    isVendorStatusSheetVisible,
    pan,
    widgetSize,
    panResponder,
    setIsUpdateSheetVisible,
    setIsVendorStatusSheetVisible,
    setWidgetSize,
    handleLogout,
    handleCheckForUpdate,
    handleWidgetPress,
  };
};

export default useAccountScreenLogic;