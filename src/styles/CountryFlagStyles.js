import { StyleSheet } from "react-native";

export default StyleSheet.create({
    flagContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 8,
        padding: 10,
        marginBottom: 10,
        width: "100%",
    },
    flagText: {
        fontSize: 16,
        fontWeight: "bold",
    },
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.5)",
    },
    countryItem: {
        padding: 15,
        backgroundColor: "#FFF",
        marginBottom: 5,
        borderRadius: 8,
    },
});
