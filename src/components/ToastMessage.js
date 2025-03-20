import Toast from "react-native-toast-message";
import { View, Text } from "react-native"; // Import View and Text

/**
 * Show Toast Notifications with Custom Styling & Better Handling
 */
export const showToast = (message, type = "success") => {
    if (type === "error") {
        console.error(`🔥 ERROR: ${message}`); // Log errors to console for debugging
    }

    Toast.show({
        type: type, // "success", "error", or "info"
        text1: type === "error" ? "❌ Error" : type === "info" ? "ℹ️ Info" : "✅ Success",
        text2: message,
        position: "top",
        visibilityTime: 4000,
        autoHide: true,
        topOffset: 50,
    });
};

/**
 * Toast Configuration for Global Styling
 */
export const toastConfig = {
    success: (props) => (
        <View
            style={{
                backgroundColor: "#28a745",
                borderRadius: 8,
                paddingVertical: 12,
                paddingHorizontal: 20,
                width: "90%",
                alignSelf: "center",
                marginTop: 50,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.2,
                shadowRadius: 4,
                elevation: 3,
            }}
        >
            <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}>{props.text1}</Text>
            <Text style={{ color: "#fff", fontSize: 14 }}>{props.text2}</Text>
        </View>
    ),
    error: (props) => (
        <View
            style={{
                backgroundColor: "#dc3545",
                borderRadius: 8,
                paddingVertical: 12,
                paddingHorizontal: 20,
                width: "90%",
                alignSelf: "center",
                marginTop: 50,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.2,
                shadowRadius: 4,
                elevation: 3,
            }}
        >
            <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}>{props.text1}</Text>
            <Text style={{ color: "#fff", fontSize: 14 }}>{props.text2}</Text>
        </View>
    ),
    info: (props) => (
        <View
            style={{
                backgroundColor: "#17a2b8",
                borderRadius: 8,
                paddingVertical: 12,
                paddingHorizontal: 20,
                width: "90%",
                alignSelf: "center",
                marginTop: 50,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.2,
                shadowRadius: 4,
                elevation: 3,
            }}
        >
            <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}>{props.text1}</Text>
            <Text style={{ color: "#fff", fontSize: 14 }}>{props.text2}</Text>
        </View>
    ),
};

export default Toast;